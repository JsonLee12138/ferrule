mod core;
mod global;
mod modules;

use tauri::{Manager, Wry};
use tauri_plugin_store::{Store, StoreBuilder};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use core::{global_shortcut, nsapp, tray, windows::{close_window, register_all_windows}};
use modules::ast::service::json_to_ts_interface;
use modules::clipboard::service::set_clipboard;
use modules::file::service::save_file;
use modules::setting::service::{get_os, get_setting, set_autostart, set_setting_item};
use modules::translate::service::translate;
use std::env;
use std::sync::Arc;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--auto-launch"]),
        ))
        .plugin(tauri_plugin_shell::init())
        .setup(|app: &mut tauri::App| {
            // 全局注册配置
            let cnf = global::AppConfig::init(app).unwrap();
            app.manage(cnf);
            let app_handle = app.handle();
            // 全局注册store
            let store_builder = StoreBuilder::new(app, "store.bin").build().unwrap();
            app.manage(store_builder);
            let store = app.state::<Arc<Store<Wry>>>();
            // 注册所有页面
            register_all_windows(app_handle)?;
            // store.clear();
            // store.save()?;
            global_shortcut::setup(app)?;
            let setting = get_setting(store);
            if setting.system.show_tray_icon {
                tray::setup(app)?;
            }
            // 处理是否打开窗口
            let main_window = app.get_webview_window("main").unwrap();
            let args: Vec<String> = env::args().collect();
            if args.contains(&"--auto-launch".to_string()) && setting.system.silent_start {
                nsapp::run_as_background(app_handle);
            }else{
                tauri::async_runtime::spawn(async move {
                    std::thread::sleep(std::time::Duration::from_millis(500));
                    main_window.show().unwrap();
                    main_window.set_focus().unwrap();
                });
            }
            // 开机自启
            let autostart_manager: tauri::State<'_, tauri_plugin_autostart::AutoLaunchManager> =
                app.autolaunch();
            if setting.system.start_at_login {
                let _ = autostart_manager.enable();
            } else {
                let _ = autostart_manager.disable();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_os,
            close_window,
            translate,
            get_setting,
            set_setting_item,
            set_clipboard,
            set_autostart,
            save_file,
            json_to_ts_interface
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
