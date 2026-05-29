use axum::{
    extract::State,
    body::Bytes,
    Json,
};
use std::time::{SystemTime, UNIX_EPOCH};
use std::fs;
use std::path::Path;
use std::time::SystemTimeError;

use crate::{
    state::app_state::AppState,
    utils::errors::AppError,
};

pub async fn upload_avatar(
    State(_state): State<AppState>,
    body: Bytes,
) -> Result<Json<serde_json::Value>, AppError> {

    // Ensure uploads directory exists
    let uploads_dir = Path::new("uploads");
    if !uploads_dir.exists() {
        fs::create_dir_all(uploads_dir).map_err(|e| AppError(anyhow::Error::new(e)))?;
    }

    // Use timestamp to avoid collisions
    let ts = SystemTime::now().duration_since(UNIX_EPOCH)
        .map_err(|e: SystemTimeError| AppError(anyhow::Error::new(e)))?
        .as_secs();
    let filename = format!("avatar-{}.bin", ts);
    let filepath = uploads_dir.join(filename);

    fs::write(&filepath, &body).map_err(|e| AppError(anyhow::Error::new(e)))?;

    Ok(Json(serde_json::json!({
        "message": "uploaded",
        "path": filepath.to_string_lossy()
    })))
}
