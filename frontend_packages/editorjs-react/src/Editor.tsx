import React, { useEffect, useRef } from 'react';
import EditorJS, { type BlockToolConstructable } from '@editorjs/editorjs';
import AceCode from './plugins/code/index';
import NestedList from '@editorjs/nested-list';
// @ts-ignore
import Paragraph from '@editorjs/paragraph';
// @ts-ignore
import Checklist from '@editorjs/checklist';
// TODO: embed not in effect
// @ts-ignore
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
// @ts-ignore
import Warning from '@editorjs/warning';
// @ts-ignore
import Delimiter from '@coolbytes/editorjs-delimiter';
// @ts-ignore
import Alert from 'editorjs-alert';
// @ts-ignore
import ToggleBlock from 'editorjs-toggle-block';
// @ts-ignore
import Math from 'editorjs-latex';
// @ts-ignore
import MermaidTool from 'editorjs-mermaid';
// @ts-ignore
import AudioPlayer from 'editorjs-audio-player';
// @ts-ignore
import AttachesTool from '@editorjs/attaches';
import ImageTool from '@editorjs/image';
import Table from '@editorjs/table';
// @ts-ignore
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import Underline from '@editorjs/underline';
// @ts-ignore
import ChangeCase from 'editorjs-change-case';
// @ts-ignore
import Tooltip from 'editorjs-tooltip';
// @ts-ignore
// import Strikethrough from '@sotaproject/strikethrough';
// @ts-ignore
import Annotation from 'editorjs-annotation';
// @ts-ignore
import TextVariantTune from '@editorjs/text-variant-tune';
import IndentTune from 'editorjs-indent-tune';
// @ts-ignore
import AnchorTune from 'editorjs-anchor';
// @ts-ignore
import DragDrop from 'editorjs-drag-drop';

import './style.scss';
import type { EditorProps } from './types';

const Editor = ({ onChange, dragDrop = true }: EditorProps) => {
  const holder = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorJS | null>(null);
  useEffect(() => {
    if (holder.current) {
      editor.current = new EditorJS({
        holder: holder.current,
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: '随便写点什么'
            },
            tunes: ['textVariant', 'indentTune']
          },
          header: {
            class: Header as unknown as BlockToolConstructable,
            config: { placeholder: 'Enter a header' },
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+H',
            tunes: ['anchorTune']
          },
          quote: {
            class: Quote as unknown as BlockToolConstructable,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: "Quote's author"
            }
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message'
            }
          },
          delimiter: Delimiter,
          alert: {
            class: Alert,
            inlineToolbar: true,
            config: {
              defaultType: 'primary',
              messagePlaceholder: 'Enter something'
            }
          },
          toggle: {
            class: ToggleBlock,
            inlineToolbar: true
          },
          list: {
            class: NestedList as unknown as BlockToolConstructable,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          checklist: {
            class: Checklist as unknown as BlockToolConstructable,
            inlineToolbar: true
          },
          table: {
            class: Table as unknown as BlockToolConstructable,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3
              // maxRows: 5,
              // maxCols: 5,
            }
          },
          code: AceCode,
          image: {
            class: ImageTool,
            // TODO: 配置上传
            config: {
              // endpoints: {
              //   byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
              //   byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
              // }
            }
          },
          attaches: {
            // TODO: 配置上传
            class: AttachesTool
            // config: {
            //   endpoint: 'http://localhost:8008/uploadFile'
            // }
          },
          math: Math,
          // TODO: 配置 [文档](http://mermaid.js.org)
          mermaid: MermaidTool,
          audioPlayer: AudioPlayer,
          // TODO: embed not in effect
          embed: {
            class: Embed
            // config: {
            //   services: {
            //     youtube: true,
            //     coub: true
            //   }
            // }
          },
          Marker: {
            class: Marker
            // shortcut: 'CMD+SHIFT+M',
          },
          inlineCode: {
            class: InlineCode
            // shortcut: 'CMD+SHIFT+M',
          },
          underline: {
            class: Underline,
            shortcut: 'CMD+SHIFT+B'
          },
          changeCase: {
            class: ChangeCase,
            config: {
              showLocaleOption: true, // enable locale case options
              locale: 'tr' // or ['tr', 'TR', 'tr-TR']
            }
          },
          tooltip: {
            class: Tooltip,
            config: {
              // location: 'left',
              // underline: true,
              // placeholder: 'Enter a tooltip',
              // highlightColor: '#FFEFD5',
              // backgroundColor: '#154360',
              // textColor: '#FDFEFE',
              // holder: 'editorId',
            }
          },
          // strikethrough: Strikethrough,
          annotation: Annotation,
          textVariant: TextVariantTune,
          indentTune: IndentTune as unknown as BlockToolConstructable,
          anchorTune: AnchorTune
        },
        onChange: async (_e) => {
          const res = await editor.current!.save();
          onChange?.(res);
        },
        onReady: () => {
          if (dragDrop) {
            new DragDrop(editor.current);
          }
        }
      });
    }
    return () => {
      editor.current?.destroy?.();
    };
  }, []);
  return (
    <div className="w-full flex-1 pl-[60px] bg-white max-w-[600px]">
      <div ref={holder} className="w-full flex-1" />
    </div>
  );
};

export default Editor;
