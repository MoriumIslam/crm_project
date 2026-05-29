use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct SearchContactDTO {
    pub q: Option<String>,
    pub status: Option<String>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub sort: Option<String>,
}
