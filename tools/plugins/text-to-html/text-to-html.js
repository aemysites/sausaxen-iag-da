/* eslint-disable import/no-unresolved */
import { showStatus } from './utils.js';

// Store the page name received from parent window
let receivedPageName = null;

// Listen for messages from parent window
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'DA_PAGE_PATH') {
    receivedPageName = event.data.pagePath;
    // Update the input field if it exists
    const pathInput = document.getElementById('da-path');
    if (pathInput && receivedPageName) {
      pathInput.value = receivedPageName;
    }
  }
});

// Request page path from parent window
function requestPagePathFromParent() {
  try {
    window.parent.postMessage({ type: 'REQUEST_DA_PAGE_PATH' }, '*');
  } catch (e) {
    // Ignore if can't send message
  }
}

// Function to get current page name from URL
function getCurrentPageName() {
  // If we received page name from parent, use that
  if (receivedPageName) {
    return receivedPageName;
  }

  // Fallback: try to extract from current URL (will likely be plugin URL)
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  let pathname;

  // Check if this is a DA (Document Authoring) URL with hash fragment
  if (url.hash && url.hash.startsWith('#')) {
    // Extract path from hash fragment (DA URLs use hash routing)
    pathname = url.hash.substring(1); // Remove the # symbol
  } else {
    // Regular URL - use pathname
    pathname = url.pathname;
  }

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

  // Request page path from parent window
  requestPagePathFromParent();

  // Auto-populate page name with current page (fallback)
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
