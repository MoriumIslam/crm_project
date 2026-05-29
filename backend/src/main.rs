use axum::{routing::get, Router};
use dotenvy::dotenv;
use std::env;
use tower_http::cors::{AllowOrigin, Any, CorsLayer};

use crm_backend::{
    config::database::connect_db,
    routes::{
        contact_routes::contact_routes,
        interaction_routes::interaction_routes,
    },
    state::app_state::AppState,
};

#[tokio::main]
async fn main() {

    dotenv().ok();

    let db = connect_db().await;

    let state = AppState { db };

    let frontend_url = env::var("FRONTEND_URL")
        .unwrap_or_else(|_| "http://localhost:5173".to_string());

    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::exact(
            frontend_url.parse().unwrap(),
        ))
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::PUT,
            axum::http::Method::DELETE,
        ])
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(|| async { "ok" }))
        .merge(contact_routes())
        .merge(interaction_routes())
        .layer(cors)
        .with_state(state);

    let port =
        env::var("PORT")
            .unwrap_or("8000".to_string());

    let listener = tokio::net::TcpListener::bind(
        format!("0.0.0.0:{}", port)
    )
    .await
    .unwrap();

    println!("Server running on port {}", port);

    axum::serve(listener, app)
        .await
        .unwrap();
}