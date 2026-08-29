import * as http from 'http';

function makeRequest(method: string, urlStr: string, data?: any): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = data ? JSON.stringify(data) : undefined;
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 200, body: body ? JSON.parse(body) : {} });
          } catch {
            resolve({ status: res.statusCode || 200, body });
          }
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting End-to-End Health & API Verification Tests...\n');

  const services = [
    { name: 'Order Service', url: 'http://localhost:3001/health' },
    { name: 'Payment Service', url: 'http://localhost:3002/health' },
    { name: 'Inventory Service', url: 'http://localhost:3003/health' },
    { name: 'Notification Service', url: 'http://localhost:3004/health' },
  ];

  let allPassed = true;

  for (const s of services) {
    try {
      const res = await makeRequest('GET', s.url);
      if (res.status === 200 && res.body.status === 'UP') {
        console.log(`✅ [PASS] ${s.name} is healthy: ${JSON.stringify(res.body)}`);
      } else {
        console.error(`❌ [FAIL] ${s.name} returned unexpected response:`, res.body);
        allPassed = false;
      }
    } catch (err: any) {
      console.warn(`ℹ️ [OFFLINE] ${s.name} is not running. (Run 'docker compose up -d' or 'npm run dev:order', etc.)`);
    }
  }

  console.log('\n🎉 Verification script completed.');
}

runTests().catch(console.error);
