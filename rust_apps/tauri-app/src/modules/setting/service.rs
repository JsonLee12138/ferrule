use std::sync::Arc;

use tauri::{command, State, Wry};
use tauri_plugin_store::Store;

use super::model::Setting;

#[command]
pub fn get_os() -> &'static str {
    #[cfg(target_os = "macos")]
    {
        "macos"
    }
    #[cfg(target_os = "windows")]
    {
        "windows"
    }
    #[cfg(target_os = "linux")]
    {
        "linux"
    }
}

#[command]
pub fn get_setting(store: State<'_, Arc<Store<Wry>>>) -> Setting {
    match store.get("setting") {
        Some(s) => serde_json::from_value(s).unwrap_or_default(),
        None => Setting::default(),
    }
}

#[command]
pub fn set_setting_item(
    store: State<'_, Arc<Store<Wry>>>,
    key: &str,
    value: serde_json::Value,
) -> Setting {
    let mut setting: Setting = match store.get("setting") {
        Some(s) => serde_json::from_value(s).unwrap_or_default(),
        None => Setting::default(),
    };
    match key {
        "translate::shortcut::enabled" => {
            if let Some(v) = value.as_bool() {
                setting.translate.shortcut.enabled = v;
            }
        }
        "translate::shortcut::hotkey" => {
            if let Some(v) = value.as_str() {
                setting.translate.shortcut.hotkey = v.to_string();
            }
        }
        "translate::system_language" => {
            if let Some(v) = value.as_str() {
                setting.translate.system_language = v.to_string();
            }
        }
        "translate::target_language" => {
            if let Some(v) = value.as_str() {
                setting.translate.target_language = v.to_string();
            }
        }
        "system::start_at_login" => {
            if let Some(v) = value.as_bool() {
                setting.system.start_at_login = v;
            }
        }
        "system::silent_start" => {
            if let Some(v) = value.as_bool() {
                setting.system.silent_start = v;
            }
        }
        "system::show_tray_icon" => {
            if let Some(v) = value.as_bool() {
                setting.system.show_tray_icon = v;
            }
        }
        "system::show_dock_icon" => {
            if let Some(v) = value.as_bool() {
                setting.system.show_dock_icon = v;
            }
        }
        "json_editor::tab_size" => {
            if let Some(v) = value.as_u64() {
                setting.json_editor.tab_size = v as u8;
            }
        }
        "json_editor::theme" => {
            if let Some(v) = value.as_str() {
                setting.json_editor.theme = v.to_string();
            }
        }
        "json_editor::open_shortcut::enabled" => {
            if let Some(v) = value.as_bool() {
                setting.json_editor.open_shortcut.enabled = v;
            }
        }
        "json_editor::open_shortcut::hotkey" => {
            if let Some(v) = value.as_str() {
                setting.json_editor.open_shortcut.hotkey = v.to_string();
            }
        }
        "json_editor::format_shortcut" => {
            if let Some(v) = value.as_str() {
                setting.json_editor.format_shortcut = v.to_string();
            }
        }
        "url_decode::open_shortcut::enabled" => {
            if let Some(v) = value.as_bool() {
                setting.url_decode.open_shortcut.enabled = v;
            }
        }
        "url_decode::open_shortcut::hotkey" => {
            if let Some(v) = value.as_str() {
                setting.url_decode.open_shortcut.hotkey = v.to_string();
            }
        }
        _ => panic!("Invalid key"),
    }
    store.set(
        "setting",
        serde_json::to_value(&setting).expect("Serialization failed"),
    );
    store.save().expect("Failed to save store");
    setting
}

#[command]
pub fn set_autostart(
    store: State<'_, Arc<Store<Wry>>>,
    auto_manager: State<'_, tauri_plugin_autostart::AutoLaunchManager>,
    value: bool,
) {
    set_setting_item(
        store,
        "system::start_at_login",
        serde_json::Value::Bool(value),
    );
    if value {
        auto_manager.enable().unwrap();
    } else {
        auto_manager.disable().unwrap();
    }
}
