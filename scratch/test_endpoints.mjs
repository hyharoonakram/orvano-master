import http from 'http';

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      console.error(`URL: ${url} -> Error: ${err.message}`);
      resolve({ url, error: err.message });
    });
  });
}

async function run() {
  await checkUrl('http://localhost:3000/');
  await checkUrl('http://localhost:3000/shop');
  await checkUrl('http://localhost:3000/shop?category=Women%27s%20Watches');
  await checkUrl('http://localhost:3000/shop?category=Women%27s%20Baggy');
  await checkUrl('http://localhost:3000/shop?category=Men%27s%20Watches');
  await checkUrl('http://localhost:3000/shop?category=Men%27s%20Baggy');
  await checkUrl('http://localhost:3000/watches');
  await checkUrl('http://localhost:3000/pants');
}

run();
