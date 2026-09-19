// Run once the deployment URL is known: node scripts/set-public-url.cjs https://your-domain.com/
// This writes static metadata because social preview crawlers do not need to execute JavaScript.
const fs = require('node:fs');
const path = require('node:path');
let site;
try {
  site = new URL(process.argv[2]);
  if (!['https:','http:'].includes(site.protocol) || site.username || site.password || ['localhost','127.0.0.1','[::1]'].includes(site.hostname)) throw new Error();
} catch {console.error('Provide the public website URL, e.g. https://your-domain.com/');process.exit(1);}
site.search='';site.hash='';
if (site.pathname.endsWith('/index.html')) site.pathname=site.pathname.slice(0,-10);
if (!site.pathname.endsWith('/')) site.pathname+='/';
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const file=path.join(__dirname,'..','index.html');
let html=fs.readFileSync(file,'utf8');
const image=escape(new URL('assets/images/hero.jpeg',site).href);
html=html.replace(/(<meta property="og:image" content=")[^"]*(">)/,`$1${image}$2`);
html=html.replace(/(<meta name="twitter:image" content=")[^"]*(">)/,`$1${image}$2`);
html=html.replace(/^.*<meta property="og:url"[^>]*>\r?\n/gm,'').replace(/^.*<link rel="canonical"[^>]*>\r?\n/gm,'');
html=html.replace('  <meta property="og:type"',`  <link rel="canonical" href="${escape(site.href)}">\n  <meta property="og:url" content="${escape(site.href)}">\n  <meta property="og:type"`);
fs.writeFileSync(file,html);
console.log('Social preview URLs set to '+site.href);
