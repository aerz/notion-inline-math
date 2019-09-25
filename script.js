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
  const timerOnKeyUp = 5000
  const timerOnClick = 5000

  GM_addStyle(`
    .notion-frame span .katex {
      padding-right: 0 !important;
    }
  `);

  GM_setValue('firstLoad', false);

  function start() {
    setListeners()
    firstLoad()
  }

  function firstLoad() {
    const isLoaded = GM_getValue('firstLoad', true)

    if (!isLoaded) {
      render()
      setTimeout(firstLoad, timerOnFirstLoad)
    }
  }

  function setListeners() {
    window.addEventListener('keydown', function(e) {
      if (e.key == "F2" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        render()
      }
    }, true);

    window.addEventListener('keyup', function(e) {
      setTimeout(render, timerOnKeyUp)
    });

    window.addEventListener('click', function(e) {
      setTimeout(render, timerOnClick)
    });
  }

  function render() {
    const codeBlocks = document.querySelectorAll("span[style*=\"monospace\"]");

    if (codeBlocks.length > 0) {
      GM_setValue('firstLoad', true);
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
