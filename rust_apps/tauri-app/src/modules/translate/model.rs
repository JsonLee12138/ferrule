use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct TranslateBody {
    pub text: Vec<String>,
    pub target_lang: String,
    pub source_lang: Option<String>,
}

#[derive(Deserialize, Serialize)]
pub struct DeepLResponseItem {
    pub detected_source_language: String,
    pub text: String,
}

#[derive(Deserialize, Serialize)]
pub struct DeepLResponse {
    pub translations: Vec<DeepLResponseItem>,
}
