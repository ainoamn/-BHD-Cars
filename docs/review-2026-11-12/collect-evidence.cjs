// Read-only application review: no form submissions, logins, or deployment changes.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
function load(relative) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(path.join(root, relative), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, { exports }, { filename: relative });
  return exports;
}
const data = load('src/lib/data.ts');
const quotes = load('src/lib/quotes.ts');
async function inspect(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    const html = await response.text();
    return {
      url, finalUrl: response.url, status: response.status,
      server: response.headers.get('server'), poweredBy: response.headers.get('x-powered-by'),
      bytes: Buffer.byteLength(html), title: html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1],
      signals: { next: html.includes('/_next/'), aspnet: /__RequestVerificationToken|\.axd/i.test(html), jquery: /jquery/i.test(html), bootstrap: /bootstrap/i.test(html) },
      scripts: [...html.matchAll(/<script[^>]+src=["']([^"']+)/g)].slice(0, 12).map(m => m[1]),
    };
  } catch (error) { return { url, error: String(error) }; }
}
(async () => {
  const pageFiles = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name === 'page.tsx') pageFiles.push(path.relative(path.join(root, 'src/app'), path.dirname(file)).replaceAll('\\', '/'));
    }
  }
  walk(path.join(root, 'src/app'));
  const routes = pageFiles.map(p => '/' + p)
    .map(p => p.replace('/cars/[slug]', '/cars/' + data.cars[0].slug)
      .replace('/auctions/[slug]', '/auctions/' + data.auctions[0].slug)
      .replace('/dealers/[slug]', '/dealers/' + data.sellers.find(s => s.kind === 'dealer').slug));
  const urls = routes.map(p => 'https://bhd-cars.vercel.app' + p);
  urls.push('https://bhd-cars.vercel.app/cars/bhd-audit-does-not-exist',
    'https://bhd-cars.vercel.app/admin', 'https://bhd-cars.vercel.app/account',
    'https://sooq-cars.com/om/ar', 'https://www.bima.om/');
  const http = [];
  for (let i = 0; i < urls.length; i += 4) http.push(...await Promise.all(urls.slice(i, i + 4).map(inspect)));
  const output = {
    reviewedOn: '2026-11-12', capturedAt: new Date().toISOString(),
    scope: 'Local working tree, not only HEAD; public HTTP reads without browser interaction or private accounts.',
    gitHead: cp.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    versions: Object.fromEntries(['next', 'react', 'react-dom', 'typescript', 'eslint'].map(p => [p, require(path.join(root, 'node_modules', p, 'package.json')).version])),
    counts: Object.fromEntries(['cars', 'sellers', 'auctions', 'rentals', 'parts', 'yards', 'plates', 'insurers', 'banks', 'appraisers', 'centers', 'workshops'].map(k => [k, data[k].length])),
    sourcePageCount: pageFiles.length, routes: pageFiles,
    diagnostics: {
      financeNoOffers: quotes.financeOffers(data.banks, 12000, 0, 7).length,
      negativeYearInsurance: quotes.insuranceQuotes(data.insurers, { valueOmr: -100, year: -100, cover: 'comp' }).map(q => q.priceOmr),
      zeroPrincipalPayment: quotes.monthlyPayment(0, 5, 5),
      zeroRatePayment: quotes.monthlyPayment(12000, 0, 5),
      note: 'Diagnostics demonstrate current pure-function behavior; they do not certify UI or provider integrations.',
    }, http,
  };
  const destination = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, 'evidence.latest.json');
  if (destination === path.join(__dirname, 'evidence.json')) throw new Error('Preserve baseline evidence.json; choose a new output path.');
  fs.writeFileSync(destination, JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify({ pageCount: output.sourcePageCount, versions: output.versions, counts: output.counts, http: http.map(({ url, status, error }) => ({ url, status, error })) }, null, 2));
})();
