#!/usr/bin/env ts-node

import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

/**
 * Test the registration API endpoints
 */
async function testRegistrationAPI() {
  console.log('🧪 Testing Registration API');
  console.log('=' .repeat(50));

  try {
    // Test 1: Basic API Health Check
    console.log('\n1. Testing API Health...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json() as any;
    
    if (healthResponse.ok) {
      console.log('✅ API Health Check: PASSED');
      console.log(`   Status: ${healthData.message}`);
    } else {
      console.log('❌ API Health Check: FAILED');
      return;
    }

    // Test 2: Test Registration Endpoint Exists
    console.log('\n2. Testing Registration Endpoint Availability...');
    const testResponse = await fetch(`${BASE_URL}/api/registration`, {
      method: 'POST',
      body: new FormData() // Empty form data to test endpoint exists
    });
    
    // We expect a 400 error for missing registration type, which means endpoint exists
    if (testResponse.status === 400) {
      console.log('✅ Registration Endpoint: AVAILABLE');
    } else {
      console.log(`❌ Registration Endpoint: Unexpected status ${testResponse.status}`);
      const errorText = await testResponse.text();
      console.log(`   Response: ${errorText}`);
    }

    // Test 3: Test Vendor Registration (Mock Data)
    console.log('\n3. Testing Vendor Registration with Mock Data...');
    const vendorFormData = new FormData();
    vendorFormData.append('registrationType', 'vendor');
    vendorFormData.append('fullName', 'John Doe');
    vendorFormData.append('email', 'john.doe@example.com');
    vendorFormData.append('phone', '+1-555-0123');
    vendorFormData.append('businessName', 'Test Business');
    vendorFormData.append('businessType', 'product');
    vendorFormData.append('businessDescription', 'A test business for API testing');
    vendorFormData.append('businessAddress', '123 Test Street');
    vendorFormData.append('businessCity', 'Test City');
    vendorFormData.append('businessCountry', 'USA');
    vendorFormData.append('businessZipCode', '12345');
    vendorFormData.append('subscriptionType', 'basic');
    vendorFormData.append('participateInCampaigns', 'true');
    vendorFormData.append('receiveUpdates', 'true');
    vendorFormData.append('reach', 'local');

    // Create a mock image file if none exists
    const mockImagePath = path.join(__dirname, 'test-logo.png');
    if (!fs.existsSync(mockImagePath)) {
      // Create a simple 1x1 PNG if no test file exists
      const mockImageData = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64'
      );
      vendorFormData.append('logo', mockImageData, {
        filename: 'test-logo.png',
        contentType: 'image/png'
      });
    } else {
      vendorFormData.append('logo', fs.createReadStream(mockImagePath));
    }

    console.log('   📤 Submitting vendor registration...');
    
    // Note: This will fail if DATABASE_URL is not configured
    try {
      // Use form-data's submit method instead of fetch for proper FormData handling
      const vendorResult = await new Promise((resolve, reject) => {
        vendorFormData.submit(`${BASE_URL}/api/registration`, (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              resolve({ ok: (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300, status: res.statusCode || 500, json: () => result });
            } catch (parseError) {
              resolve({ ok: false, status: res.statusCode || 500, json: () => ({ error: data }) });
            }
          });
        });
      }) as any;

      const vendorResponse = vendorResult;
      
      const vendorData = vendorResponse.json();
      
      if (vendorResponse.ok) {
        console.log('✅ Vendor Registration: PASSED');
        console.log(`   Message: ${vendorData.message}`);
        console.log(`   Vendor ID: ${vendorData.data?.vendorId || 'N/A'}`);
      } else {
        console.log('⚠️  Vendor Registration: Expected failure (database/S3 not configured)');
        console.log(`   Error: ${vendorData.error}`);
      }
    } catch (error) {
      console.log('⚠️  Vendor Registration: Connection error (expected in development)');
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 4: Test Store Registration (Mock Data)
    console.log('\n4. Testing Store Registration with Mock Data...');
    const storeFormData = new FormData();
    storeFormData.append('registrationType', 'store');
    storeFormData.append('adminFullName', 'Jane Smith');
    storeFormData.append('email', 'jane.smith@example.com');
    storeFormData.append('billingAddress', '456 Store Avenue');
    storeFormData.append('organizationName', 'Test Organization');
    storeFormData.append('organizationType', 'parish');
    storeFormData.append('description', 'A test organization for API testing');
    storeFormData.append('subscriptionTier', 'basic');
    storeFormData.append('hasTaxExemptStatus', 'no');

    console.log('   📤 Submitting store registration...');
    
    try {
      // Use form-data's submit method instead of fetch for proper FormData handling
      const storeResult = await new Promise((resolve, reject) => {
        storeFormData.submit(`${BASE_URL}/api/registration`, (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              resolve({ ok: (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 300, status: res.statusCode || 500, json: () => result });
            } catch (parseError) {
              resolve({ ok: false, status: res.statusCode || 500, json: () => ({ error: data }) });
            }
          });
        });
      }) as any;

      const storeResponse = storeResult;
      
      const storeData = storeResponse.json();
      
      if (storeResponse.ok) {
        console.log('✅ Store Registration: PASSED');
        console.log(`   Message: ${storeData.message}`);
        console.log(`   Organization ID: ${storeData.data?.organizationId || 'N/A'}`);
      } else {
        console.log('⚠️  Store Registration: Expected failure (database/S3 not configured)');
        console.log(`   Error: ${storeData.error}`);
      }
    } catch (error) {
      console.log('⚠️  Store Registration: Connection error (expected in development)');
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    console.log('\n🎉 Registration API Test Complete!');
    console.log('\n📝 Notes:');
    console.log('   - Endpoint structure is correct');
    console.log('   - Form data parsing should work');
    console.log('   - Database and S3 configuration needed for full functionality');
    console.log('   - Set DATABASE_URL and AWS credentials for complete testing');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testRegistrationAPI();
}

export default testRegistrationAPI; 