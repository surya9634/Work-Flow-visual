/**
 * Facebook Messenger Integration Test Script
 * 
 * This script tests your Facebook Messenger integration endpoints
 * Run with: node test-facebook-integration.js
 */

const axios = require('axios');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || 'your_test_token_here';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

/**
 * Test 1: Check if backend is running
 */
async function testBackendHealth() {
  log.info('Test 1: Checking backend health...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/integrations`);
    log.success('Backend is running');
    return true;
  } catch (error) {
    log.error(`Backend not accessible: ${error.message}`);
    return false;
  }
}

/**
 * Test 2: Test Facebook OAuth URL generation
 */
async function testFacebookAuthUrl() {
  log.info('Test 2: Testing Facebook OAuth URL generation...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/integrations/facebook/auth`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    if (response.data.authUrl && response.data.authUrl.includes('facebook.com')) {
      log.success('Facebook OAuth URL generated successfully');
      log.info(`OAuth URL: ${response.data.authUrl.substring(0, 100)}...`);
      return true;
    } else {
      log.error('Invalid OAuth URL response');
      return false;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      log.warning('Authentication required - Update AUTH_TOKEN in script');
    } else {
      log.error(`OAuth URL generation failed: ${error.message}`);
    }
    return false;
  }
}

/**
 * Test 3: Test webhook verification endpoint
 */
async function testWebhookVerification() {
  log.info('Test 3: Testing webhook verification...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/webhooks/facebook`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': process.env.FB_WEBHOOK_VERIFY_TOKEN || 'test_token',
        'hub.challenge': 'test_challenge_123'
      }
    });
    
    if (response.data === 'test_challenge_123') {
      log.success('Webhook verification working correctly');
      return true;
    } else {
      log.error('Webhook verification returned unexpected response');
      return false;
    }
  } catch (error) {
    if (error.response?.status === 403) {
      log.error('Webhook verification failed - Check FB_WEBHOOK_VERIFY_TOKEN');
    } else {
      log.error(`Webhook verification failed: ${error.message}`);
    }
    return false;
  }
}

/**
 * Test 4: Test integration status check
 */
async function testIntegrationStatus() {
  log.info('Test 4: Testing integration status check...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/integrations/facebook/status`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    log.success('Integration status endpoint working');
    log.info(`Facebook connected: ${response.data.connected ? 'Yes' : 'No'}`);
    
    if (response.data.connected) {
      log.info(`Page: ${response.data.platformData?.pageName || 'Unknown'}`);
      log.info(`Connected: ${new Date(response.data.connectedAt).toLocaleString()}`);
    }
    
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      log.warning('Authentication required - Update AUTH_TOKEN in script');
    } else {
      log.error(`Status check failed: ${error.message}`);
    }
    return false;
  }
}

/**
 * Test 5: Test webhook POST endpoint (simulated)
 */
async function testWebhookPost() {
  log.info('Test 5: Testing webhook POST endpoint...');
  try {
    // Simulate a Facebook webhook event
    const webhookEvent = {
      object: 'page',
      entry: [{
        id: 'test_page_id',
        time: Date.now(),
        messaging: [{
          sender: { id: 'test_sender_id' },
          recipient: { id: 'test_recipient_id' },
          timestamp: Date.now(),
          message: {
            mid: 'test_message_id',
            text: 'Test message'
          }
        }]
      }]
    };
    
    const response = await axios.post(
      `${BACKEND_URL}/api/webhooks/facebook`,
      webhookEvent
    );
    
    if (response.status === 200 && response.data === 'EVENT_RECEIVED') {
      log.success('Webhook POST endpoint working');
      log.warning('Note: This was a simulated event, no actual processing occurred');
      return true;
    } else {
      log.error('Unexpected webhook response');
      return false;
    }
  } catch (error) {
    log.error(`Webhook POST test failed: ${error.message}`);
    return false;
  }
}

/**
 * Test 6: Check environment variables
 */
function testEnvironmentVariables() {
  log.info('Test 6: Checking environment variables...');
  
  const requiredVars = [
    'FB_APP_ID',
    'FB_APP_SECRET',
    'FB_WEBHOOK_VERIFY_TOKEN',
    'BACKEND_URL',
    'FRONTEND_URL',
    'JWT_SECRET'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      log.success(`${varName} is set`);
    } else {
      log.warning(`${varName} is not set`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('Facebook Messenger Integration Test Suite');
  console.log('='.repeat(60) + '\n');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };
  
  // Run tests
  const tests = [
    { name: 'Backend Health', fn: testBackendHealth },
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Facebook OAuth URL', fn: testFacebookAuthUrl },
    { name: 'Webhook Verification', fn: testWebhookVerification },
    { name: 'Integration Status', fn: testIntegrationStatus },
    { name: 'Webhook POST', fn: testWebhookPost }
  ];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        results.passed++;
      } else {
        results.failed++;
      }
    } catch (error) {
      log.error(`Test "${test.name}" threw an error: ${error.message}`);
      results.failed++;
    }
    console.log(''); // Empty line between tests
  }
  
  // Summary
  console.log('='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log('='.repeat(60) + '\n');
  
  // Recommendations
  if (results.failed > 0) {
    console.log('📋 Recommendations:');
    console.log('1. Check that your backend server is running');
    console.log('2. Verify all environment variables are set correctly');
    console.log('3. Update AUTH_TOKEN in this script with a valid JWT token');
    console.log('4. Ensure FB_WEBHOOK_VERIFY_TOKEN matches Facebook app settings');
    console.log('5. Check backend logs for detailed error messages\n');
  } else {
    console.log('🎉 All tests passed! Your Facebook integration is ready.\n');
    console.log('Next steps:');
    console.log('1. Configure Facebook App settings (see FACEBOOK_QUICK_START.md)');
    console.log('2. Add FacebookIntegration component to your frontend');
    console.log('3. Test the complete OAuth flow');
    console.log('4. Send a test message to your Facebook Page\n');
  }
}

// Run tests
runTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
});
