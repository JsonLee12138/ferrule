#[cfg(target_os = "macos")]
use window_vibrancy::apply_vibrancy;
#[cfg(target_os = "macos")]
use window_vibrancy::NSVisualEffectMaterial;

pub fn setup(window: &tauri::WebviewWindow) {
    #[cfg(target_os = "macos")]
    apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS.");

    #[cfg(target_os = "windows")]
    window.set_shadow(true).unwrap()
}
