use std::fs::File;
use std::io::Write;
use tauri_plugin_dialog::{DialogExt, FileDialogBuilder};
use tauri::{Manager, command, AppHandle};

#[command]
pub fn save_file(app: AppHandle, content: String) {
    // FileDialogBuilder::new().set_title("保存 json 文件").add_filter("JSON File", &["json"]).save_file(|file_path|{
    //     println!("{:?}", file_path);
    // });
    let b = content.clone().into_bytes();
    app.dialog().file().set_title("保存 json 文件")
        .add_filter("JSON 文件".to_string(), &["json"])
        .save_file(move |file_path| {
            println!("{:?}", file_path);
            if let Some(path) = file_path {
                File::create(path.to_string())
                    .unwrap()
                    .write_all(&b)
                    .unwrap()
            }
        })
}
