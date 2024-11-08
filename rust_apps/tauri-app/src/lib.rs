mod core;
mod global;
mod modules;

use tauri::{Manager, WindowEvent, Wry};
use tauri_plugin_store::Store;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use core::{global_shortcut, nsapp, store, tray, window_effects, windows::close_window};
use modules::ast::service::json_to_ts_interface;
use modules::clipboard::service::set_clipboard;
use modules::file::service::save_file;
use modules::setting::service::{get_os, get_setting, set_autostart, set_setting_item};
use modules::translate::service::translate;
use std::env;
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--auto-launch"]),
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let cnf = global::AppConfig::init(app).unwrap();
            app.manage(cnf);
            let main_window = app.get_webview_window("main").unwrap();
            let app_handle = app.handle();
            // main_window.hide().unwrap();
            // nsapp::run_as_background(&app_handle);
            store::setup(app)?;
            let store = app.state::<Store<Wry>>();
            // store.clear();
            // store.save()?;
            window_effects::setup(&main_window);
            global_shortcut::setup(app)?;
            let setting = get_setting(store);
            if setting.system.show_tray_icon {
                tray::setup(app)?;
            }
            let args: Vec<String> = env::args().collect();
            if args.contains(&"--auto-launch".to_string()) && setting.system.silent_start {
                main_window.hide().unwrap();
                nsapp::run_as_background(app_handle);
            }
            let app_handle_clone = app_handle.clone();
            let main_window_clone = main_window.clone();
            main_window.on_window_event(move |event| {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close(); // 阻止关闭窗口
                    main_window_clone.hide().unwrap();
                    nsapp::run_as_background(&app_handle_clone);
                }
            });
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
        .plugin(tauri_plugin_shell::init())
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
