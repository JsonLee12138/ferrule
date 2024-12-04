import type { OutputData } from "@editorjs/editorjs";

export interface EditorProps {
  onChange?: (data: OutputData) => void;
  dragDrop?: boolean;
}
