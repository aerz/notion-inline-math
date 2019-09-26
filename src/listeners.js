import render from './render'
import loader from './loader'

let currentUrl = ''
let mathPreviews = []
let mouse = {
  x: 0,
  y: 0
}

function updateUrl() {
  currentUrl = window.location.href
}

function removePreviews() {
  mathPreviews.forEach(preview => preview.remove())
  const tooltip = document.getElementById('tooltip-inline-math')
  if (tooltip) {
    tooltip.remove()
  }
  mathPreviews = []
}

function isToggleElement(e) {
  return e.target.nodeName === 'polygon' || e.target.classList[0] === 'triangle' || typeof e.target.attributes.role !== 'undefined'
}

function createTooltip() {
  let tooltip = document.createElement('div')
  tooltip.setAttribute('id', 'tooltip-inline-math')
  tooltip.classList.add('tooltip')
  tooltip.style = `top: ${mouse.y}px; left: ${mouse.x}px;`
  tooltip.innerHTML = '<div>Math Inline Preview</div>'

  return tooltip
}

function keyDown(e) {
  if (e.key == "F2" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    render()
  }
}

function focusOut(e) {
  removePreviews()
  render()
}

function click(e) {
  if (isToggleElement(e)) {
    setTimeout(render, 500)
  }

  if (window.location.href !== currentUrl) {
    updateUrl()
    loader()
  }
}

function keyUp(e) {
  const codeBlocks = e.target.querySelectorAll("span[style*=\"monospace\"]");
  const mathBlocks = Array.prototype.slice.call(codeBlocks).filter(block => block.textContent.startsWith('math:'))

  if (mathBlocks.length < 1) {
    return false
  }

  removePreviews()
  let tooltip = createTooltip()

  mathBlocks.forEach(block => {
    const mathText = block.textContent.slice(5).trim()

    let preview = document.createElement('div');
    preview.classList.add('tooltip__preview')
    mathPreviews.push(preview)
    tooltip.appendChild(preview)

    katex.render(mathText, preview, { throwOnError: false, font: 'mathit' });
  })

  document.body.appendChild(tooltip)
}

function mouseMove(e) {
  const tooltip = document.getElementById('tooltip-inline-math')

  if (tooltip === null) {
    return false
  }

  mouse.x = e.clientX
  mouse.y = e.clientY

  tooltip.style = `top: ${mouse.y}px; left: ${mouse.x}px;`
}

export default { keyDown, keyUp, focusOut, mouseMove, click }
