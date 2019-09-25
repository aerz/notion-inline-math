// ==UserScript==
// @name Inline Math for Notion.so
// @version 0.2.1
// @match https://www.notion.so/*
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @require https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.js
// ==/UserScript==

// Instructions for use:
//   - Make sure you have at least one normal math block on your page
//   - Use inline code starting with "math:". For example: `math: f(x) = x^2`
//   - Press F2 to rerender all inline math. You can of course change the shortcut in the code below.
//   - The inline math will revert to inline code when the block becomes active.

(function inlineMathNotion() {

  const timerOnFirstLoad = 500
  let firstLoaded = false

  GM_addStyle(`
    .notion-frame span .katex {
      padding-right: 0 !important;
    }

    .math-preview {
      color: black;
      position: absolute;
      z-index: 999;
      background-color: #eee;
      padding: 5px;
      border-radius: 5px;
    }
  `);

  function start() {
    setListeners()
    firstLoad()
      .then(() => renderToggles())
  }

  async function firstLoad() {
    if (!firstLoaded) {
      render()
      setTimeout(firstLoad, timerOnFirstLoad)
    }
  }

  function renderToggles() {
    setTimeout(render, 1000)
  }

  function setListeners() {
    window.addEventListener('keydown', function(e) {
      if (e.key == "F2" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        render()
      }
    }, true);

    window.addEventListener('focusout', function(e) {
      render()
    })

    window.addEventListener('click', function(e) {
      if (e.target.nodeName === 'polygon' || e.target.classList[0] === 'triangle' || typeof e.target.attributes.role !== 'undefined') {
        renderToggles()
      }
    })

    window.addEventListener('keyup', function(e) {
      const mathBlocks = e.target.querySelectorAll("span[style*=\"monospace\"]");

      if (mathBlocks.length < 1 || e.key === 'Shift') {
        return false
      }

      mathBlocks.forEach((block, index) => {
        const mathText = block.innerText.slice(5).trim()

        let preview = document.createElement('div');
        preview.classList.add('math-preview')
        preview.style = `margin-top: ${45 * index}px`
        e.target.appendChild(preview)
        katex.render(mathText, preview, { throwOnError: true, font: 'mathit' });
      })
    })
  }

  function render() {
    const codeBlocks = document.querySelectorAll("span[style*=\"monospace\"]");

    if (codeBlocks.length > 0) {
      firstLoaded = true
    }

    codeBlocks.forEach(codeBlock => {
      let mathText = codeBlock.textContent

      if (!mathText.startsWith('math:')) {
        return false
      }

      codeBlock.style.color = null;
      codeBlock.style.background = null;

      mathText = mathText.slice(5).trim();

      katex.render(mathText, codeBlock, { throwOnError: false, font: 'mathit' });
    });
  }

  return start()
})();
