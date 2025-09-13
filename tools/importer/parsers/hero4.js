/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image (picture element)
  function findBackgroundPicture(el) {
    // Look for Layer--two or SplitLayout--media
    let bgPicture;
    // Try Layer--two
    const layerTwo = el.querySelector('.Layer--two');
    if (layerTwo) {
      // Look for .FullSize > picture or .FullSize > div > picture
      bgPicture = layerTwo.querySelector('picture');
      if (!bgPicture) {
        // Sometimes picture is inside a div
        const divs = layerTwo.querySelectorAll('div');
        for (const div of divs) {
          const pic = div.querySelector('picture');
          if (pic) {
            bgPicture = pic;
            break;
          }
        }
      }
    }
    // Try SplitLayout--media if not found
    if (!bgPicture) {
      const splitMedia = el.querySelector('.SplitLayout--media');
      if (splitMedia) {
        bgPicture = splitMedia.querySelector('picture');
      }
    }
    return bgPicture;
  }

  // Helper to find the text block (title, subtitle, etc)
  function findTextBlock(el) {
    // Try Layer--one
    const layerOne = el.querySelector('.Layer--one');
    if (layerOne) {
      // Find the deepest .Theme-Layer-TextBlock-Inner
      const inner = layerOne.querySelector('.Theme-Layer-TextBlock-Inner');
      if (inner) {
        // Usually the content is inside the first child div
        const contentDiv = inner.querySelector('div');
        if (contentDiv) {
          return contentDiv;
        }
        return inner;
      }
      return layerOne;
    }
    // Fallback: try to find any h2/h3/h4 inside el
    const fallback = el.querySelector('h2, h3, h4');
    if (fallback) {
      return fallback.parentElement;
    }
    return null;
  }

  // Compose table rows
  const headerRow = ['Hero (hero4)'];

  // Row 2: background image (picture)
  const bgPicture = findBackgroundPicture(element);
  const row2 = [bgPicture ? bgPicture : ''];

  // Row 3: text block (title, subtitle, etc)
  const textBlock = findTextBlock(element);
  const row3 = [textBlock ? textBlock : ''];

  // Build table
  const cells = [headerRow, row2, row3];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
