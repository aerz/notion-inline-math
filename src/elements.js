/**
 * Returns all the math code blocks existing on the page
 */
function getMathBlocks() {
  const codeBlocks = document.querySelectorAll("span[style*=\"monospace\"]");
  return Array.prototype.slice.call(codeBlocks).filter(block => block.textContent.startsWith('math:'))
}

/**
 * Detect if there is a toggle list on the event
 */
function isToggleList(e) {
  return e.target.nodeName === 'polygon' || e.target.classList[0] === 'triangle' || typeof e.target.attributes.role !== 'undefined'
}

function createTooltipPreview(mouseX, mouseY) {
  let tooltip = document.createElement('div')
  tooltip.setAttribute('id', 'tooltip-inline-math')
  tooltip.classList.add('tooltip')
  tooltip.style = `top: ${mouseY}px; left: ${mouseX}px;`
  tooltip.innerHTML = '<div>Math Inline Preview</div>'

  return tooltip
}

function getTooltipPreview() {
  return document.getElementById('tooltip-inline-math')
}

export default { getMathBlocks, isToggleList, createTooltipPreview, getTooltipPreview }
