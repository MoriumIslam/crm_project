use sqlx::PgPool;

use crate::{
    dto::create_interaction::CreateInteractionDTO,
    models::interaction::Interaction,
    repository::interaction_repository,
};

pub async fn create_interaction(
    pool: &PgPool,
    payload: CreateInteractionDTO,
) -> Result<Interaction, sqlx::Error> {

    interaction_repository::create_interaction(
        pool,
        payload,
    )
    .await
}

pub async fn get_interactions_by_contact(
    pool: &PgPool,
    contact_id: i32,
) -> Result<Vec<Interaction>, sqlx::Error> {

    interaction_repository::get_interactions_by_contact(
        pool,
        contact_id,
    )
    .await
}

pub async fn delete_interaction(
    pool: &PgPool,
    id: i32,
) -> Result<(), sqlx::Error> {

    interaction_repository::delete_interaction(
        pool,
        id,
    )
    .await
}
