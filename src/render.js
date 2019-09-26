function render() {
  const codeBlocks = document.querySelectorAll("span[style*=\"monospace\"]");
  const mathBlocks = Array.prototype.slice.call(codeBlocks).filter(block => block.textContent.startsWith('math:'))

  mathBlocks.forEach(block => {
    const mathText = block.textContent.slice(5).trim()

    block.style.color = null;
    block.style.background = null;

    katex.render(mathText, block, { throwOnError: false, font: 'mathit' });
  });
}

export default render
