use serde::Deserialize;

#[derive(Deserialize)]
pub struct UpdateContactDTO {
    pub name: String,
    pub email: String,
    pub phone: String,
    #[serde(default)]
    pub company: Option<String>,
    #[serde(default)]
    pub status: Option<String>,
}