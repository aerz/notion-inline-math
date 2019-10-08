/**
 * Gets all the math code blocks and renders it
 * @param {function} customize Callback to add custom attributes on the element preview
 */
function render(customize) {
  const codeBlocks = document.querySelectorAll("span[style*=\"monospace\"]");
  const mathBlocks = Array.prototype.slice.call(codeBlocks).filter(block => block.textContent.startsWith('math:'))

  mathBlocks.forEach(block => {
    const mathText = block.textContent.slice(5).trim()

    block = customize ? customize(block) : defaultCustomization(block)

    katex.render(mathText, block, { throwOnError: false, font: 'mathit' });
  });
}

function defaultCustomization(block) {
  block.style.color = null;
  block.style.background = null;
  return block
}

export default render
