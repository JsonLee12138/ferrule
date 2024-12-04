use std::{io, sync::Arc};

use super::super::config::Config;
use once_cell::sync::OnceCell;

static GLOBAL_CONFIG: OnceCell<Arc<Config>> = OnceCell::new();

pub fn config_setup() -> io::Result<()> {
    let cnf = Config::init()?;
    GLOBAL_CONFIG.set(cnf).map_err(|_| {
        io::Error::new(
            io::ErrorKind::Other,
            "Global configuration has already been initialized",
        )
    })?;
    Ok(())
}

pub fn global_config() -> &'static Arc<Config> {
  GLOBAL_CONFIG.get().expect("Global configuration has not been initialized")
}
