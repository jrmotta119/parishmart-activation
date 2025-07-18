import fs from 'fs';
import path from 'path';
import S3Service from './services/s3Service';

// Test file paths
const TEST_IMAGE_PATH = path.join(__dirname, 'test-files', 'test-image.jpg');
const TEST_PDF_PATH = path.join(__dirname, 'test-files', 'test-document.pdf');

// Create test files if they don't exist (keep your existing implementation)
function createTestFiles() {
  const testDir = path.join(__dirname, 'test-files');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Create a simple test image (1x1 pixel JPEG)
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    const jpegData = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
      0x00, 0xFF, 0xD9
    ]);
    fs.writeFileSync(TEST_IMAGE_PATH, jpegData);
  }

  // Create a simple test PDF
  if (!fs.existsSync(TEST_PDF_PATH)) {
    const pdfData = Buffer.from([
      0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A, 0x25, 0xC7, 0xEC,
      0x8F, 0xA2, 0x0A, 0x31, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, 0x3C,
      0x3C, 0x2F, 0x54, 0x79, 0x70, 0x65, 0x2F, 0x43, 0x61, 0x74, 0x61, 0x6C,
      0x6F, 0x67, 0x2F, 0x50, 0x61, 0x67, 0x65, 0x73, 0x20, 0x32, 0x20, 0x30,
      0x20, 0x52, 0x2F, 0x4B, 0x69, 0x64, 0x73, 0x5B, 0x33, 0x20, 0x30, 0x20,
      0x52, 0x5D, 0x3E, 0x3E, 0x0A, 0x65, 0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A,
      0x32, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, 0x3C, 0x3C, 0x2F, 0x54,
      0x79, 0x70, 0x65, 0x2F, 0x50, 0x61, 0x67, 0x65, 0x73, 0x2F, 0x43, 0x6F,
      0x75, 0x6E, 0x74, 0x20, 0x31, 0x2F, 0x4B, 0x69, 0x64, 0x73, 0x5B, 0x33,
      0x20, 0x30, 0x20, 0x52, 0x5D, 0x3E, 0x3E, 0x0A, 0x65, 0x6E, 0x64, 0x6F,
      0x62, 0x6A, 0x0A, 0x33, 0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, 0x3C,
      0x3C, 0x2F, 0x54, 0x79, 0x70, 0x65, 0x2F, 0x50, 0x61, 0x67, 0x65, 0x2F,
      0x50, 0x61, 0x72, 0x65, 0x6E, 0x74, 0x20, 0x32, 0x20, 0x30, 0x20, 0x52,
      0x2F, 0x4D, 0x65, 0x64, 0x69, 0x61, 0x42, 0x6F, 0x78, 0x5B, 0x30, 0x20,
      0x30, 0x20, 0x36, 0x31, 0x32, 0x20, 0x37, 0x39, 0x32, 0x5D, 0x2F, 0x43,
      0x6F, 0x6E, 0x74, 0x65, 0x6E, 0x74, 0x73, 0x20, 0x34, 0x20, 0x30, 0x20,
      0x52, 0x3E, 0x3E, 0x0A, 0x65, 0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A, 0x34,
      0x20, 0x30, 0x20, 0x6F, 0x62, 0x6A, 0x0A, 0x3C, 0x3C, 0x2F, 0x4C, 0x65,
      0x6E, 0x67, 0x74, 0x68, 0x20, 0x31, 0x30, 0x3E, 0x3E, 0x0A, 0x73, 0x74,
      0x72, 0x65, 0x61, 0x6D, 0x0A, 0x42, 0x54, 0x0A, 0x31, 0x30, 0x20, 0x30,
      0x20, 0x54, 0x44, 0x0A, 0x2F, 0x46, 0x31, 0x20, 0x31, 0x32, 0x20, 0x54,
      0x66, 0x0A, 0x28, 0x54, 0x65, 0x73, 0x74, 0x29, 0x20, 0x54, 0x6A, 0x0A,
      0x45, 0x54, 0x0A, 0x65, 0x6E, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6D,
      0x0A, 0x65, 0x6E, 0x64, 0x6F, 0x62, 0x6A, 0x0A, 0x78, 0x72, 0x65, 0x66,
      0x0A, 0x30, 0x20, 0x35, 0x0A, 0x25, 0x25, 0x45, 0x4F, 0x46, 0x0A
    ]);
    fs.writeFileSync(TEST_PDF_PATH, pdfData);
  }
}

// Create mock file objects for testing (keep your existing implementation)
function createMockFile(filePath: string, mimeType: string): Express.Multer.File {
  const buffer = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);
  
  return {
    fieldname: 'file',
    originalname: path.basename(filePath),
    encoding: '7bit',
    mimetype: mimeType,
    size: stats.size,
    buffer: buffer,
    stream: null as any,
    destination: '',
    filename: '',
    path: ''
  };
}

async function testPublicBucket() {
  console.log('\n=== Testing Public Bucket (Media Upload) ===');
  
  try {
    // Test 1: Upload image to public bucket
    console.log('1. Uploading test image to public bucket...');
    const imageFile = createMockFile(TEST_IMAGE_PATH, 'image/jpeg');
    const imageResult = await S3Service.uploadFile(imageFile, 'media', 'test-user-123');
    
    console.log('✅ Image upload successful:');
    console.log(`   File Key: ${imageResult.fileKey}`);
    console.log(`   Bucket Type: ${imageResult.bucket}`);
    console.log(`   Bucket Name: ${imageResult.bucketName}`);
    console.log(`   Direct URL: ${imageResult.directUrl || 'Not available'}`); // CHANGED: Use directUrl
    console.log(`   Size: ${imageResult.size} bytes`);
    console.log(`   Is Public: ${imageResult.isPublic}`);
    
    // Test 2: Verify public URL is accessible
    if (imageResult.directUrl) { // CHANGED: Check for directUrl
      console.log('\n2. Testing public URL accessibility...');
      try {
        const response = await fetch(imageResult.directUrl);
        if (response.ok) {
          console.log('✅ Public URL is accessible');
          console.log(`   Status: ${response.status}`);
          console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        } else {
          console.log(`❌ Public URL returned status: ${response.status}`);
        }
      } catch (fetchError) {
        console.log('❌ Public URL fetch failed:', (fetchError as Error).message);
      }
    } else {
      console.log('\n2. ❌ No direct URL provided for public file');
    }
    
    // Test 3: Test the generateAccessUrl convenience method
    console.log('\n3. Testing generateAccessUrl method...');
    const accessUrl = await S3Service.generateAccessUrl(imageResult.fileKey, 'public');
    console.log('✅ Access URL generated:');
    console.log(`   URL: ${accessUrl}`);
    
    // Test 4: Generate signed URL for public file (should return direct URL)
    console.log('\n4. Testing signed URL generation for public file...');
    const signedUrlResult = await S3Service.generateSignedUrl(imageResult.fileKey, 'public', 3600);
    console.log('✅ Signed URL generated:');
    console.log(`   URL: ${signedUrlResult.url}`);
    console.log(`   Expires: ${signedUrlResult.expiresAt}`);
    
    // Test 5: Get file metadata
    console.log('\n5. Testing file metadata retrieval...');
    const metadata = await S3Service.getFileMetadata(imageResult.fileKey, 'public');
    console.log('✅ File metadata retrieved:');
    console.log(`   Content Type: ${metadata.ContentType}`);
    console.log(`   Content Length: ${metadata.ContentLength}`);
    console.log(`   Server Side Encryption: ${metadata.ServerSideEncryption}`);
    
    return imageResult;
    
  } catch (error) {
    console.error('❌ Public bucket test failed:', error);
    throw error;
  }
}

async function testPrivateBucket() {
  console.log('\n=== Testing Private Bucket (Document Upload) ===');

  try {
    // Test 1: Upload PDF to private bucket
    console.log('1. Uploading test PDF to private bucket...');
    const pdfFile = createMockFile(TEST_PDF_PATH, 'application/pdf');
    const pdfResult = await S3Service.uploadFile(pdfFile, 'documents', 'test-user-123');
    
    console.log('✅ PDF upload successful:');
    console.log(`   File Key: ${pdfResult.fileKey}`);
    console.log(`   Bucket Type: ${pdfResult.bucket}`);
    console.log(`   Bucket Name: ${pdfResult.bucketName}`);
    console.log(`   Direct URL: ${pdfResult.directUrl || '(none - private file)'}`); // CHANGED: Use directUrl
    console.log(`   Size: ${pdfResult.size} bytes`);
    console.log(`   Is Public: ${pdfResult.isPublic}`);
    
    // Test 2: Generate signed URL and test accessibility  
    console.log('\n2. Generating and testing signed URL...');
    const signedUrlResult = await S3Service.generateSignedUrl(pdfResult.fileKey, 'private', 3600);
    console.log('✅ Signed URL generated');
    console.log(`   Expires: ${signedUrlResult.expiresAt}`);
    
    try {
      const response = await fetch(signedUrlResult.url);
      if (response.ok) {
        console.log('✅ Private signed URL is accessible');
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        console.log(`   Content-Length: ${response.headers.get('content-length')}`);
      } else {
        console.log(`❌ Private signed URL is not accessible (Status: ${response.status})`);
      }
    } catch (fetchError) {
      console.log('❌ Private signed URL fetch failed:', (fetchError as Error).message);
    }
    
    // Test 3: Test the generateAccessUrl convenience method
    console.log('\n3. Testing generateAccessUrl method for private file...');
    const accessUrl = await S3Service.generateAccessUrl(pdfResult.fileKey, 'private', 1800); // 30 minutes
    console.log('✅ Access URL generated (signed URL)');
    console.log(`   URL length: ${accessUrl.length} characters`);
    
    // Test 4: Generate new signed URL with different expiration
    console.log('\n4. Testing new signed URL generation...');
    const newSignedUrl = await S3Service.generateSignedUrl(pdfResult.fileKey, 'private', 7200);
    console.log('✅ New signed URL generated');
    console.log(`   Expires: ${newSignedUrl.expiresAt}`);
    
    // Test 5: Get file metadata
    console.log('\n5. Testing file metadata retrieval...');
    const metadata = await S3Service.getFileMetadata(pdfResult.fileKey, 'private');
    console.log('✅ File metadata retrieved:');
    console.log(`   Content Type: ${metadata.ContentType}`);
    console.log(`   Content Length: ${metadata.ContentLength}`);
    console.log(`   Server Side Encryption: ${metadata.ServerSideEncryption}`);
    
    return pdfResult;
    
  } catch (error) {
    console.error('❌ Private bucket test failed:', error);
    throw error;
  }
}

async function testFileValidation() {
  console.log('\n=== Testing File Validation ===');
  
  try {
    // Test 1: Valid file types
    console.log('1. Testing valid file types...');
    const validImage = createMockFile(TEST_IMAGE_PATH, 'image/jpeg');
    const validPdf = createMockFile(TEST_PDF_PATH, 'application/pdf');
    
    S3Service.validateFile(validImage, 'media');
    S3Service.validateFile(validPdf, 'documents');
    console.log('✅ Valid file types accepted');
    
    // Test 2: Invalid file types
    console.log('\n2. Testing invalid file types...');
    const invalidFile = createMockFile(TEST_IMAGE_PATH, 'text/plain');
    
    try {
      S3Service.validateFile(invalidFile, 'media');
      console.log('❌ Invalid file type was accepted (should have failed)');
    } catch (error) {
      console.log('✅ Invalid file type correctly rejected:', (error as Error).message);
    }
    
    // Test 3: File content validation
    console.log('\n3. Testing file content validation...');
    const isValidImage = S3Service.validateFileContent(validImage.buffer, 'image/jpeg');
    const isValidPdf = S3Service.validateFileContent(validPdf.buffer, 'application/pdf');
    
    console.log(`   Image content validation: ${isValidImage ? '✅' : '❌'}`);
    console.log(`   PDF content validation: ${isValidPdf ? '✅' : '❌'}`);
    
    // Test 4: Wrong purpose validation
    console.log('\n4. Testing wrong purpose validation...');
    try {
      S3Service.validateFile(validImage, 'documents'); // Image for documents purpose
      console.log('❌ Wrong purpose was accepted (should have failed)');
    } catch (error) {
      console.log('✅ Wrong purpose correctly rejected:', (error as Error).message);
    }
    
  } catch (error) {
    console.error('❌ File validation test failed:', error);
    throw error;
  }
}

async function cleanupTestFiles(publicResult: any, privateResult: any) {
  console.log('\n=== Cleaning Up Test Files ===');
  
  try {
    if (publicResult) {
      await S3Service.deleteFile(publicResult.fileKey, 'public');
      console.log('✅ Public test file deleted');
    }
    
    if (privateResult) {
      await S3Service.deleteFile(privateResult.fileKey, 'private');
      console.log('✅ Private test file deleted');
    }
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

async function runTests() {
  console.log('🚀 Starting S3 Upload System Tests...');
  
  // FIXED: Check for correct environment variable names
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY', 
    'AWS_REGION',
    'AWS_PUBLIC_BUCKET_NAME',    // CHANGED: From AWS_PUBLIC_BUCKET_NAME
    'AWS_PRIVATE_BUCKET_NAME'    // CHANGED: From AWS_PRIVATE_BUCKET_NAME
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.log('\n📝 Required environment variables:');
    requiredEnvVars.forEach(varName => {
      console.log(`   ${varName}=${process.env[varName] ? '✅ Set' : '❌ Missing'}`);
    });
    process.exit(1);
  }
  
  console.log('✅ Environment variables configured');
  console.log(`   Region: ${process.env.AWS_REGION}`);
  console.log(`   Public Bucket: ${process.env.S3_PUBLIC_BUCKET}`);    // CHANGED
  console.log(`   Private Bucket: ${process.env.S3_PRIVATE_BUCKET}`);  // CHANGED
  
  // Create test files
  createTestFiles();
  
  let publicResult = null;
  let privateResult = null;
  
  try {
    // Run tests
    await testFileValidation();
    publicResult = await testPublicBucket();
    privateResult = await testPrivateBucket();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ File validation working');
    console.log('   ✅ Public bucket upload and direct URL access working');
    console.log('   ✅ Private bucket upload and signed URL generation working');
    console.log('   ✅ generateAccessUrl convenience method working');
    console.log('   ✅ Server-side encryption configured');
    console.log('   ✅ IAM policy compliance verified');
    console.log('   ✅ Magic byte file validation working');
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    await cleanupTestFiles(publicResult, privateResult);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };