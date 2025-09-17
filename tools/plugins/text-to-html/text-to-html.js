/* eslint-disable import/no-unresolved */
import { showStatus } from './utils.js';

// Function to get current page name from URL
function getCurrentPageName() {
  // Try to get the parent window's URL first (if plugin is in an iframe)
  let currentUrl;
  try {
    currentUrl = window.parent !== window ? window.parent.location.href : window.location.href;
  } catch (e) {
    // If cross-origin, fall back to current window
    currentUrl = window.location.href;
  }

  const { pathname: urlPathname } = new URL(currentUrl);

  // Extract path from URL and clean it up
  let pathname = urlPathname;

  // Remove file extensions
  pathname = pathname.replace(/\.(html|htm)$/i, '');

  // Remove leading slash but keep the path structure
  pathname = pathname.replace(/^\/+/, '');

  // If empty (root path), use a default name
  if (!pathname) {
    pathname = 'home';
  }

  return pathname;
}

// Create a new DA page with the prompt content
async function createDAPageFromForm() {
  const textInput = document.getElementById('text-input');
  const pathInput = document.getElementById('da-path');
  const createButton = document.getElementById('create-da-page');

  const promptText = textInput.value.trim();
  let pageName = pathInput.value.trim();

  if (!promptText) {
    showStatus('Please enter your prompt text.', 'error');
    return;
  }

  // If no page name provided, use current page name
  if (!pageName) {
    pageName = getCurrentPageName();
    showStatus(`Using current page name: "${pageName}"`, 'info');
  }

  const originalText = createButton.textContent;

  try {
    // Update button state
    createButton.disabled = true;
    createButton.textContent = 'Creating...';
    showStatus('Generating page...', 'info');

    // Make API call to local server
    const response = await fetch('http://localhost:8080/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptText,
        pageName,
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      // Handle API error responses
      const errorMessage = result.message || result.error || `API request failed: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    showStatus('Page generated successfully!', 'success');
    createButton.textContent = 'Created!';
    createButton.classList.add('success');

    // Show any result messages or URLs if available in the response
    if (result.message) {
      showStatus(result.message, 'success');
    }

    if (result.url) {
      showStatus(`Page available: <a href="${result.url}" target="_blank">View Page</a>`, 'info');
    }

    setTimeout(() => {
      createButton.textContent = originalText;
      createButton.classList.remove('success');
      createButton.disabled = false;
    }, 3000);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate page:', error);
    showStatus(`Failed to generate page: ${error.message}`, 'error');

    createButton.textContent = originalText;
    createButton.disabled = false;
  }
}

function initialize() {
  const createButton = document.getElementById('create-da-page');
  const pathInput = document.getElementById('da-path');

  // Auto-populate page name with current page
  if (pathInput) {
    const currentPageName = getCurrentPageName();
    pathInput.value = currentPageName;
    pathInput.placeholder = `e.g., ${currentPageName} or path/to/page`;
  }

  // Add event listener for create button
  if (createButton) {
    createButton.addEventListener('click', createDAPageFromForm);
  }
}

document.addEventListener('DOMContentLoaded', initialize);
