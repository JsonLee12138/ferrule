use tauri::{command, AppHandle};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

#[command]
pub fn set_clipboard(app: AppHandle, text: &str) {
    app.clipboard().write_text(text).unwrap();
    // app.dialog().message("复制成功").kind(MessageDialogKind::Info).show(|result| match result {
    //     // true => // do something,
    //     // false => // do something,
    //     _ => {}
    // });
}
