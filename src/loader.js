import render from "./render";
import elements from "./elements"

function loader() {
  if (elements.getMathBlocks().length < 1) {
    setTimeout(loader, 500)
    return false
  }

  render()
}

export default loader
