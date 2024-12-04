import ace from 'brace';
import 'brace/theme/github';
import './mode';
import { aceMode, aceModes } from './mode';
import copyIcon from './assets/copyIcon';
import codeIcon from './assets/codeIcon';
import selectSetup from './select/index';
import type { SelectInstance } from './select/type';
import type { BlockTool } from '@editorjs/editorjs';

const adjustSelectWidth = (e: HTMLSelectElement) => {
  const text = e.options[e.selectedIndex].textContent;
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'nowrap';
  span.style.font = getComputedStyle(e).font;
  span.textContent = text;
  document.body.appendChild(span);
  const width = span.offsetWidth;
  document.body.removeChild(span);
  e.style.width = `calc(${width}px + 1.25rem)`;
}
const adjustEditorHeight = (e: ace.Editor) => {
  const session = e.getSession();
  let lines = session.getScreenLength();
  if (lines < 2) lines = 2;
  e.container.style.height = `${lines * (e.renderer.lineHeight || 16)}px`;
  e.resize();
}

type AceCodeData = {
  language: string;
  code: string;
}

const defaultLanguage = 'javascript';

class AceCode implements BlockTool {
  private _data: AceCodeData = {
    language: defaultLanguage,
    code: ''
  };
  private _aceInstance: ace.Editor | null = null;
  private _aceSession: ace.IEditSession | null = null;
  private _lngSelect: SelectInstance | null = null;
  private _config: any;

  constructor({config}: any){
    this.render = this.render.bind(this);
    this.codeChange = this.codeChange.bind(this);
    this.lngChange = this.lngChange.bind(this);
    this.copyCode = this.copyCode.bind(this);
    this.save = this.save.bind(this);
    this.destroy = this.destroy.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this._config = config;
  }

  private handleCopy(text: string){
    if(this._config.copyHandler){
      this._config.copyHandler(text);
    }else{
      navigator && navigator.clipboard.writeText(text);
    }
  }
  public static get toolbox() {
    return {
      title: 'Ace Code',
      icon: codeIcon
    };
  }

  public static get enableLineBreaks(): boolean {
    return true;
  }

  public static get isReadOnlySupported(): boolean {
    return true;
  }

  public get data(): AceCodeData {
    return this._data;
  }

  public set data(data: AceCodeData) {
    this._data = data;
    if (this._aceInstance) {
      this._aceInstance.setValue(data.code);
    }
  }

  public save(){
    return {
      code: this._aceInstance?.getValue(),
      language: this._lngSelect?.getValue()
    }
  }

  public destroy() {
    this._aceInstance?.destroy();
    this._lngSelect?.destroy();
  }

  private lngChange(e: Event) {
    const instance = e.target as HTMLSelectElement;
    adjustSelectWidth(instance);
    const modeItem = aceMode(instance.value);
    this._aceSession?.setMode(modeItem.mode);
    this._data.language = modeItem.value;
  }

  private codeChange(_e: any) {
    if (this._aceInstance && this._aceSession) {
      adjustEditorHeight(this._aceInstance);
      this._data.code = this._aceSession?.getValue() || '';
    }
  }

  private copyCode() {
    if (this._aceSession) {
      const value = this._aceSession.getValue() || '';
      this.handleCopy(value);
    }
  }

  render() {
    const _this = this;
    const container = document.createElement('div');
    container.className = 'j-code-container';
    const toolsContainer = document.createElement('div');
    toolsContainer.className = 'flex items-center justify-between';
    container.appendChild(toolsContainer);
    const selectContainer = document.createElement('div');
    selectContainer.className = 'relative rounded p-1 j-select-container';
    // const selectIcon = stringToElement(chevronDownIcon);
    // this._lngSelect = document.createElement('select');
    this._lngSelect = selectSetup({options: aceModes, searchable: true, searchPlaceholder: '请输入语言名称', value: this._data.language, onChange(_value, item, _index) {
        _this._aceSession?.setMode(item.mode);
        _this._data.language = item.value;
    },})
    // const testSelect = document.createElement('select');
    for (const _mode of aceModes) {
      const option = document.createElement('option');
      option.value = _mode.value;
      option.textContent = _mode.label;
      // testSelect.appendChild(option);
    }
    // selectContainer.appendChild(this._lngSelect);
    // selectContainer.appendChild(selectIcon);
    // adjustSelectWidth(this._lngSelect);
    // const select = selectSetup({options: aceModes, searchable: true, searchPlaceholder: '请输入语言名称'});
    // this._lngSelect?.style.marginBottom = '0.25rem';
    this._lngSelect && (this._lngSelect.style.marginBottom = '0.25rem');
    const copyBtn = document.createElement('button');
    copyBtn.className = 'j-copy-btn';
    copyBtn.innerHTML = copyIcon;
    copyBtn.addEventListener('click', this.copyCode);
    // toolsContainer.appendChild(selectContainer);
    toolsContainer.appendChild(this._lngSelect);
    toolsContainer.appendChild(copyBtn);

    // toolsContainer.appendChild(testSelect);
    const editorContainer = document.createElement('div');
    editorContainer.className = 'w-full h-full rounded-sm';
    container.appendChild(editorContainer);
    this._aceInstance = ace.edit(editorContainer);
    // requestAnimationFrame(() => {
    //   // const aceContentContainer = editorContainer.querySelector('.ace_scroller') as HTMLElement;
    //   // const aceContentStyle = getComputedStyle(aceContentContainer);
    //   // container.style.backgroundColor = aceContentStyle.backgroundColor;
    // })
    this._aceInstance.setTheme('ace/theme/github');
    this._aceSession = this._aceInstance.getSession();
    this._aceSession.setMode(aceMode(defaultLanguage).mode);
    this._aceSession.setTabSize(4);
    this._aceSession.setUseSoftTabs(true);
    this._aceInstance.setShowPrintMargin(false);
    this._aceInstance.$blockScrolling = Infinity;
    this._aceInstance.focus();
    adjustEditorHeight(this._aceInstance);
    // 监听编辑器内容变化
    this._aceInstance.getSession().on('change', this.codeChange);
    // 选择语言
    // this._lngSelect.addEventListener('change', this.lngChange);
    return container;
  }
}

export default AceCode;
