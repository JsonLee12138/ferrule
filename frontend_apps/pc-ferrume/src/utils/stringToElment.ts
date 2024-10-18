export const stringToElement = (_html: string) => {
  const template = document.createElement('template');
  template.innerHTML = _html;
  return template.content.firstChild as HTMLElement;
}
