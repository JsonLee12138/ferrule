use tauri::{command, AppHandle};
use tauri_plugin_clipboard_manager::ClipboardExt;

#[command]
pub fn set_clipboard(app: AppHandle, text: &str) {
    app.clipboard().write_text(text).unwrap();
}
