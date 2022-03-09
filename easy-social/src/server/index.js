import http from 'http';
import app from './app';

const server = http.createServer(app);

let currentApp = app;
const port = process.env.PORT || 3001;
console.log('PORT: ', port);
server.listen(port, () => console.log('SSR started'));

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./app', () => {
    console.log('🔁  HMR Reloading `./app`...');
    server.removeListener('request', currentApp);
    const newApp = require('./app').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
