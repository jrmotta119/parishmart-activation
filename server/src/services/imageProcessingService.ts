/**
 * ImageProcessingService
 * Client for the ImaMod external image processing API.
 *
 * Flow:
 *   1. submitJob()  → POST /api/process-seller → returns job_id
 *   2. ImaMod calls our webhook (POST /api/webhook/image-processing) when done
 *   3. pollJob()    → GET /api/job/{job_id} (fallback polling if webhook missed)
 */

const IMAMOD_BASE_URL = process.env.IMAMOD_API_URL || '';
const IMAMOD_API_KEY  = process.env.IMAMOD_API_KEY  || '';

export interface ProcessSellerPayload {
  seller_id: string;           // "V-{vendorId}" or "S-{organizationId}"
  store_name: string;
  logo_url?: string;           // any public URL — S3 or external
  images_for_banner: string[]; // 1–5 public image URLs
  merchandise?: string[];      // store-only; omit for vendor-only logo/banner processing
  skip_background_removal: boolean;
  webhook_url: string;         // our callback endpoint
}

export interface JobResult {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  results?: {
    seller_id: string;           // echoed back from our submitJob payload
    store_name?: string;
    logo?: {
      url: string;
      type?: string;             // e.g. 'png'
    };
    banner?: {
      url: string;
      width?: number;
      height?: number;
    };
    merchandise?: Record<string, string>; // e.g. { tshirt: url, cap: url, hoodie: url }
  };
  error?: string | null;
}

function headers() {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': IMAMOD_API_KEY,
  };
}

export class ImageProcessingService {
  /**
   * Submit an image processing job.
   * Returns the job_id assigned by ImaMod.
   */
  static async submitJob(payload: ProcessSellerPayload): Promise<string> {
    if (!IMAMOD_BASE_URL) {
      throw new Error('IMAMOD_API_URL is not configured');
    }

    const res = await fetch(`${IMAMOD_BASE_URL}/api/process-seller`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ImaMod submitJob failed (${res.status}): ${text}`);
    }

    const data = await res.json() as { job_id: string };
    if (!data.job_id) {
      throw new Error('ImaMod submitJob response missing job_id');
    }

    console.log(`✅ ImaMod job submitted: ${data.job_id} for seller ${payload.seller_id}`);
    return data.job_id;
  }

  /**
   * Poll for job status.
   * Use as a fallback if the webhook is not received.
   */
  static async pollJob(jobId: string): Promise<JobResult> {
    if (!IMAMOD_BASE_URL) {
      throw new Error('IMAMOD_API_URL is not configured');
    }

    const res = await fetch(`${IMAMOD_BASE_URL}/api/job/${jobId}`, {
      headers: headers(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ImaMod pollJob failed (${res.status}): ${text}`);
    }

    return res.json() as Promise<JobResult>;
  }
}
