mod enums;
mod file;

use std::{
    env,
    io::{Error, ErrorKind, Result},
    path::PathBuf,
};

use config::{Config, File};
use serde::de::DeserializeOwned;

pub use enums::EnvMode;
pub use file::{__dirname, resolve};

pub fn load_from_path(base_path: &PathBuf) -> Result<Config> {
    let env_str = env::var("ENV_MODE").unwrap_or_else(|_| "dev".into());
    let file_type = env::var("CONFIG_FILE_TYPE").unwrap_or_else(|_| "toml".into());
    let file_name = env::var("CONFIG_FILE_NAME").unwrap_or_else(|_| "config".into());
    let env = EnvMode::from_env_str(&env_str);
    let config_paths: Vec<PathBuf> = [
        file_name.clone(),
        format!("{}.local", file_name.as_str()),
        format!("{}.{}", file_name.as_str(), env.as_str()),
        format!("{}.{}.local", file_name.as_str(), env.as_str()),
    ]
    .iter()
    .filter_map(|item| resolve(base_path, format!("{}.{}", item, file_type).as_str()).ok())
    .filter(|item| item.exists())
    .collect();
    if config_paths.is_empty() {
        return Err(Error::new(
            ErrorKind::NotFound,
            "No configuration file is currently found",
        ));
    }
    let mut config_builder = Config::builder();

    for path in config_paths {
        config_builder = config_builder.add_source(File::from(path))
    }

    let config = config_builder
        .build()
        .map_err(|e| Error::new(ErrorKind::Other, e))?;
    Ok(config)
}

pub fn load(base_path: &str) -> Result<Config> {
    let root_path = resolve(&__dirname()?, base_path)?;
    load_from_path(&root_path)
}

pub fn load_as<T>(base_path: &str) -> Result<T>
where
    T: DeserializeOwned,
{
    let config_instance = load(base_path)?;
    config_instance
        .try_deserialize()
        .map_err(|e| Error::new(ErrorKind::Other, format!("Deserialize config error: {}", e)))
}

pub fn load_from_path_as<T>(base_path: &PathBuf) -> Result<T>
where
    T: DeserializeOwned,
{
    let config_instance = load_from_path(base_path)?;
    config_instance
        .try_deserialize()
        .map_err(|e| Error::new(ErrorKind::Other, format!("Deserialize config error: {}", e)))
}
