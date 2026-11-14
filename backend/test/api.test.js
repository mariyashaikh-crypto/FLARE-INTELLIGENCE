import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from '../server.js';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    // Listen on dynamic available port 0
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('1. Health Check Endpoint (GET /api/health)', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.match(data.message, /FLARE INTELLIGENCE backend server is running/);
  assert.ok(data.timestamp);

  // Security Headers verification
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
  assert.equal(res.headers.get('x-xss-protection'), '1; mode=block');
});

test('2. Combustion Summary (GET /api/combustion/summary)', async () => {
  const res = await fetch(`${baseUrl}/api/combustion/summary`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.domain, 'Microgravity Combustion Science');
  assert.ok(typeof data.pathExists === 'boolean');
  assert.ok(typeof data.totalDatasetsFound === 'number');
  assert.ok(Array.isArray(data.experimentsTracked));
  assert.equal(data.experimentsTracked.length, 5);
  assert.ok(data.experimentsTracked.includes('BASS-II'));
  assert.ok(data.experimentsTracked.includes('FLEX'));
  assert.ok(data.experimentsTracked.includes('SAFFIRE-I'));
  assert.ok(data.experimentsTracked.includes('SPICE'));
  assert.ok(data.experimentsTracked.includes('E-FIELD Flames'));
  assert.equal(data.referenceDatasetsAvailable, 5);
});

test('3. Experiments Metadata Catalog (GET /api/combustion/experiments)', async () => {
  const res = await fetch(`${baseUrl}/api/combustion/experiments`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.ok(data.experiments);

  const expectedExperiments = ['BASS-II', 'FLEX', 'SAFFIRE-I', 'SPICE', 'E-FIELD Flames'];
  for (const expName of expectedExperiments) {
    const exp = data.experiments[expName];
    assert.ok(exp, `Experiment ${expName} missing from catalog`);
    assert.ok(exp.facilityCode);
    assert.ok(exp.platform);
    assert.ok(exp.combustionMode);
    assert.ok(Array.isArray(exp.fuels));
    assert.ok(exp.fuels.length > 0);
    assert.ok(Array.isArray(exp.keyParameters));
    assert.ok(exp.scientificObjective);
  }
});

test('4. Published Benchmark Datasets (GET /api/combustion/experimental-data)', async () => {
  const res = await fetch(`${baseUrl}/api/combustion/experimental-data`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.sourceType, 'NASA Open Science Published Experimental Data');
  assert.ok(data.datasets);

  const keys = ['bass-ii', 'flex', 'saffire-i', 'spice', 'e-field'];
  for (const k of keys) {
    const ds = data.datasets[k];
    assert.ok(ds, `Benchmark dataset ${k} missing`);
    assert.ok(ds.citation, `Citation missing for ${k}`);
    assert.ok(Array.isArray(ds.series));
    assert.ok(ds.series.length >= 5, `Expected >= 5 flight points for ${k}`);
    assert.ok(ds.xKey);
    assert.ok(ds.yKey);
  }
});

test('5. Research Highlights & Breakthroughs (GET /api/combustion/highlights)', async () => {
  const res = await fetch(`${baseUrl}/api/combustion/highlights`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.ok(Array.isArray(data.highlights));
  assert.ok(data.highlights.length >= 5);

  const coolFlame = data.highlights.find((h) => h.id === 'cool-flame-discovery');
  assert.ok(coolFlame);
  assert.equal(coolFlame.experiment, 'FLEX');
  assert.ok(coolFlame.leadScientist);
  assert.ok(coolFlame.impact);
});

test('6. Scholarly Research Activity & DOIs (GET /api/combustion/research-activity)', async () => {
  const res = await fetch(`${baseUrl}/api/combustion/research-activity`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.ok(Array.isArray(data.activities));
  assert.ok(data.activities.length >= 6);

  for (const act of data.activities) {
    assert.ok(act.title);
    assert.ok(act.authors);
    assert.ok(act.citation);
    assert.ok(act.doi);
    assert.ok(act.year);
    assert.ok(Array.isArray(act.tags));
  }
});

test('7. Dataset Directory Scanner (GET /api/combustion/datasets)', async () => {
  const res = await fetch(`${baseUrl}/api/combustion/datasets`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.ok(data.datasetDir);
  assert.ok(typeof data.exists === 'boolean');
  assert.ok(typeof data.totalFiles === 'number');
  assert.ok(Array.isArray(data.files));
  assert.ok(data.experimentsCount);
});

test('8. Safe 404 Route Handling (GET /api/nonexistent-route)', async () => {
  const res = await fetch(`${baseUrl}/api/nonexistent-route`);
  assert.equal(res.status, 404);

  const data = await res.json();
  assert.equal(data.status, 'error');
  assert.match(data.message, /not found/i);
});
