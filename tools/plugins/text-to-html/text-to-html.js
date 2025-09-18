/* eslint-disable import/no-unresolved */
import { showStatus } from './utils.js';
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

// Create a new DA page with the prompt content
async function createDAPageFromForm() {
  const textInput = document.getElementById('text-input');
  const pathInput = document.getElementById('da-path');
  const createButton = document.getElementById('create-da-page');

  const promptText = textInput.value.trim();
  const pageName = pathInput.value.trim();

  if (!promptText) {
    showStatus('Please enter your prompt text.', 'error');
    return;
  }

  if (!pageName) {
    showStatus('Please enter a page name.', 'error');
    return;
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

(async function init() {
  const { context, token, actions } = await DA_SDK;
  
  // Log available context keys for debugging
  Object.keys(context).forEach((key) => {
    // eslint-disable-next-line no-console
    console.log(`DA_SDK context.${key}:`, context[key]);
  });

  const createButton = document.getElementById('create-da-page');
  const pathInput = document.getElementById('da-path');

  // Use DA SDK context to get page information
  if (pathInput && context) {
    // Check if there's page path information in the context
    const pagePath = context.path || context.pagePath || context.currentPath;
    if (pagePath) {
      pathInput.value = pagePath;
      pathInput.placeholder = `Current: ${pagePath}`;
      // eslint-disable-next-line no-console
      console.log('DA SDK provided page path:', pagePath);
    }
  }

  // Add event listener for create button
  if (createButton) {
    createButton.addEventListener('click', createDAPageFromForm);
  }
})();
