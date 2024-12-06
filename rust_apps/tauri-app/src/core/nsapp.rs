#[cfg(target_os = "macos")]
use cocoa::{
    appkit::{NSApplication, NSApplicationActivationPolicy},
    base::nil,
};
use tauri::{AppHandle, Manager, WebviewWindow};

pub fn run_as_background(app: &AppHandle) {
    let windows = app.webview_windows();
    let mut windows_visible: Vec<WebviewWindow> = vec![];
    for window in windows {
        if window.1.is_visible().unwrap() {
            let window_ = window.1.clone();
            windows_visible.push(window.1);
            println!("has window {}", window_.label())
        }
    }
    println!("windows: {:?}", windows_visible.len());
    println!("windows empty: {:?}", windows_visible.is_empty());
    if !windows_visible.is_empty() {
        return;
    }
    #[cfg(target_os = "macos")]
    unsafe {
        let ns_app = NSApplication::sharedApplication(nil);
        ns_app.setActivationPolicy_(
            NSApplicationActivationPolicy::NSApplicationActivationPolicyProhibited,
        );
    }
}

pub fn run_as_foreground(_app: &AppHandle) {
    #[cfg(target_os = "macos")]
    unsafe {
        let ns_app = NSApplication::sharedApplication(nil);
        ns_app.setActivationPolicy_(
            NSApplicationActivationPolicy::NSApplicationActivationPolicyRegular,
        );
        ns_app.activateIgnoringOtherApps_(true);
    }
}
