import render from "./render";

function searchMathBlocks() {
  const codeBlocks = document.querySelectorAll("span[style*=\"monospace\"]");
  return Array.prototype.slice.call(codeBlocks).filter(block => block.textContent.startsWith('math:'))
}

function loader() {
  if (searchMathBlocks().length < 1) {
    setTimeout(loader, 500)
    return false
  }

  render()
}

export default loader
