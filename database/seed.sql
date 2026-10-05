INSERT INTO directorates (name, code) VALUES
('Fier', 'FR'),
('Lezhë', 'LZ'),
('Gjirokastër', 'GJ'),
('Lushnjë', 'LU'),
('Sarandë', 'SR'),
('Shkodër', 'SH'),
('Durrës-Kavajë-Krujë', 'DKK'),
('Kamëz-Vorë', 'KV'),
('Berat', 'BR'),
('Korçë', 'KO'),
('Pogradec', 'PG'),
('Tiranë Veri', 'TV'),
('Tiranë Jug', 'TJ'),
('Tiranë Rurale 1', 'TR1'),
('Tiranë Rurale 2', 'TR2'),
('Dibër', 'DI'),
('Elbasan', 'EL'),
('Vlorë', 'VL'),
('Kukës', 'KU');

INSERT INTO status_groups (name) VALUES
('Hapur'),
('Zgjidhur'),
('Orientuar'),
('Pa zgjidhje');

INSERT INTO statuses (name, status_group_id)
SELECT 'E regjistruar', id FROM status_groups WHERE name = 'Hapur';

INSERT INTO statuses (name, status_group_id)
SELECT 'Në proces', id FROM status_groups WHERE name = 'Hapur';

INSERT INTO statuses (name, status_group_id)
SELECT 'Në pritje të qytetarit', id FROM status_groups WHERE name = 'Hapur';

INSERT INTO statuses (name, status_group_id)
SELECT 'Afishim', id FROM status_groups WHERE name = 'Hapur';

INSERT INTO statuses (name, status_group_id)
SELECT 'Pezulluar', id FROM status_groups WHERE name = 'Hapur';

INSERT INTO statuses (name, status_group_id)
SELECT 'Zgjidhur – pajisur me dokument', id
FROM status_groups WHERE name = 'Zgjidhur';

INSERT INTO statuses (name, status_group_id)
SELECT 'Zgjidhur – kthyer përgjigje', id
FROM status_groups WHERE name = 'Zgjidhur';

INSERT INTO statuses (name, status_group_id)
SELECT 'Orientuar për aplikim', id
FROM status_groups WHERE name = 'Orientuar';

INSERT INTO statuses (name, status_group_id)
SELECT 'Transferuar', id
FROM status_groups WHERE name = 'Orientuar';

INSERT INTO statuses (name, status_group_id)
SELECT 'Pa zgjidhje ligjore', id
FROM status_groups WHERE name = 'Pa zgjidhje';

INSERT INTO categories (name) VALUES
('Legalizim'),
('Regjistrim AMTP'),
('VKM 827'),
('Shërbim kadastral'),
('Mbivendosje / konflikt pronësie'),
('Përfshirje në VKM shpronësimi'),
('Pajisje me fatura të parcelës'),
('Tjetër');

INSERT INTO obstacles (name) VALUES
('Mungon dokumentacioni'),
('Qytetari i pakontaktueshëm'),
('Nuk ka aplikim'),
('Në pritje të matjeve / verifikimit në terren'),
('Mbivendosje / konflikt pronësie'),
('Proces gjyqësor'),
('Në pritje të institucionit tjetër'),
('Mungesë të dhënash në arkiv / hartë'),
('Tjetër');

INSERT INTO sectors (name) VALUES
('Legalizime'),
('Regjistrim / Kadastër'),
('AMTP'),
('Hartografi dhe matje'),
('Juridik'),
('Arkiva'),
('Shërbimi me qytetarin'),
('Tjetër');

INSERT INTO notification_types (name) VALUES
('Telefon'),
('Email'),
('Postë'),
('Në zyrë'),
('e-Albania'),
('Nuk është njoftuar');

INSERT INTO system_parameters
(parameter_key, name, value)
VALUES
(
    'STANDARD_PROCESSING_DAYS',
    'Afati standard i trajtimit (ditë)',
    30
),
(
    'UPDATE_DELAY_DAYS',
    'Pragu i vonesës së përditësimit (ditë)',
    14
);


-- ============================================
-- DEPUTETET
-- ============================================

INSERT INTO deputies (name) VALUES
('Adelina Rista'),
('Agron Shehaj'),
('Albana Vokshi'),
('Andia Ulliri'),
{'Ana Nako'},
('Andi Përmeti'),
('Anila Denaj'),
('Antoneta Dhima'),
('Arbi Agalliu'),
('Arben Ahmetaj'),
('Arben Pëllumbi'),
('Arben Ristani'),
('Ardit Bido'),
('Ardit Konomi'),
('Ardit Çela'),
('Asllan Dogjani'),
('Bardh Spahia'),
('Bardhyl Kollçaku'),
('Belinda Balluku'),
('Besa Spaho'),
('Bledion Nallbati'),
('Blendi Klosi'),
('Bora Muzhaqi'),
('Briseida Cakerri'),
('Briseida Cakërri'),
('Brunilda Mersini'),
('Damian Gjiknuri'),
('Dashamir Shehi'),
('Denis Deliu'),
('Dhimitër Konomi'),
('Edmond Spaho'),
('Edona Bilali'),
('Eduard Shalsi'),
('Elisa Spiropali'),
('Enkelejd Alibeaj'),
('Erion Braçe'),
('Erion Isai'),
('Ervin Salianji'),
('Etilda Gjonaj'),
('Fatmir Mediu'),
('Fidel Ylli'),
('Flamur Hoxha'),
('Gazment Bardhi'),
('Gerta Duraku'),
('Gerta Meta'),
('Gledis Nano'),
('Grida Duma'),
('Ilir Beqaj'),
('Ilir Metaj'),
('Ina Zhupa'),
('Jorida Tabaku'),
('Klotilda Bushka'),
('Kreshnik Çollaku'),
('Lindita Metaliaj'),
('Luan Baçi'),
('Luljeta Bozo'),
('Mirela Kumbaro'),
('Monika Kryemadhi'),
('Nasip Naço'),
('Niko Peleshi'),
('Ogerta Manastirliu'),
('Olsi Bylyku'),
('Orjola Pampuri'),
('Pandeli Majko'),
('Petrit Vasili'),
('Piro Vengu'),
('Pirro Vengu'),
('Saimir Korreshi'),
('Sali Berisha'),
('Taulant Balla'),
('Toni Gogu'),
('Tritan Shehu'),
('Xhelal Mziu')
ON CONFLICT (name) DO NOTHING;

INSERT INTO counties (name) VALUES
('Berat'),
('Dibër'),
('Durrës'),
('Elbasan'),
('Fier'),
('Gjirokastër'),
('Korçë'),
('Kukës'),
('Lezhë'),
('Shkodër'),
('Tiranë'),
('Vlorë')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- BASHKITE SIPAS DREJTORISE DHE QARKUT
-- ============================================

INSERT INTO municipalities (directorate_id, county_id, name)
SELECT d.id, c.id, m.name
FROM (
    VALUES
        ('Fier', 'Fier', 'Fier'),
        ('Fier', 'Fier', 'Patos'),
        ('Fier', 'Fier', 'Roskovec'),
        ('Fier', 'Fier', 'Mallakastër'),
         -- LEZHË
        ('Lezhë', 'Lezhë', 'Lezhë'),
        ('Lezhë', 'Lezhë', 'Kurbin'),
        ('Lezhë', 'Lezhë', 'Mirditë'),

        -- GJIROKASTËR
        ('Gjirokastër', 'Gjirokastër', 'Gjirokastër'),
        ('Gjirokastër', 'Gjirokastër', 'Dropull'),
        ('Gjirokastër', 'Gjirokastër', 'Libohovë'),
        ('Gjirokastër', 'Gjirokastër', 'Këlcyrë'),
        ('Gjirokastër', 'Gjirokastër', 'Përmet'),
        ('Gjirokastër', 'Gjirokastër', 'Tepelenë'),
        ('Gjirokastër', 'Gjirokastër', 'Memaliaj'),

        -- LUSHNJË
        ('Lushnjë', 'Fier', 'Lushnjë'),
        ('Lushnjë', 'Fier', 'Divjakë'),

        -- SARANDË
        ('Sarandë', 'Vlorë', 'Sarandë'),
        ('Sarandë', 'Vlorë', 'Himarë'),
        ('Sarandë', 'Vlorë', 'Konispol'),
        ('Sarandë', 'Vlorë', 'Delvinë'),
        ('Sarandë', 'Vlorë', 'Finiq'),

        -- SHKODËR
        ('Shkodër', 'Shkodër', 'Shkodër'),
        ('Shkodër', 'Shkodër', 'Malësi e Madhe'),
        ('Shkodër', 'Shkodër', 'Vau i Dejës'),
        ('Shkodër', 'Shkodër', 'Pukë'),
        ('Shkodër', 'Shkodër', 'Fushë-Arrëz'),

        -- DURRËS-KAVAJË-KRUJË
        ('Durrës-Kavajë-Krujë', 'Durrës', 'Durrës'),
        ('Durrës-Kavajë-Krujë', 'Durrës', 'Shijak'),
        ('Durrës-Kavajë-Krujë', 'Tiranë', 'Kavajë'),
        ('Durrës-Kavajë-Krujë', 'Tiranë', 'Rrogozhinë'),
        ('Durrës-Kavajë-Krujë', 'Durrës', 'Krujë'),

        -- KAMËZ-VORË
        ('Kamëz-Vorë', 'Tiranë', 'Kamëz'),
        ('Kamëz-Vorë', 'Tiranë', 'Vorë'),

        -- BERAT
        ('Berat', 'Berat', 'Berat'),
        ('Berat', 'Berat', 'Dimal'),
        ('Berat', 'Berat', 'Skrapar'),
        ('Berat', 'Berat', 'Poliçan'),
        ('Berat', 'Berat', 'Kuçovë'),

        -- KORÇË
        ('Korçë', 'Korçë', 'Maliq'),
        ('Korçë', 'Korçë', 'Korçë'),
        ('Korçë', 'Korçë', 'Devoll'),
        ('Korçë', 'Korçë', 'Pustec'),
        ('Korçë', 'Korçë', 'Kolonjë'),

        -- POGRADEC
        ('Pogradec', 'Korçë', 'Pogradec'),

        -- TIRANË
        ('Tiranë Veri', 'Tiranë', 'Tiranë'),
        ('Tiranë Jug', 'Tiranë', 'Tiranë'),
        ('Tiranë Rurale 1', 'Tiranë', 'Tiranë'),
        ('Tiranë Rurale 2', 'Tiranë', 'Tiranë'),

        -- DIBËR
        ('Dibër', 'Dibër', 'Bulqizë'),
        ('Dibër', 'Dibër', 'Dibër'),
        ('Dibër', 'Dibër', 'Klos'),
        ('Dibër', 'Dibër', 'Mat'),

        -- ELBASAN
        ('Elbasan', 'Elbasan', 'Librazhd'),
        ('Elbasan', 'Elbasan', 'Peqin'),
        ('Elbasan', 'Elbasan', 'Prrenjas'),
        ('Elbasan', 'Elbasan', 'Belsh'),
        ('Elbasan', 'Elbasan', 'Gramsh'),
        ('Elbasan', 'Elbasan', 'Elbasan'),
        ('Elbasan', 'Elbasan', 'Cërrik'),

        -- VLORË
        ('Vlorë', 'Vlorë', 'Vlorë'),
        ('Vlorë', 'Vlorë', 'Selenicë'),
        ('Vlorë', 'Vlorë', 'Himarë'),

        -- KUKËS
        ('Kukës', 'Kukës', 'Kukës'),
        ('Kukës', 'Kukës', 'Tropojë'),
        ('Kukës', 'Kukës', 'Has')

) AS m(directorate_name, county_name, name)
JOIN directorates d
    ON d.name = m.directorate_name
JOIN counties c
    ON c.name = m.county_name
ON CONFLICT (directorate_id, name) DO NOTHING;

