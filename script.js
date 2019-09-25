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
  `);

  function start() {
    setListeners()
    firstLoad()
  }

  function firstLoad() {
    if (!firstLoaded) {
      render()
      setTimeout(firstLoad, timerOnFirstLoad)
    } else {
      setTimeout(render, 2000) // render elements inside the toggle
    }
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
        setTimeout(render, 500)
      }
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
