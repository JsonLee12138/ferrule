use actix_web::{get, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use std::sync::{Arc, Mutex};
use json_utils::ip;

pub struct ServerOptions {
    pub port: u16,
    pub prefix: String,
    pub routes: Option<fn(&mut web::ServiceConfig)>,
    pub host: String,
}

#[get("/health")]
async fn health(req: HttpRequest) -> impl Responder {
    let path = req.path();
    HttpResponse::Ok().body(format!("{}: Healthy", path.replace("health", "")))
}

pub async fn server(
    opts: ServerOptions,
    scope: Option<fn(&mut web::ServiceConfig)>,
) -> std::io::Result<()> {
    let scope = Arc::new(Mutex::new(scope));
    let routes = Arc::new(Mutex::new(opts.routes));
    let prefix_clone = opts.prefix.clone();
    let host = if opts.host.is_empty() { "::" } else { &opts.host };
    let _server = HttpServer::new(move || {
        let mut app = App::new();
        if !prefix_clone.is_empty() {
            let mut scope_app = web::scope(&prefix_clone).service(health);
            if let Some(scope_fn) = scope.lock().unwrap().take() {
                scope_app = scope_app.configure(scope_fn);
            }
            if let Some(_routes) = routes.lock().unwrap().take() {
                scope_app = scope_app.configure(_routes);
            }
            app = app.service(scope_app);
        } else {
            app = app.service(health);
            if let Some(scope_fn) = scope.lock().unwrap().take() {
                app = app.configure(scope_fn);
            }
            if let Some(_routes) = routes.lock().unwrap().take() {
                app = app.configure(_routes);
            }
        }
        app
    })
    .bind((host, opts.port))?;
    let ips = ip::get_ips();
    println!("Server is running:",);
    if host == "127.0.0.1" || host == "localhost" {
        println!("  ➜ http://{}:{}{}", host, opts.port, &opts.prefix);
    } else {
        for ip in ips {
            if ip.to_string() == "127.0.0.1" || ip.to_string() == "localhost" {
                println!("  ➜ http://127.0.0.1:{}{}", opts.port, opts.prefix);
                continue;
            }
            if ip.is_ipv6() {
                if host == "::" {
                    println!(
                        "  ➜ http://[{}]:{}{}",
                        ip,
                        opts.port,
                        opts.prefix
                    );
                }
            } else if host == "0.0.0.0" || host == "::" {
                println!("  ➜ http://{}:{}{}", ip, opts.port, opts.prefix);
            }
        }
    }
    _server.run().await
}
