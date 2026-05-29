use sqlx::PgPool;

use crate::{
    dto::{
        create_contact::CreateContactDTO,
        update_contact::UpdateContactDTO,
        search_contact::SearchContactDTO,
    },
    models::contact::Contact,
};

pub async fn get_all_contacts(
    pool: &PgPool,
) -> Result<Vec<Contact>, sqlx::Error> {

    sqlx::query_as::<_, Contact>(
        "SELECT * FROM contacts ORDER BY id DESC"
    )
    .fetch_all(pool)
    .await
}

pub async fn create_contact(
    pool: &PgPool,
    payload: CreateContactDTO,
) -> Result<Contact, sqlx::Error> {

    sqlx::query_as::<_, Contact>(
        "INSERT INTO contacts (name, email, phone, company, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *"
    )
    .bind(payload.name)
    .bind(payload.email)
    .bind(payload.phone)
    .bind(payload.company)
    .bind(payload.status.unwrap_or_else(|| "active".to_string()))
    .fetch_one(pool)
    .await
}

pub async fn get_contact_by_id(
    pool: &PgPool,
    id: i32,
) -> Result<Contact, sqlx::Error> {

    sqlx::query_as::<_, Contact>(
        "SELECT * FROM contacts WHERE id = $1"
    )
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn update_contact(
    pool: &PgPool,
    id: i32,
    payload: UpdateContactDTO,
) -> Result<Contact, sqlx::Error> {

    sqlx::query_as::<_, Contact>(
        "UPDATE contacts
         SET name = $1,
             email = $2,
             phone = $3,
             company = $4,
             status = $5
         WHERE id = $6
         RETURNING *"
    )
    .bind(payload.name)
    .bind(payload.email)
    .bind(payload.phone)
    .bind(payload.company)
    .bind(payload.status.unwrap_or_else(|| "active".to_string()))
    .bind(id)
    .fetch_one(pool)
    .await
}

pub async fn delete_contact(
    pool: &PgPool,
    id: i32,
) -> Result<(), sqlx::Error> {

    sqlx::query(
        "DELETE FROM contacts WHERE id = $1"
    )
    .bind(id)
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn search_contacts(
    pool: &PgPool,
    params: SearchContactDTO,
) -> Result<Vec<Contact>, sqlx::Error> {

    let search = params.q.unwrap_or_default();

    let status = params.status.unwrap_or_default();

    let page = params.page.unwrap_or(1);

    let limit = params.limit.unwrap_or(10);

    let sort = params.sort.unwrap_or("created_at".to_string());

    let offset = (page - 1) * limit;

    let order_by = match sort.as_str() {
        "name" => "name",
        _ => "created_at",
    };

    let query = format!(
        "
        SELECT *
        FROM contacts
        WHERE
            (
                name ILIKE $1
                OR email ILIKE $1
                OR phone ILIKE $1
                OR company ILIKE $1
            )
        AND
            (
                $2 = ''
                OR status = $2
            )
        ORDER BY {}
        DESC
        LIMIT $3
        OFFSET $4
        ",
        order_by
    );

    sqlx::query_as::<_, Contact>(&query)
        .bind(format!("%{}%", search))
        .bind(status)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await
}