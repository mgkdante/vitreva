import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { sendQuote } from '../src/lib/quote.ts';

afterEach(() => mock.restoreAll());

test('delivers the form details and requests a JSON response', async () => {
  const details = new FormData();
  details.set('contact', 'qa@example.test');
  details.set('vin', '');
  mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    assert.equal(url, 'https://example.test/quote');
    assert.equal(options.method, 'POST');
    assert.equal(options.body, details);
    assert.deepEqual(options.headers, { Accept: 'application/json' });
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ ok: true });
  });
  await sendQuote('https://example.test/quote', details);
});

test('rejects provider errors without discarding the request details', async () => {
  const details = new FormData();
  details.set('vehicle', '2010 Ford Transit Connect');
  mock.method(globalThis, 'fetch', async () => Response.json({ errors: ['Rejected'] }, { status: 422 }));
  await assert.rejects(sendQuote('https://example.test/quote', details));
  assert.equal(details.get('vehicle'), '2010 Ford Transit Connect');
});

test('propagates connection failures instead of reporting delivery', async () => {
  mock.method(globalThis, 'fetch', async () => { throw new TypeError('Network unavailable'); });
  await assert.rejects(sendQuote('https://example.test/quote', new FormData()), /Network unavailable/);
});
