use actix_web::{HttpResponse, Responder};

// Define the health check handler function
pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("OK") // Respond with "OK" if the service is healthy
}

// Configure the route inside `init_routes` function
pub fn routes(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.route("/health", actix_web::web::get().to(health_check));
}
