use std::{io, sync::Arc};

use serde::Deserialize;

use super::modules;

#[derive(Deserialize)]
pub struct Config {
  pub system: modules::System,
}

impl Config {
    pub fn init() -> io::Result<Arc<Self>>{
      let cnf = json_config::load_as::<Self>("config")?;
      Ok(Arc::new(cnf))
    }
}
