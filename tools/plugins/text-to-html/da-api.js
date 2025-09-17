/* eslint-disable import/no-unresolved */

// DA Admin API configuration
const DA_ADMIN_API_BASE = 'https://admin.da.live';

// Get bearer token for DA Admin API
export async function getDAToken() {
  try {
    // For local testing, use the provided token
    const testToken = '';

    if (testToken) {
      return testToken;
    }

    // Fallback to SDK or localStorage for production
    return localStorage.getItem('da-admin-token') || null;
  } catch (error) {
    console.warn('Could not retrieve DA token:', error);
    return null;
  }
}

// Create a DA page using the Admin API
export async function createDAPage(org, repo, path, htmlContent) {
  const token = await getDAToken();

  if (!token) {
    throw new Error('No authentication token available. Please ensure you are logged into DA.');
  }

  // Ensure path ends with .html
  const pagePath = path.endsWith('.html') ? path : `${path}.html`;

  const formData = new FormData();
  const blob = new Blob([htmlContent], { type: 'text/html' });
  formData.append('data', blob);

  const url = `${DA_ADMIN_API_BASE}/source/${org}/${repo}/${pagePath}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create DA page: ${response.status} ${response.statusText}. ${errorText}`);
  }

  const result = await response.json();
  return result;
}
