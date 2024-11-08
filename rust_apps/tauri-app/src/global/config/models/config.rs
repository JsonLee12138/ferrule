use std::{io, sync::Arc};

use json_config::load_from_path_as;
use serde::Deserialize;
use tauri::{path::BaseDirectory, App, Manager};

use super::deepl::DeepLConfig;

#[derive(Debug, Deserialize, Default)]
pub struct AppConfig {
    pub deepl: DeepLConfig,
}

impl AppConfig {
    pub fn init(app: &App) -> io::Result<Arc<Self>> {
        let app_handle = app.app_handle();
        let source_path = app_handle
            .path()
            .resolve("config", BaseDirectory::Resource)
            .map_err(|e| {
                io::Error::new(
                    io::ErrorKind::NotFound,
                    format!("获取配置文件目录失败:{}", e),
                )
            })?;
        let config = load_from_path_as::<AppConfig>(&source_path)?;
        Ok(Arc::new(config))
    }
}
