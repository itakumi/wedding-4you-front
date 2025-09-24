export async function callApi(
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  token?: string
) {
  try {
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
    if (!response.ok) {
      alert(data.message || 'エラーが発生しました');
      throw new Error(data.message || 'エラーが発生しました');
    }
    return data;
  } catch (error) {
    alert('通信エラーが発生しました');
    console.error('エラーが発生しました:', error);
    throw error;
  }
}
