export async function callApi(
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  token?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `${token}`;
  }
  const options: RequestInit = {
    method,
    headers,
  };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(endpoint, options);
  const data = await response.json();
  return data;
}
