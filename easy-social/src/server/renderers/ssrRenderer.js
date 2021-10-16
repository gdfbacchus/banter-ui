import _ from 'lodash';
import { Helmet } from 'react-helmet';

export default function renderSsrPage(store, html, assets, template, noindex) {
  const preloadedState = store ? store.getState() : {};

  const helmet = Helmet.renderStatic();
  const baseHelmet = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();

  let header = baseHelmet;
  if (noindex) header += `<meta name="robots" content="noindex, nofollow">`;

  let scripts = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
    .replace(/\u2028/g, '\\n')
    .replace(/</g, '\\u003c')}</script>`;

  _.forEach(assets, asset => {
    console.log("ASSET 2 : ",asset)
    if (asset.css) header += `<link rel="stylesheet" href="${asset.css}" />`;
    if (asset.js) scripts += `<script src="${asset.js}" defer></script>`;
  });

  // console.log("ASSETS: ",assets)
  // console.log("SCRIPTS: ",scripts)

  // console.log("header: ",header);

  // console.log("preloadedState: ",preloadedState)
  const production = process.env.NODE_ENV === 'production';
  console.log("SSR RENDERER TEMPLATE");
  const nightmode = preloadedState && preloadedState.settings && preloadedState.settings.nightmode;

  const res = template({
    header,
    html,
    scripts,
    production,
    nightmode,
  });

  //console.log("SSR TEMPLATE: ",res)

  return res
}
