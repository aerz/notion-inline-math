import listeners from './listeners'
import loader from './loader'

/**
 * Add some custom CSS
 */
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
`)

/**
 * Initialize event listeners
 */
window.addEventListener('keydown', listeners.keyDown)
window.addEventListener('keyup', listeners.keyUp)
window.addEventListener('focusout', listeners.focusOut)
window.addEventListener('mousemove', listeners.mouseMove)
window.addEventListener('click', listeners.click)

/**
 * Load inline math blocks on first load
 */
loader()
