export async function sendQuote(endpoint: string, details: FormData) {
  const response = await fetch(endpoint, {
    method: 'POST',
    body: details,
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('Quote delivery failed');
}
