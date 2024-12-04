use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct System {
    pub port: u16,
    pub host: String,
    pub prefix: String,
}

impl Default for System {
    fn default() -> Self {
        Self {
            port: 3000,
            host: "".into(),
            prefix: "".into(),
        }
    }
}
