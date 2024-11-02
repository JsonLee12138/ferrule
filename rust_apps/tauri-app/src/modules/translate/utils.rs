use crate::global;

use super::model::{DeepLResponse, TranslateBody};
use tauri::http::{HeaderMap, HeaderValue};

pub async fn deepl(opt: TranslateBody) -> Result<DeepLResponse, String> {
    let client = reqwest::Client::new();

    let mut headers = HeaderMap::new();
    let cnf_clone = global::CONFIG.clone();
    // let deepl_key = format!("DeepL-Auth-Key {}", cnf.deepl.auth_key.clone());
    let deepl_key = {
        let cnf = cnf_clone.read().map_err(|e| format!("Read config error: {}", e))?;
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
