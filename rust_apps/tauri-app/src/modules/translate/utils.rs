use super::model::{DeepLResponse, TranslateBody};
use tauri::http::{HeaderMap, HeaderValue};

pub async fn deepl(opt: TranslateBody) -> Result<DeepLResponse, String> {
    let client = reqwest::Client::new();

    let mut headers = HeaderMap::new();
    headers.insert(
        "Authorization",
        HeaderValue::from_static("DeepL-Auth-Key 5efd3a66-06d0-ece5-84dd-21ea7725748a:fx"),
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
        eprintln!("Request failed: {:?}", resp.status());
        Err(resp.status().to_string())
    }
}
