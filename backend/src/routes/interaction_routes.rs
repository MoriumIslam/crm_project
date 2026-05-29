use axum::{
    routing::{delete, get, post},
    Router,
};

use crate::{
    handlers::interaction_handler::*,
    state::app_state::AppState,
};

pub fn interaction_routes() -> Router<AppState> {

    Router::new()

        .route(
            "/interactions",
            post(create_interaction),
        )

        .route(
            "/contacts/{contact_id}/interactions",
            get(get_interactions_by_contact),
        )

        .route(
            "/interactions/{id}",
            delete(delete_interaction),
        )
}
