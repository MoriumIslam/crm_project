use axum::{
    extract::{Path, State},
    Json,
};

use crate::{
    dto::create_interaction::CreateInteractionDTO,
    services::interaction_service,
    state::app_state::AppState,
    utils::errors::AppError,
};

pub async fn create_interaction(
    State(state): State<AppState>,
    Json(payload): Json<CreateInteractionDTO>,
) -> Result<Json<serde_json::Value>, AppError> {

    let interaction =
        interaction_service::create_interaction(
            &state.db,
            payload,
        )
        .await?;

    Ok(Json(serde_json::json!(interaction)))
}

pub async fn get_interactions_by_contact(
    State(state): State<AppState>,
    Path(contact_id): Path<i32>,
) -> Result<Json<serde_json::Value>, AppError> {

    let interactions =
        interaction_service::get_interactions_by_contact(
            &state.db,
            contact_id,
        )
        .await?;

    Ok(Json(serde_json::json!(interactions)))
}

pub async fn delete_interaction(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, AppError> {

    interaction_service::delete_interaction(
        &state.db,
        id,
    )
    .await?;

    Ok(Json(serde_json::json!({
        "message": "Interaction deleted successfully"
    })))
}
