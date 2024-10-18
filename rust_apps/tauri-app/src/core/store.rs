use tauri::{App, Manager};
use tauri_plugin_store::StoreBuilder;

pub fn setup(app: &App) -> Result<(), tauri::Error> {
    let store = StoreBuilder::new(app, "store.bin").build();
    app.manage(store);
    Ok(())
}
