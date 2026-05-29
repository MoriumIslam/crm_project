use sqlx::PgPool;

use crate::{
    dto::create_interaction::CreateInteractionDTO,
    models::interaction::Interaction,
};

pub async fn create_interaction(
    pool: &PgPool,
    payload: CreateInteractionDTO,
) -> Result<Interaction, sqlx::Error> {

    sqlx::query_as::<_, Interaction>(
        "
        INSERT INTO interactions (
            contact_id,
            note,
            interaction_type
        )
        VALUES ($1, $2, $3)
        RETURNING *
        "
    )
    .bind(payload.contact_id)
    .bind(payload.note)
    .bind(payload.interaction_type)
    .fetch_one(pool)
    .await
}

pub async fn get_interactions_by_contact(
    pool: &PgPool,
    contact_id: i32,
) -> Result<Vec<Interaction>, sqlx::Error> {

    sqlx::query_as::<_, Interaction>(
        "
        SELECT *
        FROM interactions
        WHERE contact_id = $1
        ORDER BY created_at DESC
        "
    )
    .bind(contact_id)
    .fetch_all(pool)
    .await
}

pub async fn delete_interaction(
    pool: &PgPool,
    id: i32,
) -> Result<(), sqlx::Error> {

    sqlx::query(
        "
        DELETE FROM interactions
        WHERE id = $1
        "
    )
    .bind(id)
    .execute(pool)
    .await?;

    Ok(())
}
