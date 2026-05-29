CREATE TABLE interactions (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    note TEXT NOT NULL,
    interaction_type VARCHAR(50) DEFAULT 'note',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contact
        FOREIGN KEY(contact_id)
            REFERENCES contacts(id)
            ON DELETE CASCADE
);

CREATE INDEX idx_interactions_contact_id
ON interactions(contact_id);
