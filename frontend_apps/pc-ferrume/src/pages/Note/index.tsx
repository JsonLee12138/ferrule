import JsonInput from '@/components/JInput';
import Editorjs from '@json_lee12138/editorjs-react';
import { useSafeState } from 'ahooks';
import { useCallback, useMemo, useRef, type FormEventHandler } from 'react';

function Note() {
  return (
    <div className="w-full h-full overflow-y-auto max-w-[610px] mx-auto mt-[200px]">
      <JsonInput className='text-4xl ml-[60px] font-semibold
       mr-[50px]' placeholder='新页面' />
      {/* <div tabIndex={0} className="text-3xl ml-[60px] relative min-h-[1.2em]">
        <span
          className="absolute left-0 top-0 w-full h-full outline-none"
          ref={titleInputContentRef}
          contentEditable
          onInput={handleInput}
        />
        {showPlaceholder && <span className="placeholder">新页面</span>}
      </div> */}
      <Editorjs />
    </div>
  );
}

export default Note;
