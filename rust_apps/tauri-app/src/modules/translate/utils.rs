use std::sync::Arc;

use crate::global::AppConfig;

use super::model::{DeepLResponse, TranslateBody};
use tauri::http::{HeaderMap, HeaderValue};
use tauri::{AppHandle, Manager};

pub async fn deepl(app_handle: &AppHandle, opt: TranslateBody) -> Result<DeepLResponse, String> {
    let client = reqwest::Client::new();
    let cnf = app_handle.state::<Arc<AppConfig>>();
    let mut headers = HeaderMap::new();
    let deepl_key = {
        let key = format!("DeepL-Auth-Key {}", cnf.deepl.auth_key);
        key
    };
    headers.insert(
        "Authorization",
        HeaderValue::from_str(&deepl_key).map_err(|e| e.to_string())?,
    );

    let resp = client
        .post("https://api-free.deepl.com/v2/translate")
        .headers(headers)
        .json(&opt)
        .send()
        .await
        .map_err(|e| e.to_string())?; // 错误处理
    if resp.status().is_success() {
        let res_json = resp
            .json::<DeepLResponse>()
            .await
            .map_err(|e| e.to_string())?;
        Ok(res_json)
    } else {
        Err(format!("Request failed: {:?}", resp.status()))
    }
}
