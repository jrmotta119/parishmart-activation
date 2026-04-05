import { Router, Request, Response } from 'express';
import { HTTP_STATUS } from '@parishmart/shared';
import { query } from '../db/connection';

const router = Router();

// GET /api/vendors/missions
router.get('/missions', async (req: Request, res: Response) => {
  try {
    console.log('📋 Fetching missions from database...');

    // Query the missions table for mission names (only selecting columns that exist)
    const result = await query(`
      SELECT mission_id, mission_name
      FROM missions
      ORDER BY mission_name ASC
    `);

    console.log(`✅ Found ${result.rows.length} missions`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.rows,
      message: `Successfully retrieved ${result.rows.length} missions`
    });

  } catch (error) {
    console.error('❌ Error fetching missions:', error);

    // Check if the error is related to table not existing
    if (error instanceof Error && error.message.includes('relation "missions" does not exist')) {
      console.log('⚠️ Missions table does not exist, returning default missions list');

      // Return a default list of missions if table doesn't exist yet
      const defaultMissions = [
        { mission_id: 'default-1', mission_name: "St. Mary's Parish", description: 'Traditional Catholic Parish', active: true },
        { mission_id: 'default-2', mission_name: "St. Joseph's Church", description: 'Community focused church', active: true },
        { mission_id: 'default-3', mission_name: 'Holy Trinity Parish', description: 'Family oriented parish', active: true },
        { mission_id: 'default-4', mission_name: 'Sacred Heart Church', description: 'Historic Catholic church', active: true },
        { mission_id: 'default-5', mission_name: "St. Patrick's Cathedral", description: 'Cathedral parish', active: true },
        { mission_id: 'default-6', mission_name: 'Our Lady of Perpetual Help', description: 'Devotional parish', active: true },
        { mission_id: 'default-7', mission_name: 'St. Francis of Assisi', description: 'Franciscan community', active: true },
        { mission_id: 'default-8', mission_name: 'Christ the King Parish', description: 'Modern Catholic community', active: true },
        { mission_id: 'default-9', mission_name: 'Immaculate Conception Church', description: 'Traditional parish', active: true },
        { mission_id: 'default-10', mission_name: 'St. Thomas Aquinas Parish', description: 'Educational focused parish', active: true }
      ];

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: defaultMissions,
        message: 'Retrieved default missions list (table not yet created)',
        isDefault: true
      });
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch missions',
        error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
      });
    }
  }
});


// POST /api/vendors/update-missions - Update missions and responsible data from PDF (dev only)
router.post('/update-missions', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false, error: 'Not found' });
  }
  try {
    console.log('🔄 Updating missions and responsible data from PDF...');

    // Import the script content
    const fs = require('fs');
    const path = require('path');
    const scriptPath = path.join(__dirname, '../scripts/complete_missions_data.sql');

    if (!fs.existsSync(scriptPath)) {
      throw new Error('SQL script file not found');
    }

    const sqlScript = fs.readFileSync(scriptPath, 'utf8');

    // Execute the SQL script
    await query(sqlScript);

    // Get updated counts
    const missionCount = await query('SELECT COUNT(*) as count FROM missions');
    const responsibleCount = await query('SELECT COUNT(*) as count FROM responsible');

    console.log(`✅ Missions updated: ${missionCount.rows[0].count} total missions`);
    console.log(`✅ Responsible records: ${responsibleCount.rows[0].count} total responsible persons`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        totalMissions: missionCount.rows[0].count,
        totalResponsible: responsibleCount.rows[0].count
      },
      message: 'Missions and responsible data updated successfully from PDF'
    });

  } catch (error) {
    console.error('❌ Error updating missions data:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update missions data',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// POST /api/vendors/add-remaining-parishes - Add all remaining parishes from complete PDF analysis (dev only)
router.post('/add-remaining-parishes', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ success: false, error: 'Not found' });
  }
  try {
    console.log('🔄 Adding remaining parishes, Eastern Rite churches, and hospitals from PDF...');

    // Import the script content
    const fs = require('fs');
    const path = require('path');
    const scriptPath = path.join(__dirname, '../scripts/add_remaining_parishes.sql');

    if (!fs.existsSync(scriptPath)) {
      throw new Error('SQL script file not found');
    }

    const sqlScript = fs.readFileSync(scriptPath, 'utf8');

    // Execute the SQL script
    await query(sqlScript);

    // Get updated counts
    const missionCount = await query('SELECT COUNT(*) as count FROM missions');
    const responsibleCount = await query('SELECT COUNT(*) as count FROM responsible');

    console.log(`✅ All parishes added: ${missionCount.rows[0].count} total missions`);
    console.log(`✅ All responsible records: ${responsibleCount.rows[0].count} total responsible persons`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        totalMissions: missionCount.rows[0].count,
        totalResponsible: responsibleCount.rows[0].count
      },
      message: 'All remaining parishes, Eastern Rite churches, and hospitals added successfully from PDF'
    });

  } catch (error) {
    console.error('❌ Error adding remaining parishes:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add remaining parishes',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error'
    });
  }
});

// GET /api/vendors
router.get('/', async (req: Request, res: Response) => {
  // TODO: Implement get vendors logic
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Get vendors endpoint - to be implemented',
  });
});

// POST /api/vendors
router.post('/', async (req: Request, res: Response) => {
  // TODO: Implement create vendor logic
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Create vendor endpoint - to be implemented',
  });
});

// GET /api/vendors/:id
router.get('/:id', async (req: Request, res: Response) => {
  // TODO: Implement get vendor by id logic
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Get vendor ${req.params.id} endpoint - to be implemented`,
  });
});

// PUT /api/vendors/:id
router.put('/:id', async (req: Request, res: Response) => {
  // TODO: Implement update vendor logic
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Update vendor ${req.params.id} endpoint - to be implemented`,
  });
});

// POST /api/vendors/:id/verify
router.post('/:id/verify', async (req: Request, res: Response) => {
  // TODO: Implement vendor verification logic
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Verify vendor ${req.params.id} endpoint - to be implemented`,
  });
});

export default router; 