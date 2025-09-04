#!/usr/bin/env node

/**
 * Smoke Test Script for AI Permit Inspection Navigator
 * Run this script after deployment to verify core functionality
 *
 * Usage: node scripts/smoke-test.js [baseUrl]
 * Example: node scripts/smoke-test.js https://your-app.vercel.app
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const TIMEOUT = 10000; // 10 seconds

console.log(`🚀 Starting smoke tests for: ${BASE_URL}`);
console.log('=' .repeat(50));

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

function logResult(testName, passed, details = '') {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`✅ ${testName}: PASSED`);
  } else {
    results.failed++;
    console.log(`❌ ${testName}: FAILED`);
    if (details) console.log(`   Details: ${details}`);
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;

    const req = client.request(url, {
      timeout: TIMEOUT,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testHealthCheck() {
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    const isHealthy = response.statusCode === 200;
    const data = JSON.parse(response.data);

    logResult(
      'Health Check',
      isHealthy && data.status === 'healthy',
      isHealthy ? `DB: ${data.database.status}, Latency: ${data.response.latency}` : `Status: ${response.statusCode}`
    );

    return isHealthy;
  } catch (error) {
    logResult('Health Check', false, error.message);
    return false;
  }
}

async function testPublicPages() {
  const pages = [
    { path: '/', name: 'Home Page' },
    { path: '/login', name: 'Login Page' },
    { path: '/unauthorized', name: 'Unauthorized Page' }
  ];

  for (const page of pages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page.path}`);
      logResult(
        page.name,
        response.statusCode === 200,
        `Status: ${response.statusCode}`
      );
    } catch (error) {
      logResult(page.name, false, error.message);
    }
  }
}

async function testProtectedRoutes() {
  const protectedRoutes = [
    { path: '/dashboard', name: 'Dashboard (Protected)' },
    { path: '/admin', name: 'Admin (Protected)' },
    { path: '/moderator', name: 'Moderator (Protected)' }
  ];

  for (const route of protectedRoutes) {
    try {
      const response = await makeRequest(`${BASE_URL}${route.path}`);
      // Should redirect to login (302) or show unauthorized (401/403)
      const isProtected = response.statusCode === 302 || response.statusCode === 401 || response.statusCode === 403;
      logResult(
        route.name,
        isProtected,
        `Status: ${response.statusCode} (should be protected)`
      );
    } catch (error) {
      logResult(route.name, false, error.message);
    }
  }
}

async function testAPIEndpoints() {
  const apiEndpoints = [
    { path: '/api/health', name: 'Health API' },
    { path: '/api/exports/csv', name: 'CSV Export API' },
    { path: '/api/exports/pdf', name: 'PDF Export API' }
  ];

  for (const endpoint of apiEndpoints) {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`);
      const isWorking = response.statusCode === 200 || response.statusCode === 405; // 405 = Method Not Allowed
      logResult(
        endpoint.name,
        isWorking,
        `Status: ${response.statusCode}`
      );
    } catch (error) {
      logResult(endpoint.name, false, error.message);
    }
  }
}

async function testDatabaseConnectivity() {
  try {
    const response = await makeRequest(`${BASE_URL}/api/health`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      const dbConnected = data.database && data.database.status === 'connected';
      logResult(
        'Database Connectivity',
        dbConnected,
        `Status: ${data.database.status}, Latency: ${data.database.latency}`
      );
      return dbConnected;
    } else {
      logResult('Database Connectivity', false, 'Health check failed');
      return false;
    }
  } catch (error) {
    logResult('Database Connectivity', false, error.message);
    return false;
  }
}

async function testAuthenticationFlow() {
  try {
    // Test login page loads
    const loginResponse = await makeRequest(`${BASE_URL}/login`);
    logResult(
      'Login Page Loads',
      loginResponse.statusCode === 200,
      `Status: ${loginResponse.statusCode}`
    );

    // Test NextAuth endpoint
    const authResponse = await makeRequest(`${BASE_URL}/api/auth/session`);
    logResult(
      'NextAuth Endpoint',
      authResponse.statusCode === 200,
      `Status: ${authResponse.statusCode}`
    );

    return true;
  } catch (error) {
    logResult('Authentication Flow', false, error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('\n🔍 Testing Health Check...');
  await testHealthCheck();

  console.log('\n🌐 Testing Public Pages...');
  await testPublicPages();

  console.log('\n🔒 Testing Protected Routes...');
  await testProtectedRoutes();

  console.log('\n📡 Testing API Endpoints...');
  await testAPIEndpoints();

  console.log('\n🗄️ Testing Database Connectivity...');
  await testDatabaseConnectivity();

  console.log('\n🔐 Testing Authentication Flow...');
  await testAuthenticationFlow();

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(50));
  console.log(`Total Tests: ${results.total}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Application is ready for production.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed. Please review the issues before going live.');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test execution failed:', error);
  process.exit(1);
});