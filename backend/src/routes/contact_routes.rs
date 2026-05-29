use axum::{
    routing::{delete, get, post, put},
    Router,
};

use crate::{
    handlers::contact_handler::*,
    handlers::user_handler::upload_avatar,
    state::app_state::AppState,
};

pub fn contact_routes() -> Router<AppState> {
    Router::new()
        .route("/contacts", get(get_all_contacts))
        .route("/contacts", post(create_contact))
        .route("/contacts/search", get(search_contacts))
        .route("/contacts/{id}", get(get_contact_by_id))
        .route("/contacts/{id}", put(update_contact))
        .route("/contacts/{id}", delete(delete_contact))
        .route("/users/avatar", post(upload_avatar))
}