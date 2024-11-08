use serde_json::{Map, Value};
use std::rc::Rc;
use swc_common::{SourceMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{
    Decl, Expr, Ident, ModuleItem, Stmt, TsArrayType, TsInterfaceBody, TsInterfaceDecl,
    TsKeywordType, TsKeywordTypeKind, TsPropertySignature, TsType, TsTypeAnn, TsTypeElement,
    TsTypeLit,
};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};

fn value_to_ts_type(val: &Value) -> TsType {
    match val {
        Value::String(_) => TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsStringKeyword,
        }),
        Value::Number(_) => TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsNumberKeyword,
        }),
        Value::Bool(_) => TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        }),
        Value::Array(arr) => {
            if let Some(first_elem) = arr.first() {
                TsType::TsArrayType(TsArrayType {
                    span: DUMMY_SP,
                    elem_type: Box::new(value_to_ts_type(first_elem)),
                })
            } else {
                TsType::TsArrayType(TsArrayType {
                    span: DUMMY_SP,
                    elem_type: Box::new(TsType::TsKeywordType(TsKeywordType {
                        span: DUMMY_SP,
                        kind: TsKeywordTypeKind::TsUnknownKeyword,
                    })),
                })
            }
        }
        Value::Object(obj) => TsType::TsTypeLit(TsTypeLit {
            span: DUMMY_SP,
            members: map_to_ts_interface_menbers(obj),
        }),
        // Value::Null(_) => TsType::TsKeywordType(TsKeywordType {
        //   span: DUMMY_SP,
        //   kind: TsKeywordTypeKind::TsNullKeyword
        // }),
        _ => TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsUnknownKeyword,
        }),
    }
}

fn map_to_ts_interface_menbers(map: &Map<String, Value>) -> Vec<TsTypeElement> {
    let mut members = vec![];
    for (key, value) in map {
        let ts_type = value_to_ts_type(value);
        let member = TsTypeElement::TsPropertySignature(TsPropertySignature {
            span: DUMMY_SP,
            readonly: false,
            key: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                sym: key.clone().into(),
                optional: false,
                ctxt: SyntaxContext::empty(),
            })),
            computed: false,
            optional: false,
            type_ann: Some(Box::new(TsTypeAnn {
                span: DUMMY_SP,
                type_ann: Box::new(ts_type),
            })),
        });
        members.push(member);
    }
    members
}

fn map_to_ts_interface(prop_name: &str, map: &Map<String, Value>) -> ModuleItem {
    ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(Box::new(TsInterfaceDecl {
        span: DUMMY_SP,
        id: Ident {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            sym: prop_name.into(),
            optional: false,
        },
        declare: false,
        type_params: None,
        body: TsInterfaceBody {
            span: DUMMY_SP,
            body: map_to_ts_interface_menbers(map),
        },
        extends: vec![],
    }))))
}

fn gen_ts_code(module_item: ModuleItem) -> String {
    // let globals = Globals::default();
    let cm = Rc::new(SourceMap::default());

    // let mut ts_code = String::new();
    let mut buffer = Vec::new();
    {
        let writer = JsWriter::new(cm.clone(), "\n", &mut buffer, None);
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: writer,
        };
        emitter.emit_module_item(&module_item).unwrap();
    }
    String::from_utf8(buffer).expect("Invalid UTF-8")
}

#[tauri::command]
pub fn json_to_ts_interface(json_data: &str) -> Result<String, String> {
    let value: Value = serde_json::from_str(json_data).map_err(|e| e.to_string())?;
    if let Value::Object(map) = value {
        let module_item = map_to_ts_interface("Props", &map);
        let res = gen_ts_code(module_item);
        Ok(res)
    } else {
        Err("Provided JSON data is not an object.".into())
    }
}
