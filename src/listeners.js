import render from './render'
import loader from './loader'
import elements from './elements'

let currentUrl = ''
let mathPreviews = []
let mouse = {
  x: 0,
  y: 0
}

function removePreviews() {
  mathPreviews.forEach(preview => preview.remove())
  const tooltip = elements.getTooltipPreview()
  if (tooltip) {
    tooltip.remove()
  }
  mathPreviews = []
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
  if (elements.isToggleList(e)) {
    setTimeout(render, 500)
  }

  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href
    loader()
  }
}

function keyUp(e) {
  const mathBlocks = elements.getMathBlocks()

  if (mathBlocks.length < 1) {
    return false
  }

  removePreviews()
  let tooltip = elements.createTooltipPreview(mouse.x, mouse.y)

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
  const tooltip = elements.getTooltipPreview()

  if (tooltip === null) {
    return false
  }

  mouse.x = e.clientX
  mouse.y = e.clientY

  tooltip.style = `top: ${mouse.y}px; left: ${mouse.x}px;`
}

export default { keyDown, keyUp, focusOut, mouseMove, click }
