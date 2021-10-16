const NoCorsProxy = require('no-cors-proxy');
const port = 8282;
const host = '79.143.179.62';
// const host = '79.143.179.62';
// const host = 'https://proxy.easysocial.life';

// const target = 'http://79.143.179.62:8080';
const target = 'https://node.banter.gg';

const proxy = new NoCorsProxy(port, host, target);
proxy.start();
