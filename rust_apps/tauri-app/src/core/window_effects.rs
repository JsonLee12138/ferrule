#[cfg(target_os = "windows")]
use window_vibrancy::apply_blur;
#[cfg(target_os = "macos")]
use window_vibrancy::apply_vibrancy;
use window_vibrancy::NSVisualEffectMaterial;

pub fn setup(window: &tauri::WebviewWindow) {
    // #[cfg(target_os = "macos")]
    // apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
    //     .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS.");

    #[cfg(target_os = "windows")]
    apply_blur(&window, Some((18, 18, 18, 125)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");
}
