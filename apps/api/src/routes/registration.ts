import express, { Request, Response } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { RegistrationService } from '../services/registrationService';
import { HTTP_STATUS } from '@parishmart/shared';

const router = express.Router();

// Max 5 registration submissions per IP per hour
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many registration attempts. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();


// Configure multer with file limits - use .any() to handle all fields including text
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB max per file
    files: 100, // Max 100 files total
    fields: 1000, // Max 1000 non-file fields
    fieldSize: 10 * 1024 * 1024 // Max 10MB for each field value
  }
}).any(); // Accept any field names (both files and text)

/**
 * POST /api/registration
 * Handle both vendor and store registrations with file uploads
 */
router.post('/', registrationLimiter, upload, async (req: Request, res: Response) => {
  try {
    const { registrationType, ...formData } = req.body;
    
    // When using .any(), req.files is an array, so we need to group by fieldname
    const fileArray = req.files as Express.Multer.File[];
    const files: { [fieldname: string]: Express.Multer.File[] } = {};
    
    if (fileArray) {
      fileArray.forEach(file => {
        if (!files[file.fieldname]) {
          files[file.fieldname] = [];
        }
        files[file.fieldname].push(file);
      });
    }

    console.log('Registration request received:', {
      type: registrationType,
      files: Object.keys(files || {}),
      formDataKeys: Object.keys(formData),
      fullRequestBody: req.body
    });

    if (!registrationType || !['vendor', 'store'].includes(registrationType)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Invalid registration type. Must be "vendor" or "store".'
      });
    }

    // Parse external location IDs (arrive as strings from multipart FormData)
    const parseId = (v: unknown) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : undefined; };
    if (formData.externalCountryId)      formData.externalCountryId      = parseId(formData.externalCountryId);
    if (formData.externalStateId)        formData.externalStateId        = parseId(formData.externalStateId);
    if (formData.externalCityId)         formData.externalCityId         = parseId(formData.externalCityId);
    if (formData.externalMissionStoreId) formData.externalMissionStoreId = parseId(formData.externalMissionStoreId);

    let result;

    if (registrationType === 'vendor') {
      result = await RegistrationService.processVendorRegistration(formData, files);
    } else {
      result = await RegistrationService.processStoreRegistration(formData, files);
    }

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: `${registrationType} registration completed successfully`,
      data: result
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Duplicate email (PostgreSQL unique constraint violation)
    if ((error as any)?.code === '23505') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'An account with this email address already exists. Please use a different email or contact support.'
      });
    }

    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: error.message
        });
      }

      // Handle file upload errors
      if (error.message.includes('file') || error.message.includes('upload')) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: error.message
        });
      }
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

/**
 * GET /api/registration/status/:token
 * Check registration status using approval token
 */
router.get('/status/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const status = await RegistrationService.checkRegistrationStatus(token);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
});

export default router; 