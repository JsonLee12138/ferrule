import { stringToElement } from "../../utils/stringToElment";
import type { BlockTool } from "@editorjs/editorjs";
import pageIcon from "./assets/pageIcon";

class Page implements BlockTool {
  // constructor() { }

  save() { }

  render(): HTMLElement | Promise<HTMLElement> {
    const render = document.createElement('div');
    const icon = stringToElement(pageIcon);
    render.appendChild(icon);
    const title = document.createElement('div');
    title.textContent = '新页面';
    render.appendChild(title);
    return render;
  }

}

export default Page;
