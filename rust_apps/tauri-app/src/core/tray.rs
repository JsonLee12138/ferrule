use std::fmt::format;
use super::{nsapp, windows};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    App, Manager,
};
use crate::modules::setting::service::get_setting;

pub fn setup(app: &App) -> Result<(), tauri::Error> {
    let setting = get_setting(app.state());
    let translate = MenuItem::with_id(app, "translate", format!("{} ({})", "翻译", setting.translate.shortcut.hotkey), true, None::<&str>)?;
    let json_editor = MenuItem::with_id(app, "json_editor", format!("{} ({})", "Json 编辑器", setting.json_editor.open_shortcut.hotkey), true, None::<&str>)?;
    let setting = MenuItem::with_id(app, "setting", "设置", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&translate, &json_editor,&setting, &quit])?;
    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu_on_left_click(false)
        .tooltip("Json 笔记")
        .menu(&menu)
        // .tooltip(s)
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                let app_handle = tray.app_handle();
                nsapp::run_as_foreground(app_handle);
                if let Some(window) = app_handle.get_webview_window("main") {
                    if !window.is_visible().unwrap() {
                        let _ = window.show();
                    }
                    let _ = window.set_focus();
                }
            }
            _ => {
                println!("unhandled event {event:?}");
            }
        })
        .on_menu_event(|app_handle, event| match event.id.as_ref() {
            "translate" => {
                windows::open_translate(app_handle).expect("open translate error");
            }
            "json_editor" => {
                windows::open_json(app_handle).expect("open json_editor error");
            }
            "setting" => {
                windows::open_setting(app_handle).expect("open setting error");
            }
            "quit" => {
                app_handle.exit(0);
                println!("quit");
            }
            _ => {
                println!("unhandled event {event:?}");
            }
        })
        .build(app)?;
    Ok(())
}
