use sqlx::PgPool;

use crate::{
    dto::{
        create_contact::CreateContactDTO,
        update_contact::UpdateContactDTO,
        search_contact::SearchContactDTO,
    },
    models::contact::Contact,
    repository::contact_repository,
};

pub async fn get_all_contacts(
    pool: &PgPool,
) -> Result<Vec<Contact>, sqlx::Error> {

    contact_repository::get_all_contacts(pool).await
}

pub async fn create_contact(
    pool: &PgPool,
    payload: CreateContactDTO,
) -> Result<Contact, sqlx::Error> {

    contact_repository::create_contact(pool, payload).await
}

pub async fn get_contact_by_id(
    pool: &PgPool,
    id: i32,
) -> Result<Contact, sqlx::Error> {

    contact_repository::get_contact_by_id(pool, id).await
}

pub async fn update_contact(
    pool: &PgPool,
    id: i32,
    payload: UpdateContactDTO,
) -> Result<Contact, sqlx::Error> {

    contact_repository::update_contact(pool, id, payload).await
}

pub async fn delete_contact(
    pool: &PgPool,
    id: i32,
) -> Result<(), sqlx::Error> {

    contact_repository::delete_contact(pool, id).await
}

pub async fn search_contacts(
    pool: &PgPool,
    params: SearchContactDTO,
) -> Result<Vec<Contact>, sqlx::Error> {

    contact_repository::search_contacts(pool, params).await
}