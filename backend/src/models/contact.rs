use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Contact {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub phone: String,
    pub company: Option<String>,
    pub status: Option<String>,
    pub created_at: NaiveDateTime,
}