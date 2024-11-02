pub enum EnvMode {
    PRODUCTION,
    DEVELOPMENT,
    TESTING,
}

impl EnvMode {
    pub fn from_env_str(e: &str) -> Self {
        match e {
            "production" | "prod" => EnvMode::PRODUCTION,
            "test" => EnvMode::TESTING,
            _ => EnvMode::DEVELOPMENT,
        }
    }
    pub fn as_str(&self) -> &'static str {
        match self {
            EnvMode::PRODUCTION => "prod",
            EnvMode::DEVELOPMENT => "dev",
            EnvMode::TESTING => "test",
        }
    }
}
