use std::sync::Arc;

use super::super::setting::model::Setting;
use super::model::{DeepLResponse, TranslateBody};
use super::utils::deepl;
use tauri::{command, AppHandle, Manager, Wry};
use tauri_plugin_store::Store;

#[command]
pub async fn translate(app_handle: AppHandle, text: Vec<String>) -> Result<DeepLResponse, String> {
    let store = app_handle.state::<Arc<Store<Wry>>>();
    let setting: Setting = match store.get("setting") {
        Some(s) => serde_json::from_value(s).unwrap_or_default(),
        None => Setting::default(),
    };
    let target_lang = setting.translate.target_language;
    // 修改返回类型
    let trans_res = deepl(
        &app_handle,
        TranslateBody {
            text: text.clone(),
            target_lang: target_lang.clone(),
            source_lang: None,
        },
    )
    .await?;
    let source_lang = if let Some(first_trans_res) = trans_res.translations.first() {
        first_trans_res.detected_source_language.clone()
    } else {
        return Err("No translation was found".to_string());
    };
    let system_lang = setting.translate.system_language;
    if source_lang != system_lang {
        if source_lang == target_lang
            || target_lang.contains(&source_lang)
            || source_lang.contains(&target_lang)
        {
            let trans_res = deepl(
                &app_handle,
                TranslateBody {
                    text,
                    target_lang: system_lang.clone(),
                    source_lang: Some(source_lang.clone()),
                },
            )
            .await?;
            return Ok(trans_res);
        } else {
            let trans_res = deepl(
                &app_handle,
                TranslateBody {
                    text,
                    target_lang: target_lang.clone(),
                    source_lang: None,
                },
            )
            .await?;
            return Ok(trans_res);
        }
    }
    Ok(trans_res)
}
