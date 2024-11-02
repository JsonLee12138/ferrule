use std::sync::Arc;

use json_config::load_as;
use std::sync::RwLock;

use super::models::Config;

lazy_static::lazy_static! {
  pub static ref CONFIG: Arc<RwLock<Config>> =
  Arc::new(RwLock::new(load_as::<Config>("config").unwrap()));
}
