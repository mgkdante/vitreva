import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { quoteEndpoint, sendQuote } from '../src/lib/quote.ts';

afterEach(() => mock.restoreAll());

function requestDetails() {
  const details = new FormData();
  details.set('access_key', 'public-test-key');
  details.set('name', '  Alex  ');
  details.set('contact', ' alex@example.test ');
  details.set('subject', 'Demande de soumission Vitreva');
  details.set('language', 'fr');
  details.set('vehicle', '2010 Ford Transit Connect');
  details.set('vin', 'TESTVIN123');
  details.set('location', 'Montréal');
  details.set('message', 'Pare-brise fissuré');
  details.set('consent', 'on');
  return details;
}

test('rejects an unconfigured key before making a request', async () => {
  const fetchMock = mock.method(globalThis, 'fetch', async () => Response.json({ success: true }));
  const details = requestDetails();
  details.set('access_key', '  ');
  await assert.rejects(sendQuote(details));
  details.delete('access_key');
  await assert.rejects(sendQuote(details));
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('delivers JSON with email reply details and all quote fields', async () => {
  const details = requestDetails();
  mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    assert.equal(url, quoteEndpoint);
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(options.method, 'POST');
    assert.deepEqual(options.headers, { 'Content-Type': 'application/json', Accept: 'application/json' });
    assert.ok(options.signal instanceof AbortSignal);
    assert.deepEqual(JSON.parse(options.body as string), {
      ...Object.fromEntries(details), from_name: 'Alex', email: 'alex@example.test', botcheck: false
    });
    return Response.json({ success: true });
  });
  await sendQuote(details);
  assert.equal(details.get('name'), '  Alex  ');
  assert.equal(details.get('vehicle'), '2010 Ford Transit Connect');
});

test('allows a phone contact without sending it as an email and preserves the bot flag', async () => {
  const details = requestDetails();
  details.set('contact', ' 514-555-0123 ');
  details.set('botcheck', 'on');
  mock.method(globalThis, 'fetch', async (_url: string, options: RequestInit) => {
    const payload = JSON.parse(options.body as string);
    assert.equal(payload.contact, ' 514-555-0123 ');
    assert.equal(payload.phone, '514-555-0123');
    assert.equal(Object.hasOwn(payload, 'email'), false);
    assert.equal(payload.botcheck, true);
    return Response.json({ success: true });
  });
  await sendQuote(details);
});

test('requires both HTTP success and an explicit provider acknowledgement', async () => {
  const details = requestDetails();
  for (const response of [
    Response.json({ success: true }, { status: 422 }),
    Response.json({ success: false }),
    Response.json({ success: 'true' }),
    Response.json({})
  ]) {
    mock.method(globalThis, 'fetch', async () => response);
    await assert.rejects(sendQuote(details));
  }
  assert.equal(details.get('message'), 'Pare-brise fissuré');
});

test('rejects malformed provider responses without discarding the draft', async () => {
  const details = requestDetails();
  mock.method(globalThis, 'fetch', async () => new Response('<html>Unavailable</html>'));
  await assert.rejects(sendQuote(details));
  assert.equal(details.get('vin'), 'TESTVIN123');
});

test('propagates connection failures instead of reporting delivery', async () => {
  const details = requestDetails();
  mock.method(globalThis, 'fetch', async () => { throw new TypeError('Network unavailable'); });
  await assert.rejects(sendQuote(details), /Network unavailable/);
  assert.equal(details.get('contact'), ' alex@example.test ');
});
