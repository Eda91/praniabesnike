-- =====================================================
-- PRANIA BESNIKE
-- PostgreSQL Database Schema
-- =====================================================

-- =========================
-- DREJTORITE VENDORE
-- =========================

CREATE TABLE directorates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- USERS
-- 1 DV = 1 USER
-- =========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    directorate_id INTEGER UNIQUE,

    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(30) NOT NULL DEFAULT 'DV',
    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_directorate
        FOREIGN KEY (directorate_id)
        REFERENCES directorates(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_user_role
        CHECK (role IN ('ADMIN', 'QENDROR', 'DV'))
);



CREATE TABLE counties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- =========================
-- BASHKITE
-- =========================

CREATE TABLE municipalities (
    id SERIAL PRIMARY KEY,

    directorate_id INTEGER NOT NULL,
    county_id INTEGER NOT NULL,

    name VARCHAR(150) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_municipality_directorate
        FOREIGN KEY (directorate_id)
        REFERENCES directorates(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_municipality_county
        FOREIGN KEY (county_id)
        REFERENCES counties(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_directorate_municipality
        UNIQUE (directorate_id, name)
);


-- =========================
-- DEPUTETET
-- =========================

CREATE TABLE deputies (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    active BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================
-- DEPUTET <-> QARK
-- =========================

CREATE TABLE deputy_counties (
    deputy_id INTEGER NOT NULL,
    county_id INTEGER NOT NULL,

    PRIMARY KEY (deputy_id, county_id),

    CONSTRAINT fk_deputy_county_deputy
        FOREIGN KEY (deputy_id)
        REFERENCES deputies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_deputy_county_county
        FOREIGN KEY (county_id)
        REFERENCES counties(id)
        ON DELETE CASCADE
);


-- =========================
-- KATEGORITE
-- =========================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================
-- STATUS GROUPS
-- =========================

CREATE TABLE status_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


-- =========================
-- STATUSET
-- =========================

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,

    name VARCHAR(200) NOT NULL UNIQUE,
    status_group_id INTEGER NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_status_group
        FOREIGN KEY (status_group_id)
        REFERENCES status_groups(id)
        ON DELETE RESTRICT
);


-- =========================
-- PENGESAT
-- =========================

CREATE TABLE obstacles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================
-- SEKTORET
-- =========================

CREATE TABLE sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================
-- MENYRAT E NJOFTIMIT
-- =========================

CREATE TABLE notification_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================
-- PARAMETRAT E SISTEMIT
-- =========================

CREATE TABLE system_parameters (
    id SERIAL PRIMARY KEY,

    parameter_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    value INTEGER NOT NULL,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- REGJISTRI I ANKESAVE
-- =====================================================

CREATE TABLE complaints (

    id BIGSERIAL PRIMARY KEY,

    -- Kodi i ankeses, p.sh. BR-001
    complaint_code VARCHAR(30) NOT NULL UNIQUE,

    -- IDENTIFIKIMI
    directorate_id INTEGER NOT NULL,
    municipality_id INTEGER NOT NULL,

    administrative_unit_address TEXT,

    -- BURIMI I ANKESES
    deputy_id INTEGER NOT NULL,

    pb_code VARCHAR(100),

    received_date DATE NOT NULL,

    -- ANKUESI
    complainant_first_name VARCHAR(100) NOT NULL,
    complainant_last_name VARCHAR(100) NOT NULL,

    contact VARCHAR(250),

    -- KERKESA
    category_id INTEGER NOT NULL,

    request_description TEXT NOT NULL,

    has_ashk_application BOOLEAN NOT NULL,

    application_number VARCHAR(150),

    application_date DATE,

    -- NDJEKJA
    status_id INTEGER NOT NULL,

    obstacle_id INTEGER,

    last_action TEXT,

    last_update_date DATE NOT NULL,

    sector_id INTEGER,

    responsible_specialist VARCHAR(150),

    notification_type_id INTEGER,

    notification_date DATE,

    closed_date DATE,

    notes TEXT,

    -- AUDIT
    created_by INTEGER NOT NULL,
    updated_by INTEGER,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- FOREIGN KEYS

    CONSTRAINT fk_complaint_directorate
        FOREIGN KEY (directorate_id)
        REFERENCES directorates(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_municipality
        FOREIGN KEY (municipality_id)
        REFERENCES municipalities(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_deputy
        FOREIGN KEY (deputy_id)
        REFERENCES deputies(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_status
        FOREIGN KEY (status_id)
        REFERENCES statuses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_obstacle
        FOREIGN KEY (obstacle_id)
        REFERENCES obstacles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_sector
        FOREIGN KEY (sector_id)
        REFERENCES sectors(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_notification
        FOREIGN KEY (notification_type_id)
        REFERENCES notification_types(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_complaint_updated_by
        FOREIGN KEY (updated_by)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    -- Nese ka aplikim = duhet nr. aplikimi
    CONSTRAINT chk_application_number
        CHECK (
            has_ashk_application = FALSE
            OR application_number IS NOT NULL
        ),

    CONSTRAINT chk_closed_date
        CHECK (
            closed_date IS NULL
            OR closed_date >= received_date
        )
);


-- =====================================================
-- HISTORIKU I ANKESES
-- Ruajme ndryshimet e statusit/veprimeve
-- =====================================================

CREATE TABLE complaint_history (

    id BIGSERIAL PRIMARY KEY,

    complaint_id BIGINT NOT NULL,

    status_id INTEGER,

    obstacle_id INTEGER,

    action TEXT,

    update_date DATE NOT NULL DEFAULT CURRENT_DATE,

    notes TEXT,

    changed_by INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_complaint
        FOREIGN KEY (complaint_id)
        REFERENCES complaints(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_history_status
        FOREIGN KEY (status_id)
        REFERENCES statuses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_history_obstacle
        FOREIGN KEY (obstacle_id)
        REFERENCES obstacles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_history_user
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_complaints_directorate
ON complaints(directorate_id);

CREATE INDEX idx_complaints_municipality
ON complaints(municipality_id);

CREATE INDEX idx_complaints_status
ON complaints(status_id);

CREATE INDEX idx_complaints_category
ON complaints(category_id);

CREATE INDEX idx_complaints_deputy
ON complaints(deputy_id);

CREATE INDEX idx_complaints_received_date
ON complaints(received_date);

CREATE INDEX idx_complaints_last_update
ON complaints(last_update_date);

CREATE INDEX idx_complaints_closed_date
ON complaints(closed_date);

CREATE INDEX idx_history_complaint
ON complaint_history(complaint_id);


-- =====================================================
-- AUTO UPDATE updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_directorates_updated_at
BEFORE UPDATE ON directorates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TRIGGER update_complaints_updated_at
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();