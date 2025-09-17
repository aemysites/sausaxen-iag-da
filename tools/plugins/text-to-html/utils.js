// Utility functions for text-to-HTML conversion

// HTML escape function
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Simple URL detection regex
const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;

// Auto-detect and convert URLs to links
export function autoLinkUrls(text) {
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

// Convert text to HTML based on options
export function convertTextToHtml(text, options) {
  if (!text.trim()) return '';

  let html = text;

  // Escape HTML entities if requested
  if (options.escapeHtml) {
    html = escapeHtml(html);
  }

  // Auto-detect links if requested
  if (options.detectLinks && !options.escapeHtml) {
    html = autoLinkUrls(html);
  }

  // Handle line breaks and paragraphs
  if (options.autoParagraphs) {
    // Split by double line breaks to create paragraphs
    const paragraphs = html.split(/\n\s*\n/);
    html = paragraphs
      .map((para) => para.trim())
      .filter((para) => para.length > 0)
      .map((para) => {
        // Handle single line breaks within paragraphs
        let processedPara = para;
        if (options.preserveBreaks) {
          processedPara = processedPara.replace(/\n/g, '<br>');
        } else {
          processedPara = processedPara.replace(/\n/g, ' ');
        }
        return `<p>${processedPara}</p>`;
      })
      .join('\n');
  } else if (options.preserveBreaks) {
    // Just convert line breaks to <br> tags
    html = html.replace(/\n/g, '<br>');
  }

  return html;
}

// Add basic syntax highlighting to HTML preview
export function highlightHtml(html) {
  return html
    .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span class="tag">$2</span>')
    .replace(/(\s)([a-zA-Z-]+)(=)/g, '$1<span class="attr">$2</span>$3')
    .replace(/(=")([^"]*?)(")/g, '=$1<span class="string">$2</span>$3')
    .replace(/(=')([^']*?)(')/g, '=$1<span class="string">$2</span>$3');
}

// Show status messages to user
export function showStatus(message, type = 'info') {
  const statusContainer = document.getElementById('status-messages');

  const statusDiv = document.createElement('div');
  statusDiv.className = `status-message ${type}`;
  statusDiv.innerHTML = message;

  statusContainer.appendChild(statusDiv);

  // Auto-remove after 5 seconds for info/success, 10 seconds for errors
  const timeout = type === 'error' ? 10000 : 5000;
  setTimeout(() => {
    if (statusDiv.parentNode) {
      statusDiv.parentNode.removeChild(statusDiv);
    }
  }, timeout);
}

// Copy text to clipboard with fallback
export async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);

    // Show success state
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('success');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('success');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy text:', error);

    // Fallback: select text for manual copy
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    button.textContent = 'Copied!';
    button.classList.add('success');

    setTimeout(() => {
      button.textContent = 'Copy HTML';
      button.classList.remove('success');
    }, 2000);
  }
}
