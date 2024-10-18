use serde::{Deserialize, Serialize};
use sys_locale::get_locale;

#[derive(Debug, Serialize, Deserialize)]
pub struct ShortcutItem {
    pub enabled: bool,
    pub hotkey: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Translate {
    pub shortcut: ShortcutItem,
    #[serde(default = "get_system_language", rename = "systemLanguage")]
    pub system_language: String,
    #[serde(default = "get_target_language", rename = "targetLanguage")]
    pub target_language: String,
}

fn default_translate() -> Translate {
    Translate {
        shortcut: ShortcutItem {
            enabled: true,
            hotkey: "Alt+Shift+T".to_string(),
        },
        system_language: get_system_language(),
        target_language: "EN-US".to_string(),
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JSONEditor {
    #[serde(default, rename = "tabSize")]
    pub tab_size: u8,
    #[serde(default)]
    pub theme: String,
    #[serde(default = "default_open_jsoneditor", rename = "openShortcut")]
    pub open_shortcut: ShortcutItem,
    #[serde(default, rename = "formatShortcut")]
    pub format_shortcut: String,
}

fn default_open_jsoneditor() -> ShortcutItem {
    ShortcutItem {
        enabled: true,
        hotkey: "Alt+J".to_string(),
    }
}

fn default_json_editor() -> JSONEditor {
    JSONEditor {
        tab_size: 2,
        theme: "github".to_string(),
        open_shortcut: default_open_jsoneditor(),
        format_shortcut: "Alt+Shift+F".to_string(),
    }
}

fn get_system_language() -> String {
    let locale = get_locale().unwrap_or("ZH".to_string()).to_uppercase();
    if locale == "ZH-HANS-CN" {
        "ZH-HANS".to_string()
    } else if locale.contains("EN") && !locale.contains("GB") {
        "EN-US".to_string()
    } else if locale.contains("ZH") && !locale.contains("TW") {
        "ZH".to_string()
    }else {
        locale
    }
}

fn get_target_language() -> String {
    let sys_lng = get_system_language();
    if !&sys_lng.contains("EN") {
        "EN-US".to_string()
    } else {
        "AUTO".to_string()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct System {
    #[serde(rename = "startAtLogin", default)]
    pub start_at_login: bool,
    #[serde(rename = "silentStart", default)]
    pub silent_start: bool,
    #[serde(rename = "showTrayIcon", default)]
    pub show_tray_icon: bool,
    #[serde(rename = "showDockIcon", default)]
    pub show_dock_icon: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Setting {
    #[serde(default = "default_translate")]
    pub translate: Translate,
    #[serde(default = "default_system")]
    pub system: System,
    #[serde(default = "default_json_editor", rename = "jsonEditor")]
    pub json_editor: JSONEditor,
}

fn default_system() -> System {
    System {
        start_at_login: false,
        silent_start: true,
        show_tray_icon: true,
        show_dock_icon: true,
    }
}

impl Default for Setting {
    fn default() -> Self {
        Setting {
            translate: default_translate(),
            system: default_system(),
            json_editor: default_json_editor(),
        }
    }
}
