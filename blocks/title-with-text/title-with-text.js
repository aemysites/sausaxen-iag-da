/**
 * loads and decorates the title-with-text block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // The block structure is already correct from the initial HTML
  // We just need to ensure proper semantic structure and accessibility
  
  // Find the heading element and ensure it has proper attributes
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && !heading.id) {
    // Generate an ID from the heading text if it doesn't have one
    const headingText = heading.textContent.trim();
    const id = headingText.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    if (id) {
      heading.id = id;
    }
  }

  // Ensure all links have proper attributes for accessibility and security
  const links = block.querySelectorAll('a');
  links.forEach((link) => {
    // Add target="_blank" and rel attributes for external links
    const href = link.getAttribute('href');
    if (href && (href.startsWith('http') || href.startsWith('https'))) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
    
    // Ensure link has a title attribute if it doesn't already
    if (!link.getAttribute('title') && link.textContent.trim()) {
      link.setAttribute('title', link.textContent.trim());
    }
  });

  // Mark block as loaded
  block.setAttribute('data-block-status', 'loaded');
}
