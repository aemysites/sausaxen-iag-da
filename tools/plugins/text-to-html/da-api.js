/* eslint-disable import/no-unresolved */

// DA Admin API configuration
const DA_ADMIN_API_BASE = 'https://admin.da.live';

// Get bearer token for DA Admin API
export async function getDAToken() {
  try {
    // First, check if user provided a token in the UI
    const tokenInput = document.getElementById('da-token');
    const userToken = tokenInput?.value?.trim();

    if (userToken) {
      return userToken;
    }

    // Fallback to default token for testing
    const defaultToken = 'eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LWF0LTEuY2VyIiwia2lkIjoiaW1zX25hMS1rZXktYXQtMSIsIml0dCI6ImF0In0.eyJpZCI6IjE3NTgwMzY3NjA5OTRfZGZjOGExMGItZmFhZi00ZTViLTgzNmItMjNmYWI5YTViYzQzX3V3MiIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJkYXJrYWxsZXkiLCJ1c2VyX2lkIjoiNDI1RjU4REQ1NUJCRDVCODdGMDAwMTAxQGFkb2JlLmNvbSIsInN0YXRlIjoie1wic2Vzc2lvblwiOlwiaHR0cHM6Ly9pbXMtbmExLmFkb2JlbG9naW4uY29tL2ltcy9zZXNzaW9uL3YxL1pURTBOMkU1TmpjdFlXUTVaQzAwTmpoa0xXSTFNakl0WVdVeE5UUmlaV0ppWlRoaExTMDBNalZHTlRoRVJEVTFRa0pFTlVJNE4wWXdNREF4TURGQVlXUnZZbVV1WTI5dFwifSIsImFzIjoiaW1zLW5hMSIsImFhX2lkIjoiNDI1RjU4REQ1NUJCRDVCODdGMDAwMTAxQGFkb2JlLmNvbSIsImN0cCI6MCwiZmciOiJaWkxHSkE2SFZMTTVRRFdLSENRVktYQUE3ST09PT09PSIsInNpZCI6IjE3NTQwMjgzNjQ2NjhfZTM0NDU0YzItYzA5OC00OThjLWJlOTUtMzUxNmNmMTZhYzI2X3V3MiIsIm1vaSI6ImY1ZGU3MTEiLCJwYmEiOiJPUkcsTWVkU2VjTm9FVixMb3dTZWMiLCJleHBpcmVzX2luIjoiODY0MDAwMDAiLCJjcmVhdGVkX2F0IjoiMTc1ODAzNjc2MDk5NCIsInNjb3BlIjoiYWIubWFuYWdlLEFkb2JlSUQsZ25hdixvcGVuaWQsb3JnLnJlYWQscmVhZF9vcmdhbml6YXRpb25zLHNlc3Npb24sYWVtLmZyb250ZW5kLmFsbCxhZGRpdGlvbmFsX2luZm8ub3duZXJPcmcsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0LGFjY291bnRfY2x1c3Rlci5yZWFkIn0.Y-FyA9O3aDW5vJYKL6kIYOimyruHEBUyqtDQQ4G3b5gHnh5Pz1Vf0xiBLiN-sxyGyRSll8jYCCFgX1hcSxDwbNJP-d-OYmhoTSOrJAS80XstgIdpAlfRy_JvC5jbzxTcEWP3hr-EgD8HkUVXEssz1M-xpgm3TWPGxjEgUDyo7GYoqperutfUOPSC19eMO6utgsF2WiL4jtvqa7l4aR6Va0DGobyatmGT42URp1aASztqT9YA-AV-WYN9G7aJ1kaWQWEmb7od2GbYv4XylWz-uOBtNBoIysMKn4877rnkokO6i0EiViSy9UAbIRXgzLkGKrXW5apvqAfd8BoX_FFeKQ';

    if (defaultToken) {
      return defaultToken;
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
