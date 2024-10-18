use super::nsapp;
use super::window_effects;
use tauri::{command, WebviewWindow};
use tauri::{AppHandle, Error, Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};

pub fn open_translate(app: &AppHandle) -> Result<(), Error> {
    nsapp::run_as_foreground(app);
    let window_label = "translate";
    if let Some(window) = app.get_webview_window(window_label) {
        if !window.is_visible().unwrap() {
            window.show()?;
        }
        window.set_focus()?;
    } else {
        let window = WebviewWindowBuilder::new(
            app,
            window_label,
            WebviewUrl::App("/translate".into()),
        )
        .transparent(true)
        .decorations(false)
        .title("翻译")
        .build()?;
        register_window(app, &window);
    }
    Ok(())
}

pub fn open_setting(app: &AppHandle) -> Result<(), Error> {
    nsapp::run_as_foreground(app);
    let window_label = "setting";
    if let Some(window) = app.get_webview_window(window_label) {
        if !window.is_visible().unwrap() {
            window.show()?;
        }
        window.set_focus()?;
    } else {
        let window = WebviewWindowBuilder::new(
            app,
            window_label,
            WebviewUrl::App("/setting".into()),
        )
        .transparent(false)
        .decorations(true)
        .title("设置")
        .inner_size(500.0, 600.0)
        .build()?;
        // window_effects::setup(&window);
        register_window(app, &window);
    }
    Ok(())
}

pub fn open_json(app: &AppHandle) -> Result<(), Error> {
    nsapp::run_as_foreground(app);
    let window_label = "json_editor";
    if let Some(window) = app.get_webview_window(window_label) {
        if !window.is_visible().unwrap() {
            window.show()?;
        }
        window.set_focus()?;
    } else {
        let window = WebviewWindowBuilder::new(
            app,
            window_label,
            WebviewUrl::App("/json-editor".into()),
        )
        .transparent(true)
        .decorations(true)
        .title("Json Editor")
        .inner_size(800.0, 600.0)
        .build()?;
        window_effects::setup(&window);
        register_window(app, &window);
    }
    Ok(())
}

#[command]
pub fn close_window(app: AppHandle, id: &str) -> Result<(), Error> {
    if let Some(window) = &app.get_webview_window(id) {
        window.close().unwrap();
    }
    Ok(())
}

pub fn register_window(app: &AppHandle, window: &WebviewWindow) {
    let app_hanlde = app.clone();
    window.on_window_event(move |e| match e {
        WindowEvent::Destroyed => {
            nsapp::run_as_background(&app_hanlde);
        }
        _ => {}
    });
}
