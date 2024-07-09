import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    // Load testing
    { duration: '1m', target: 20 }, // Ramp-up to 20 users over 1 minute
    { duration: '2m', target: 20 }, // Stay at 20 users for 2 minutes
    { duration: '1m', target: 50 }, // Ramp-up to 50 users over 1 minute
    { duration: '2m', target: 50 }, // Stay at 50 users for 2 minutes
    { duration: '1m', target: 0 },  // Ramp-down to 0 users over 1 minute

    // Spike testing
    { duration: '10s', target: 100 }, // Spike to 100 users over 10 seconds
    { duration: '30s', target: 100 }, // Stay at 100 users for 30 seconds
    { duration: '10s', target: 0 },   // Ramp-down to 0 users over 10 seconds

    // Soak testing
    { duration: '2m', target: 20 },  // Ramp-up to 20 users over 2 minutes
    { duration: '4h', target: 20 }, // Stay at 20 users for almost 4 hours
    { duration: '2m', target: 0 },   // Ramp-down to 0 users over 2 minutes
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
      },
    },
    report: {
      type: 'html',
      options: {
        fileName: 'k6-report.html',
        title: 'Load Test Report',
      },
    },
  }
};

export default function () {
  const res = http.get('https://httpbin.test.k6.io/');
  check(res, {
    'status was 200': (r) => r.status == 200
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data), //the default data object
  };
}