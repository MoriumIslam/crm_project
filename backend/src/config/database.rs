use sqlx::{postgres::PgPoolOptions, PgPool};
use std::env;
use std::time::Duration;
use tokio::time::sleep;

pub async fn connect_db() -> PgPool {
    let database_url =
        env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set");

    let max_attempts = env::var("DB_CONNECT_RETRIES")
        .ok()
        .and_then(|value| value.parse::<u32>().ok())
        .unwrap_or(5);

    let mut last_error = None;

    for attempt in 1..=max_attempts {
        match PgPoolOptions::new()
            .max_connections(5)
            .connect(&database_url)
            .await
        {
            Ok(pool) => return pool,
            Err(error) => {
                last_error = Some(error);

                if attempt < max_attempts {
                    let delay = Duration::from_secs(attempt as u64 * 2);
                    eprintln!(
                        "Database connection attempt {}/{} failed, retrying in {:?}...",
                        attempt, max_attempts, delay
                    );
                    sleep(delay).await;
                }
            }
        }
    }

    panic!(
        "Failed to connect to database after {} attempts: {}",
        max_attempts,
        last_error
            .expect("database connection should have produced an error")
    )
}