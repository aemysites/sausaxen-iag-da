/* global WebImporter */
export default function parse(element, { document }) {
  // Find the next sibling, which contains the actual card content
  const content = element.nextElementSibling;
  if (!content) return;

  // Find all headings in the content (each card starts with a heading)
  const headings = Array.from(content.querySelectorAll('h2, h3, h4'));
  if (headings.length === 0) return;

  // Prepare rows: header first
  const rows = [['Cards (cardsNoImages20)']];

  // For each heading, collect all elements until the next heading
  headings.forEach((heading, i) => {
    const cardElements = [heading.cloneNode(true)];
    let node = heading.nextElementSibling;
    while (node && !headings.includes(node)) {
      cardElements.push(node.cloneNode(true));
      node = node.nextElementSibling;
    }
    rows.push([cardElements]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
