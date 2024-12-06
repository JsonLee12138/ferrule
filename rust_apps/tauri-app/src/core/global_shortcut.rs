use super::super::modules::setting::model::Setting;
use super::windows;
use global_hotkey::hotkey::HotKey;
use std::{collections::HashMap, io::ErrorKind, str::FromStr, sync::Arc};
use tauri::{AppHandle, Error, Manager, Wry};
use tauri_plugin_global_shortcut::{Builder, GlobalShortcutExt, Shortcut};
use tauri_plugin_store::Store;

pub fn setup(app: &tauri::App) -> Result<(), tauri::Error> {
    let store = app.handle().state::<Arc<Store<Wry>>>();
    let default_setting = Setting::default();
    let default_setting_json = serde_json::to_value(default_setting).expect("Serialization failed");
    let setting = store.get("setting").unwrap_or(default_setting_json);
    let setting: Setting = serde_json::from_value(setting).expect("Deserialization failed");
    let translate_shortcut_key = setting.translate.shortcut.hotkey;
    let translate_shortcut_key =
        Shortcut::from_str(&translate_shortcut_key).expect("Invalid shortcut format");

    let json_shortcut_key = setting.json_editor.open_shortcut.hotkey;
    let json_shortcut_key =
        Shortcut::from_str(&json_shortcut_key).expect("Invalid shortcut format");
    let url_decode_shortcut_key = setting.url_decode.open_shortcut.hotkey;
    let url_decode_shortcut_key =
        Shortcut::from_str(&url_decode_shortcut_key).expect("Invalid shortcut format");
    let mut shortcuts = HashMap::<HotKey, fn(&AppHandle) -> Result<(), tauri::Error>>::new();
    shortcuts.insert(translate_shortcut_key, translate_shortcut);
    shortcuts.insert(json_shortcut_key, json_shortcut);
    shortcuts.insert(url_decode_shortcut_key, url_decode_shortcut);
    app.handle().plugin(
        Builder::new()
            .with_handler(move |_app, _key, _shortcut| {
                if let Some(action) = shortcuts.get(_key) {
                    action(_app).expect("Failed to execute shortcut action");
                }
            })
            .build(),
    )?;
    let use_translate_hotkey = setting.translate.shortcut.enabled;
    if use_translate_hotkey {
        app.global_shortcut()
            .register(translate_shortcut_key)
            .map_err(|e| Error::from(std::io::Error::new(ErrorKind::Other, e.to_string())))?;
    }
    let use_json_editor_hotkey = setting.json_editor.open_shortcut.enabled;
    if use_json_editor_hotkey {
        app.global_shortcut()
            .register(json_shortcut_key)
            .map_err(|e| Error::from(std::io::Error::new(ErrorKind::Other, e.to_string())))?;
    }
    let use_url_decode_hotkey = setting.url_decode.open_shortcut.enabled;
    if use_url_decode_hotkey {
        app.global_shortcut()
            .register(url_decode_shortcut_key)
            .map_err(|e| Error::from(std::io::Error::new(ErrorKind::Other, e.to_string())))?;
    }
    Ok(())
}

// 翻译快捷键
fn translate_shortcut(app: &tauri::AppHandle) -> Result<(), tauri::Error> {
    windows::open_translate(app)?;
    Ok(())
}

// json快捷键
fn json_shortcut(app: &tauri::AppHandle) -> Result<(), tauri::Error> {
    windows::open_json(app)?;
    Ok(())
}

fn url_decode_shortcut(app: &tauri::AppHandle) -> Result<(), tauri::Error> {
    windows::open_url_decode(app)?;
    Ok(())
}
