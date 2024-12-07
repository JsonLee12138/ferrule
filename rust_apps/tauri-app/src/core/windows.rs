use super::nsapp;
use super::window_effects;
use tauri::command;
use tauri::WebviewWindow;
use tauri::{AppHandle, Error, Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};

pub struct WindowConfig {
    label: String,
    url: String,
    transparent: bool,
    decorations: bool,
    width: f64,
    height: f64,
    title: String,
    shadow: bool,
}

pub fn open_window(app: &AppHandle, config: WindowConfig) -> Result<(), Error> {
    nsapp::run_as_foreground(app);
    if let Some(window) = app.get_webview_window(&config.label) {
        if !window.is_visible()? {
            window.show()?;
        }
        window.set_focus()?;
    } else {
        let window =
            WebviewWindowBuilder::new(app, config.label, WebviewUrl::App(config.url.into()))
                .transparent(config.transparent)
                .decorations(config.decorations)
                .inner_size(config.width, config.height)
                .title(config.title)
                .center()
                .build()?;
        if config.shadow {
            window_effects::setup(&window);
        }
        register_window(app, &window);
    }
    Ok(())
}

pub fn open_translate(app: &AppHandle) -> Result<(), Error> {
    let config = WindowConfig {
        label: "translate".to_string(),
        url: "/translate".to_string(),
        transparent: true,
        decorations: false,
        width: 500.0,
        height: 600.0,
        title: "翻译".to_string(),
        shadow: false,
    };
    open_window(app, config)
}

pub fn open_setting(app: &AppHandle) -> Result<(), Error> {
    let config = WindowConfig {
        label: "setting".to_string(),
        url: "/setting".to_string(),
        transparent: false,
        decorations: true,
        width: 500.0,
        height: 600.0,
        title: "设置".to_string(),
        shadow: false,
    };
    open_window(app, config)
}

pub fn open_json(app: &AppHandle) -> Result<(), Error> {
    let config = WindowConfig {
        label: "json_editor".to_string(),
        url: "/json-editor".to_string(),
        transparent: true,
        decorations: true,
        width: 800.0,
        height: 600.0,
        title: "Json Editor".to_string(),
        shadow: false,
    };
    open_window(app, config)
}

pub fn open_url_decode(app: &AppHandle) -> Result<(), Error> {
    let config = WindowConfig {
        label: "url_decode".to_string(),
        url: "/url-decode".to_string(),
        transparent: false,
        decorations: true,
        width: 800.0,
        height: 600.0,
        title: "URL 解析器".to_string(),
        shadow: false,
    };
    open_window(app, config)
}

#[command]
pub fn close_window(app: AppHandle, id: &str) -> Result<(), Error> {
    if let Some(window) = &app.get_webview_window(id) {
        window.close()?;
    }
    Ok(())
}

pub fn register_window(app: &AppHandle, window: &WebviewWindow) {
    let app_hanlde = app.clone();
    let window_clone = window.clone();
    window.on_window_event(move |e| match e {
        WindowEvent::Destroyed => {
            nsapp::run_as_background(&app_hanlde);
        }
        WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
            window_clone.hide().unwrap();
        }
        _ => {}
    });
}

pub fn register_window_by_label(app: &AppHandle, label: &str)-> tauri::Result<()> {
    let window = app.get_webview_window(label).ok_or_else(|| Error::AssetNotFound(format!("Window '{}' not found", label)))?;
    register_window(app, &window);
    Ok(())
}

pub fn register_all_windows(app: &AppHandle) -> tauri::Result<()> {
    let tauri_config = app.config();
    let windows_cnf = tauri_config.app.windows.clone();
    for window_cnf in windows_cnf {
        let label = window_cnf.label;
        register_window_by_label(app, &label)?;
        let window = app
            .get_webview_window(&label)
            .ok_or_else(|| Error::AssetNotFound(format!("Window '{}' not found", label)))?;
        if window_cnf.shadow {
            window_effects::setup(&window);
        }
    }
    Ok(())
}
