use std::io;
use actix_core::server;
mod config;
mod global;
mod logger;
use actix_web::{get, web, HttpResponse, Responder};
use global::{global_config, config_setup};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

fn routes(cnf: &mut web::ServiceConfig){
    cnf.service(hello);
}

#[actix_web::main]
async fn main()-> io::Result<()> {
    config_setup().unwrap();
    server::server(
        server::ServerOptions {
            port: global_config().system.port,
            host: global_config().system.host.clone(),
            prefix: global_config().system.prefix.clone(),
            routes: Some(routes),
        },
        None,
    ).await
}
