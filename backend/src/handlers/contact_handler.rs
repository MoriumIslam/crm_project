use axum::{
    extract::{Path, Query, State},
    Json,
};

use crate::{
    dto::{
        create_contact::CreateContactDTO,
        update_contact::UpdateContactDTO,
        search_contact::SearchContactDTO,
    },
    services::contact_service,
    state::app_state::AppState,
    utils::errors::AppError,
};

pub async fn get_all_contacts(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {

    let contacts =
        contact_service::get_all_contacts(&state.db).await?;

    Ok(Json(serde_json::json!(contacts)))
}

pub async fn create_contact(
    State(state): State<AppState>,
    Json(payload): Json<CreateContactDTO>,
) -> Result<Json<serde_json::Value>, AppError> {

    let contact =
        contact_service::create_contact(&state.db, payload).await?;

    Ok(Json(serde_json::json!(contact)))
}

pub async fn get_contact_by_id(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, AppError> {

    let contact =
        contact_service::get_contact_by_id(&state.db, id).await?;

    Ok(Json(serde_json::json!(contact)))
}

pub async fn update_contact(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Json(payload): Json<UpdateContactDTO>,
) -> Result<Json<serde_json::Value>, AppError> {

    let updated =
        contact_service::update_contact(
            &state.db,
            id,
            payload,
        )
        .await?;

    Ok(Json(serde_json::json!(updated)))
}

pub async fn delete_contact(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<serde_json::Value>, AppError> {

    contact_service::delete_contact(&state.db, id).await?;

    Ok(Json(serde_json::json!({
        "message": "Contact deleted"
    })))
}

pub async fn search_contacts(
    State(state): State<AppState>,
    Query(params): Query<SearchContactDTO>,
) -> Result<Json<serde_json::Value>, AppError> {

    let contacts = contact_service::search_contacts(
        &state.db,
        params,
    )
    .await?;

    Ok(Json(serde_json::json!(contacts)))
}