export const quoteEndpoint = 'https://api.web3forms.com/submit';

export async function sendQuote(details: FormData) {
  const accessKey = String(details.get('access_key') ?? '').trim();
  if (!accessKey) throw new Error('Quote delivery is not configured');

  const contact = String(details.get('contact') ?? '').trim();
  const payload: Record<string, FormDataEntryValue | boolean> = {
    ...Object.fromEntries(details),
    access_key: accessKey,
    from_name: String(details.get('name') ?? '').trim(),
    botcheck: details.has('botcheck')
  };
  delete payload.email;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) payload.email = contact;
  else payload.phone = contact;

  const response = await fetch(quoteEndpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    signal: AbortSignal.timeout(15000)
  });
  const result = await response.json();
  if (!response.ok || result?.success !== true) throw new Error('Quote delivery failed');
}
