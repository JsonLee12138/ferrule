import React from 'react';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

const theme = {};
function onError(e: unknown){
  console.error('editor发生了错误:', e);
}
const initialConfig = {
  namespace: 'MyEditor',
  theme,
  onError,
};
function Editor({
  className,
  placeholder = '随便写点什么...',
  placeholderClassName,
}: any) {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ContentEditable
        className={className ?? 'ContentEditable__root'}
        aria-placeholder={placeholder}
        placeholder={
          <div
            className={placeholderClassName ?? 'ContentEditable__placeholder'}
          >
            {placeholder}
          </div>
        }
      />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}

export default Editor;
