BEGIN;

INSERT INTO complaints (
    complaint_code,
    directorate_id,
    municipality_id,
    administrative_unit_address,

    deputy_id,
    pb_code,
    received_date,

    complainant_first_name,
    complainant_last_name,
    contact,

    category_id,
    request_description,
    has_ashk_application,
    application_number,
    application_date,

    status_id,
    obstacle_id,
    last_action,
    last_update_date,
    sector_id,
    responsible_specialist,
    notification_type_id,
    notification_date,
    closed_date,
    notes,

    created_by,
    updated_by
)
VALUES (
    'BR-000',

    /* Drejtoria Vendore: Berat */
    (
        SELECT id
        FROM directorates
        WHERE name = 'Berat'
    ),

    /* Bashkia: Kuçovë, brenda DV Berat */
    (
        SELECT m.id
        FROM municipalities m
        JOIN directorates d
            ON d.id = m.directorate_id
        WHERE m.name = 'Kuçovë'
          AND d.name = 'Berat'
    ),

    /* Njësia administrative / adresa */
    'Lagjja 5, Kuçovë',

    /* Deputeti */
    (
        SELECT id
        FROM deputies
        WHERE name = 'Ana Nako'
    ),

    /* Kodi PB */
    'PB-2026-0101',

    /* Data e marrjes së ankesës */
    '2026-09-08',

    /* Ankuesi */
    'Arben',
    'Hoxha',
    '06X XXX XXXX',

    /* Kategoria */
    (
        SELECT id
        FROM categories
        WHERE name = 'Legalizim'
    ),

    /* Përshkrimi */
    'Kërkon pajisjen me leje legalizimi për banesën 2-katëshe; ka vetëdeklarim që nga 2006.',

    /* Ka aplikim në ASHK */
    TRUE,

    /* Nr. aplikimi / vetëdeklarimi */
    'VD 1452',

    /* Data e aplikimit */
    '2014-05-12',

    /* Statusi */
    (
        SELECT id
        FROM statuses
        WHERE name = 'Në proces'
    ),

    /* Pengesa */
    (
        SELECT id
        FROM obstacles
        WHERE name = 'Në pritje të matjeve / verifikimit në terren'
    ),

    /* Veprimi i fundit / hapi i radhës */
    'Urdhër pune për matje më 22.09; pritet relacioni i specialistit.',

    /* Data e përditësimit të fundit */
    '2026-09-22',

    /* Sektori përgjegjës */
    (
        SELECT id
        FROM sectors
        WHERE name = 'Legalizime'
    ),

    /* Specialisti përgjegjës */
    'E. Dervishi',

    /* Njoftimi i qytetarit */
    (
        SELECT id
        FROM notification_types
        WHERE name = 'Telefon'
    ),

    /* Data e njoftimit */
    '2026-09-23',

    /* Data e mbylljes */
    NULL,

    /* Shënime */
    NULL,

    /* User-at do t'i implementojmë më vonë */
    NULL,
    NULL
);

COMMIT;
