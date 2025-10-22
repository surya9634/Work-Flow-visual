/**
 * Facebook Integration Configuration Checker
 * 
 * Run this script to diagnose Facebook OAuth issues:
 * node check-facebook-config.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

console.log('\n' + '='.repeat(70));
console.log('🔍 Facebook Integration Configuration Check');
console.log('='.repeat(70) + '\n');

// Check required environment variables
const requiredVars = {
  'FB_APP_ID': process.env.FB_APP_ID,
  'FB_APP_SECRET': process.env.FB_APP_SECRET,
  'FB_WEBHOOK_VERIFY_TOKEN': process.env.FB_WEBHOOK_VERIFY_TOKEN,
  'FRONTEND_URL': process.env.FRONTEND_URL,
  'BACKEND_URL': process.env.BACKEND_URL,
  'JWT_SECRET': process.env.JWT_SECRET
};

let allGood = true;

console.log('📋 Environment Variables:\n');

Object.entries(requiredVars).forEach(([key, value]) => {
  const status = value ? '✅' : '❌';
  const displayValue = value 
    ? (key.includes('SECRET') || key.includes('TOKEN') 
        ? `${value.substring(0, 10)}...` 
        : value)
    : 'NOT SET';
  
  console.log(`${status} ${key.padEnd(30)} ${displayValue}`);
  
  if (!value) {
    allGood = false;
  }
});

console.log('\n' + '-'.repeat(70) + '\n');

// Check OAuth redirect URI
if (process.env.BACKEND_URL) {
  const redirectUri = `${process.env.BACKEND_URL}/api/integrations/facebook/callback`;
  console.log('🔗 OAuth Redirect URI:');
  console.log(`   ${redirectUri}`);
  console.log('\n   ⚠️  Make sure this EXACT URL is added to Facebook App Settings:');
  console.log('   Settings > Facebook Login > Valid OAuth Redirect URIs\n');
}

// Check webhook URL
if (process.env.BACKEND_URL) {
  const webhookUrl = `${process.env.BACKEND_URL}/api/webhooks/facebook`;
  console.log('🪝 Webhook URL:');
  console.log(`   ${webhookUrl}`);
  console.log('\n   ⚠️  Make sure this URL is configured in Facebook App:');
  console.log('   Messenger > Settings > Webhooks\n');
}

// Check frontend redirect
if (process.env.FRONTEND_URL) {
  const successRedirect = `${process.env.FRONTEND_URL}/dashboard/integrations?success=facebook_connected`;
  console.log('↩️  Success Redirect URL:');
  console.log(`   ${successRedirect}`);
  console.log('\n   ⚠️  Make sure your frontend has this route configured\n');
}

console.log('-'.repeat(70) + '\n');

// Summary
if (allGood) {
  console.log('✅ All required environment variables are set!');
  console.log('\n📝 Next steps:');
  console.log('   1. Verify Facebook App settings match the URLs above');
  console.log('   2. Restart your backend server');
  console.log('   3. Test the OAuth flow\n');
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('\n📝 To fix:');
  console.log('   1. Create/edit backend/.env file');
  console.log('   2. Add the missing variables (see FACEBOOK_REDIRECT_FIX.md)');
  console.log('   3. Restart your backend server\n');
  
  console.log('💡 Example .env configuration:\n');
  console.log('   FB_APP_ID=1256408305896903');
  console.log('   FB_APP_SECRET=fc7fbca3fbecd5bc6b06331bc4da17c9');
  console.log('   FB_WEBHOOK_VERIFY_TOKEN=your_secure_random_token');
  console.log('   FRONTEND_URL=http://localhost:5173');
  console.log('   BACKEND_URL=http://localhost:5000');
  console.log('   JWT_SECRET=your_jwt_secret\n');
}

console.log('='.repeat(70) + '\n');

// Additional diagnostics
console.log('🔧 Additional Diagnostics:\n');

// Check if running in development or production
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   Port: ${process.env.PORT || '5000'}`);

// Check MongoDB connection
if (process.env.MONGODB_URI) {
  console.log(`   MongoDB: ✅ Configured`);
} else {
  console.log(`   MongoDB: ❌ Not configured`);
}

// Check Groq API
if (process.env.GROQ_API_KEY) {
  console.log(`   Groq AI: ✅ Configured`);
} else {
  console.log(`   Groq AI: ❌ Not configured`);
}

console.log('\n' + '='.repeat(70) + '\n');
