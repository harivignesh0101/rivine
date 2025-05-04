mod routes;

use actix_web::{App, HttpServer, Responder};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .configure(routes::health::routes)  // Use the health check route from the routes module
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}
