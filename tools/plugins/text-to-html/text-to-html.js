/* eslint-disable import/no-unresolved */
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import { createDAPage } from './da-api.js';
import { getSelectedBlockType, createPageWithBlock } from './blocks.js';
import { 
  convertTextToHtml, 
  highlightHtml, 
  escapeHtml, 
  showStatus, 
  copyToClipboard 
} from './utils.js';

// Update the HTML preview
function updatePreview() {
  const textInput = document.getElementById('text-input');
  const htmlPreview = document.getElementById('html-preview');
  const copyButton = document.getElementById('copy-html');
  const insertButton = document.getElementById('insert-html');
  const createButton = document.getElementById('create-da-page');
  
  const text = textInput.value;
  
  // Get current options
  const options = {
    autoParagraphs: document.getElementById('auto-paragraphs').checked,
    preserveBreaks: document.getElementById('preserve-breaks').checked,
    escapeHtml: document.getElementById('escape-html').checked,
    detectLinks: document.getElementById('detect-links').checked
  };
  
  if (!text.trim()) {
    htmlPreview.innerHTML = `
      <div class="empty-state">
        <p>Enter text to see HTML output</p>
      </div>
    `;
    copyButton.disabled = true;
    insertButton.disabled = true;
    createButton.disabled = true;
    return;
  }
  
  // Convert text to HTML
  const html = convertTextToHtml(text, options);
  
  // Store the raw HTML for copying/inserting
  htmlPreview.dataset.rawHtml = html;
  
  // Display with syntax highlighting
  const escapedHtml = escapeHtml(html);
  const highlightedHtml = highlightHtml(escapedHtml);
  htmlPreview.innerHTML = highlightedHtml;
  
  // Enable buttons
  copyButton.disabled = false;
  insertButton.disabled = false;
  createButton.disabled = false;
}

// Copy HTML to clipboard
async function copyHtml() {
  const htmlPreview = document.getElementById('html-preview');
  const copyButton = document.getElementById('copy-html');
  const rawHtml = htmlPreview.dataset.rawHtml;
  
  if (!rawHtml) return;
  
  await copyToClipboard(rawHtml, copyButton);
}

// Insert HTML into document using DA SDK
async function insertHtml() {
  const htmlPreview = document.getElementById('html-preview');
  const rawHtml = htmlPreview.dataset.rawHtml;
  
  if (!rawHtml) return;
  
  try {
    const { actions } = await DA_SDK;
    actions.sendHTML(rawHtml);
    actions.closeLibrary();
  } catch (error) {
    console.error('Failed to insert HTML:', error);
    
    // Fallback: copy to clipboard
    await copyHtml();
  }
}

// Create a new DA page with the generated HTML
async function createDAPageFromForm() {
  const htmlPreview = document.getElementById('html-preview');
  const rawHtml = htmlPreview.dataset.rawHtml;
  
  if (!rawHtml) {
    showStatus('No HTML content to create page with.', 'error');
    return;
  }

  // Get form values
  const org = document.getElementById('da-org').value.trim();
  const repo = document.getElementById('da-repo').value.trim();
  const path = document.getElementById('da-path').value.trim();

  if (!org || !repo || !path) {
    showStatus('Please fill in organization, repository, and page path.', 'error');
    return;
  }

  const createButton = document.getElementById('create-da-page');
  const originalText = createButton.textContent;
  
  try {
    // Update button state
    createButton.disabled = true;
    createButton.textContent = 'Creating...';
    showStatus('Creating DA page...', 'info');

    // Create page content with selected block type
    const blockType = getSelectedBlockType();
    let fullHtmlContent;
    
    if (blockType && blockType !== 'none') {
      // Create page with block structure
      fullHtmlContent = createPageWithBlock(rawHtml, blockType);
    } else {
      // Create simple page structure
      fullHtmlContent = `<body>
  <header></header>
  <main>
    <div>
${rawHtml}
    </div>
  </main>
</body>`;
    }

    const result = await createDAPage(org, repo, path, fullHtmlContent);
    
    showStatus('DA page created successfully!', 'success');
    createButton.textContent = 'Created!';
    createButton.classList.add('success');

    // Show result URLs if available
    if (result.source?.editUrl) {
      const editUrl = result.source.editUrl;
      showStatus(`Page created! <a href="${editUrl}" target="_blank">Edit in DA</a>`, 'success');
    }

    if (result.aem?.previewUrl) {
      const previewUrl = result.aem.previewUrl;
      showStatus(`Preview available: <a href="${previewUrl}" target="_blank">View Preview</a>`, 'info');
    }

    setTimeout(() => {
      createButton.textContent = originalText;
      createButton.classList.remove('success');
      createButton.disabled = false;
    }, 3000);

  } catch (error) {
    console.error('Failed to create DA page:', error);
    showStatus(`Failed to create DA page: ${error.message}`, 'error');
    
    createButton.textContent = originalText;
    createButton.disabled = false;
  }
}

// Initialize event listeners
function initializeEventListeners() {
  // Text input changes
  const textInput = document.getElementById('text-input');
  textInput.addEventListener('input', updatePreview);
  textInput.addEventListener('paste', () => {
    // Small delay to allow paste to complete
    setTimeout(updatePreview, 10);
  });
  
  // Option changes
  const options = [
    'auto-paragraphs',
    'preserve-breaks', 
    'escape-html',
    'detect-links'
  ];
  
  options.forEach(optionId => {
    const checkbox = document.getElementById(optionId);
    checkbox.addEventListener('change', updatePreview);
  });
  
  // Button clicks
  document.getElementById('copy-html').addEventListener('click', copyHtml);
  document.getElementById('insert-html').addEventListener('click', insertHtml);
  document.getElementById('create-da-page').addEventListener('click', createDAPageFromForm);
  
  // Handle mutual exclusivity between auto-paragraphs and preserve-breaks
  const autoParagraphs = document.getElementById('auto-paragraphs');
  const preserveBreaks = document.getElementById('preserve-breaks');
  
  autoParagraphs.addEventListener('change', () => {
    if (autoParagraphs.checked) {
      // Both can be enabled together for breaks within paragraphs
    }
    updatePreview();
  });
  
  preserveBreaks.addEventListener('change', () => {
    updatePreview();
  });
}

// Sample text for demonstration
function loadSampleText() {
  const textInput = document.getElementById('text-input');
  
  // Only load sample if input is empty
  if (!textInput.value.trim()) {
    const sampleText = `Welcome to Text to HTML Converter

This plugin helps you convert plain text into properly formatted HTML.

Here's what you can do:
- Convert paragraphs automatically
- Preserve line breaks as <br> tags  
- Escape HTML entities like <script> tags
- Auto-detect URLs like https://example.com

Try editing this text and see the HTML output update in real-time!

You can also paste content from other sources and convert it to clean HTML for your documents.`;
    
    textInput.value = sampleText;
    updatePreview();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  loadSampleText();
  updatePreview();
});