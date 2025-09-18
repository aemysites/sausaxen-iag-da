/* eslint-disable import/no-unresolved */
/* global DA_SDK */
import { showStatus } from './utils.js';

// Function to get current page name using proper DA SDK
async function getCurrentPageNameFromDA() {
  try {
    // Debug: Check what's available
    // eslint-disable-next-line no-console
    console.log('Checking DA SDK availability...');
    // eslint-disable-next-line no-console
    console.log('typeof DA_SDK:', typeof DA_SDK);
    // eslint-disable-next-line no-console
    console.log('window.DA_SDK:', typeof window.DA_SDK);
    // eslint-disable-next-line no-console
    console.log('All window properties with DA:', Object.keys(window).filter(key => key.includes('DA')));

    // Try multiple approaches to access DA SDK
    let sdk = null;
    
    // Approach 1: Direct global
    if (typeof DA_SDK !== 'undefined') {
      sdk = DA_SDK;
    }
    // Approach 2: Window global
    else if (typeof window.DA_SDK !== 'undefined') {
      sdk = window.DA_SDK;
    }
    // Approach 3: Check if it's in a different global
    else if (typeof window.da !== 'undefined' && window.da.SDK) {
      sdk = window.da.SDK;
    }

    if (sdk) {
      // eslint-disable-next-line no-console
      console.log('DA SDK found, attempting to get context...');
      const { context } = await sdk;
      // eslint-disable-next-line no-console
      console.log('DA SDK context:', context);
      if (context && context.path) {
        return context.path;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('DA SDK not found');
    }
    
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Error getting page name from DA SDK:', error);
    return null;
  }
}

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

async function initialize() {
  const createButton = document.getElementById('create-da-page');
  const pathInput = document.getElementById('da-path');

  // Try to get page name from DA SDK
  if (pathInput) {
    // Wait longer for DA SDK to fully load
    setTimeout(async () => {
      // eslint-disable-next-line no-console
      console.log('Attempting to get page name from DA SDK...');
      const daPageName = await getCurrentPageNameFromDA();
      if (daPageName) {
        pathInput.value = daPageName;
        pathInput.placeholder = `Current: ${daPageName}`;
        // eslint-disable-next-line no-console
        console.log('DA SDK provided page name:', daPageName);
      } else {
        pathInput.placeholder = '';
        // eslint-disable-next-line no-console
        console.log('DA SDK did not provide page name, using manual input');
      }
    }, 3000); // Wait 3 seconds for DA SDK to initialize
  }

  // Add event listener for create button
  if (createButton) {
    createButton.addEventListener('click', createDAPageFromForm);
  }
}

document.addEventListener('DOMContentLoaded', initialize);
