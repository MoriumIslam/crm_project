use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Interaction {
    pub id: i32,
    pub contact_id: i32,
    pub note: String,
    pub interaction_type: String,
    pub created_at: NaiveDateTime,
}
