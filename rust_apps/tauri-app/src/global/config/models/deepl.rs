use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct DeepLConfig {
  pub auth_key: String
}

impl Default for DeepLConfig {
  fn default() -> Self {
      DeepLConfig {
          auth_key: "".to_string()
      }
  }
}
