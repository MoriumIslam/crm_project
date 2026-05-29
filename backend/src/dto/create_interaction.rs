use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateInteractionDTO {
    pub contact_id: i32,
    pub note: String,
    pub interaction_type: String,
}
