use serde::Deserialize;

use super::deepl::DeepLConfig;

#[derive(Debug, Deserialize, Default)]
pub struct Config {
  pub deepl: DeepLConfig
}
