// add delayed functionality here

// DA Plugin Communication - Listen for plugin requests
window.addEventListener('message', (event) => {
  // Handle plugin requests for current page path
  if (event.data && event.data.type === 'REQUEST_DA_PAGE_PATH') {
    try {
      // Extract current page path from DA URL hash fragment
      const currentPath = window.location.hash ? window.location.hash.substring(1) : '';
      
      // Send the page path back to the plugin
      event.source.postMessage({
        type: 'DA_PAGE_PATH',
        pagePath: currentPath || 'home'
      }, '*');
    } catch (e) {
      // If something goes wrong, send a fallback
      event.source.postMessage({
        type: 'DA_PAGE_PATH',
        pagePath: 'home'
      }, '*');
    }
  }
});
