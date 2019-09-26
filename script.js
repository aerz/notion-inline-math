// ==UserScript==
// @name Inline Math for Notion.so
// @version 0.2.1
// @match https://www.notion.so/*
// @grant GM_addStyle
// @require https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.js
// ==/UserScript==

(function inlineMathNotion() {

  const timerOnFirstLoad = 500
  let firstLoaded = false

  GM_addStyle(`
    .notion-frame span .katex {
      padding-right: 0 !important;
    }

    .tooltip {
      color: white;
      background-color: rgb(55, 53, 47);
      border-radius: 8px;
      padding: 10px;
      position: absolute;
      z-index: 999;
    }

    .tooltip__preview {
      background-color: #eee;
      color: black;
      padding: 5px;
      border-radius: 8px;
      margin-top: 10px;
    }
  `);

  function start() {
    setListeners()
    firstLoad()
  }

  function firstLoad() {
    if (!firstLoaded) {
      render()
      setTimeout(firstLoad, timerOnFirstLoad)
    }
  }

  function setListeners() {

    let mathPreviews = []
    let mouse = {
      x: 0,
      y: 0
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

    window.addEventListener('keydown', function(e) {
      if (e.key == "F2" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        render()
      }
    }, true);

    window.addEventListener('focusout', function(e) {
      removePreviews()
      render()
    })

    window.addEventListener('click', function(e) {
      if (isToggleElement(e)) {
        setTimeout(render, 500)
      }
    })

    window.addEventListener('keyup', function(e) {
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
    })

    window.addEventListener('mousemove', function(e) {
      const tooltip = document.getElementById('tooltip-inline-math')

      if (tooltip === null) {
        return false
      }

      mouse.x = e.clientX
      mouse.y = e.clientY

      tooltip.style = `top: ${mouse.y}px; left: ${mouse.x}px;`
    })
  }

  function render() {
    const codeBlocks = document.querySelectorAll("span[style*=\"monospace\"]");
    const mathBlocks = Array.prototype.slice.call(codeBlocks).filter(block => block.textContent.startsWith('math:'))

    if (mathBlocks.length > 0) {
      firstLoaded = true
    }

    mathBlocks.forEach(block => {
      const mathText = block.textContent.slice(5).trim()

      block.style.color = null;
      block.style.background = null;

      katex.render(mathText, block, { throwOnError: false, font: 'mathit' });
    });
  }

  return start()
})();
