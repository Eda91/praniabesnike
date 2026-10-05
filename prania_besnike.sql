--
-- PostgreSQL database dump
--

\restrict 06wf1lVGIGkImHEbrBNekGX9ZucuWeCLaOCfXTfChaDc5bAxUZaTSfFgZj1NuDp

-- Dumped from database version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: complaint_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaint_history (
    id bigint NOT NULL,
    complaint_id bigint NOT NULL,
    status_id integer,
    obstacle_id integer,
    action text,
    update_date date DEFAULT CURRENT_DATE NOT NULL,
    notes text,
    changed_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: complaint_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaint_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaint_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaint_history_id_seq OWNED BY public.complaint_history.id;


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaints (
    id bigint NOT NULL,
    complaint_code character varying(30) NOT NULL,
    directorate_id integer NOT NULL,
    municipality_id integer NOT NULL,
    administrative_unit_address text,
    deputy_id integer NOT NULL,
    pb_code character varying(100),
    received_date date NOT NULL,
    complainant_first_name character varying(100) NOT NULL,
    complainant_last_name character varying(100) NOT NULL,
    contact character varying(250),
    category_id integer NOT NULL,
    request_description text NOT NULL,
    has_ashk_application boolean NOT NULL,
    application_number character varying(150),
    application_date date,
    status_id integer NOT NULL,
    obstacle_id integer,
    last_action text,
    last_update_date date NOT NULL,
    sector_id integer,
    responsible_specialist character varying(150),
    notification_type_id integer,
    notification_date date,
    closed_date date,
    notes text,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_application_number CHECK (((has_ashk_application = false) OR (application_number IS NOT NULL))),
    CONSTRAINT chk_closed_date CHECK (((closed_date IS NULL) OR (closed_date >= received_date)))
);


--
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaints_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- Name: counties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.counties (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: counties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.counties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: counties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.counties_id_seq OWNED BY public.counties.id;


--
-- Name: deputies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deputies (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: deputies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deputies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deputies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deputies_id_seq OWNED BY public.deputies.id;


--
-- Name: deputy_counties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deputy_counties (
    deputy_id integer NOT NULL,
    county_id integer NOT NULL
);


--
-- Name: directorates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directorates (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    code character varying(10) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: directorates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.directorates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: directorates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.directorates_id_seq OWNED BY public.directorates.id;


--
-- Name: municipalities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.municipalities (
    id integer NOT NULL,
    directorate_id integer NOT NULL,
    county_id integer NOT NULL,
    name character varying(150) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: municipalities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.municipalities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: municipalities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.municipalities_id_seq OWNED BY public.municipalities.id;


--
-- Name: notification_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: notification_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_types_id_seq OWNED BY public.notification_types.id;


--
-- Name: obstacles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.obstacles (
    id integer NOT NULL,
    name character varying(250) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: obstacles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.obstacles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: obstacles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.obstacles_id_seq OWNED BY public.obstacles.id;


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sectors (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: sectors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sectors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sectors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sectors_id_seq OWNED BY public.sectors.id;


--
-- Name: status_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.status_groups (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


--
-- Name: status_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.status_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: status_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.status_groups_id_seq OWNED BY public.status_groups.id;


--
-- Name: statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.statuses (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    status_group_id integer NOT NULL,
    active boolean DEFAULT true NOT NULL
);


--
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.statuses_id_seq OWNED BY public.statuses.id;


--
-- Name: system_parameters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_parameters (
    id integer NOT NULL,
    parameter_key character varying(100) NOT NULL,
    name character varying(200) NOT NULL,
    value integer NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: system_parameters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_parameters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_parameters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_parameters_id_seq OWNED BY public.system_parameters.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    directorate_id integer,
    username character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(30) DEFAULT 'user'::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_user_role CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: complaint_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_history ALTER COLUMN id SET DEFAULT nextval('public.complaint_history_id_seq'::regclass);


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- Name: counties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counties ALTER COLUMN id SET DEFAULT nextval('public.counties_id_seq'::regclass);


--
-- Name: deputies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deputies ALTER COLUMN id SET DEFAULT nextval('public.deputies_id_seq'::regclass);


--
-- Name: directorates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directorates ALTER COLUMN id SET DEFAULT nextval('public.directorates_id_seq'::regclass);


--
-- Name: municipalities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipalities ALTER COLUMN id SET DEFAULT nextval('public.municipalities_id_seq'::regclass);


--
-- Name: notification_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_types ALTER COLUMN id SET DEFAULT nextval('public.notification_types_id_seq'::regclass);


--
-- Name: obstacles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obstacles ALTER COLUMN id SET DEFAULT nextval('public.obstacles_id_seq'::regclass);


--
-- Name: sectors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sectors ALTER COLUMN id SET DEFAULT nextval('public.sectors_id_seq'::regclass);


--
-- Name: status_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_groups ALTER COLUMN id SET DEFAULT nextval('public.status_groups_id_seq'::regclass);


--
-- Name: statuses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statuses ALTER COLUMN id SET DEFAULT nextval('public.statuses_id_seq'::regclass);


--
-- Name: system_parameters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters ALTER COLUMN id SET DEFAULT nextval('public.system_parameters_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, active) FROM stdin;
1	Legalizim	t
2	Regjistrim AMTP	t
3	VKM 827	t
4	Shërbim kadastral	t
5	Mbivendosje / konflikt pronësie	t
6	Përfshirje në VKM shpronësimi	t
7	Pajisje me fatura të parcelës	t
8	Tjetër	t
\.


--
-- Data for Name: complaint_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaint_history (id, complaint_id, status_id, obstacle_id, action, update_date, notes, changed_by, created_at) FROM stdin;
\.


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaints (id, complaint_code, directorate_id, municipality_id, administrative_unit_address, deputy_id, pb_code, received_date, complainant_first_name, complainant_last_name, contact, category_id, request_description, has_ashk_application, application_number, application_date, status_id, obstacle_id, last_action, last_update_date, sector_id, responsible_specialist, notification_type_id, notification_date, closed_date, notes, created_by, updated_by, created_at, updated_at) FROM stdin;
3	BR-000	9	70	Lagjja 5, Kuçovë	73	PB-2026-0101	2026-09-08	Arben	Hoxha	06X XXX XXXX	1	Kërkon pajisjen me leje legalizimi për banesën 2-katëshe; ka vetëdeklarim që nga 2006.	t	VD 1452	2014-05-12	2	4	Urdhër pune për matje më 22.09; pritet relacioni i specialistit.	2026-09-22	1	E. Dervishi	1	2026-09-23	\N	\N	\N	\N	2026-10-02 11:41:19.041591+02	2026-10-02 11:41:19.041591+02
\.


--
-- Data for Name: counties; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.counties (id, name, active) FROM stdin;
1	Berat	t
2	Dibër	t
3	Durrës	t
4	Elbasan	t
5	Fier	t
6	Gjirokastër	t
7	Korçë	t
8	Kukës	t
9	Lezhë	t
10	Shkodër	t
11	Tiranë	t
12	Vlorë	t
\.


--
-- Data for Name: deputies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deputies (id, name, active) FROM stdin;
1	Adelina Rista	t
2	Agron Shehaj	t
3	Albana Vokshi	t
4	Andia Ulliri	t
5	Andi Përmeti	t
6	Anila Denaj	t
7	Antoneta Dhima	t
8	Arbi Agalliu	t
9	Arben Ahmetaj	t
10	Arben Pëllumbi	t
11	Arben Ristani	t
12	Ardit Bido	t
13	Ardit Konomi	t
14	Ardit Çela	t
15	Asllan Dogjani	t
16	Bardh Spahia	t
17	Bardhyl Kollçaku	t
18	Belinda Balluku	t
19	Besa Spaho	t
20	Bledion Nallbati	t
21	Blendi Klosi	t
22	Bora Muzhaqi	t
23	Briseida Cakerri	t
24	Briseida Cakërri	t
25	Brunilda Mersini	t
26	Damian Gjiknuri	t
27	Dashamir Shehi	t
28	Denis Deliu	t
29	Dhimitër Konomi	t
30	Edmond Spaho	t
31	Edona Bilali	t
32	Eduard Shalsi	t
33	Elisa Spiropali	t
34	Enkelejd Alibeaj	t
35	Erion Braçe	t
36	Erion Isai	t
37	Ervin Salianji	t
38	Etilda Gjonaj	t
39	Fatmir Mediu	t
40	Fidel Ylli	t
41	Flamur Hoxha	t
42	Gazment Bardhi	t
43	Gerta Duraku	t
44	Gerta Meta	t
45	Gledis Nano	t
46	Grida Duma	t
47	Ilir Beqaj	t
48	Ilir Metaj	t
49	Ina Zhupa	t
50	Jorida Tabaku	t
51	Klotilda Bushka	t
52	Kreshnik Çollaku	t
53	Lindita Metaliaj	t
54	Luan Baçi	t
55	Luljeta Bozo	t
56	Mirela Kumbaro	t
57	Monika Kryemadhi	t
58	Nasip Naço	t
59	Niko Peleshi	t
60	Ogerta Manastirliu	t
61	Olsi Bylyku	t
62	Orjola Pampuri	t
63	Pandeli Majko	t
64	Petrit Vasili	t
65	Piro Vengu	t
66	Pirro Vengu	t
67	Saimir Korreshi	t
68	Sali Berisha	t
69	Taulant Balla	t
70	Toni Gogu	t
71	Tritan Shehu	t
72	Xhelal Mziu	t
73	Ana Nako	t
\.


--
-- Data for Name: deputy_counties; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deputy_counties (deputy_id, county_id) FROM stdin;
\.


--
-- Data for Name: directorates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directorates (id, name, code, active, created_at, updated_at) FROM stdin;
1	Fier	FR	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
2	Lezhë	LZ	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
3	Gjirokastër	GJ	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
4	Lushnjë	LU	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
5	Sarandë	SR	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
6	Shkodër	SH	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
7	Durrës-Kavajë-Krujë	DKK	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
8	Kamëz-Vorë	KV	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
9	Berat	BR	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
10	Korçë	KO	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
11	Pogradec	PG	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
12	Tiranë Veri	TV	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
13	Tiranë Jug	TJ	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
14	Tiranë Rurale 1	TR1	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
15	Tiranë Rurale 2	TR2	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
16	Dibër	DB	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
17	Elbasan	EL	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
18	Vlorë	VL	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
19	Kukës	KU	t	2026-10-01 15:29:13.672516+02	2026-10-01 15:29:13.672516+02
\.


--
-- Data for Name: municipalities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.municipalities (id, directorate_id, county_id, name, active) FROM stdin;
66	9	1	Berat	t
67	9	1	Dimal	t
68	9	1	Skrapar	t
69	9	1	Poliçan	t
70	9	1	Kuçovë	t
71	16	2	Bulqizë	t
72	16	2	Dibër	t
73	16	2	Klos	t
74	16	2	Mat	t
75	7	3	Durrës	t
76	7	3	Shijak	t
77	7	3	Krujë	t
78	17	4	Librazhd	t
79	17	4	Peqin	t
80	17	4	Prrenjas	t
81	17	4	Belsh	t
82	17	4	Gramsh	t
83	17	4	Elbasan	t
84	17	4	Cërrik	t
85	4	5	Lushnjë	t
86	4	5	Divjakë	t
87	1	5	Fier	t
88	1	5	Patos	t
89	1	5	Roskovec	t
90	1	5	Mallakastër	t
91	3	6	Gjirokastër	t
92	3	6	Dropull	t
93	3	6	Libohovë	t
94	3	6	Këlcyrë	t
95	3	6	Përmet	t
96	3	6	Tepelenë	t
97	3	6	Memaliaj	t
98	11	7	Pogradec	t
99	10	7	Maliq	t
100	10	7	Korçë	t
101	10	7	Devoll	t
102	10	7	Pustec	t
103	10	7	Kolonjë	t
104	19	8	Kukës	t
105	19	8	Tropojë	t
106	19	8	Has	t
107	2	9	Lezhë	t
108	2	9	Kurbin	t
109	2	9	Mirditë	t
110	6	10	Shkodër	t
111	6	10	Malësi e Madhe	t
112	6	10	Vau i Dejës	t
113	6	10	Pukë	t
114	6	10	Fushë-Arrëz	t
115	15	11	Tiranë	t
116	14	11	Tiranë	t
117	13	11	Tiranë	t
118	12	11	Tiranë	t
119	8	11	Kamëz	t
120	8	11	Vorë	t
121	7	11	Kavajë	t
122	7	11	Rrogozhinë	t
123	18	12	Vlorë	t
124	18	12	Selenicë	t
125	18	12	Himarë	t
126	5	12	Sarandë	t
127	5	12	Himarë	t
128	5	12	Konispol	t
129	5	12	Delvinë	t
130	5	12	Finiq	t
\.


--
-- Data for Name: notification_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification_types (id, name, active) FROM stdin;
1	Telefon	t
2	Email	t
3	Postë	t
4	Në zyrë	t
5	e-Albania	t
6	Nuk është njoftuar	t
\.


--
-- Data for Name: obstacles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.obstacles (id, name, active) FROM stdin;
1	Mungon dokumentacioni	t
2	Qytetari i pakontaktueshëm	t
3	Nuk ka aplikim	t
4	Në pritje të matjeve / verifikimit në terren	t
5	Mbivendosje / konflikt pronësie	t
6	Proces gjyqësor	t
7	Në pritje të institucionit tjetër	t
8	Mungesë të dhënash në arkiv / hartë	t
9	Tjetër	t
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sectors (id, name, active) FROM stdin;
1	Legalizime	t
2	Regjistrim / Kadastër	t
3	AMTP	t
4	Hartografi dhe matje	t
5	Juridik	t
6	Arkiva	t
7	Shërbimi me qytetarin	t
8	Tjetër	t
\.


--
-- Data for Name: status_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.status_groups (id, name) FROM stdin;
1	Hapur
2	Zgjidhur
3	Orientuar
4	Pa zgjidhje
\.


--
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.statuses (id, name, status_group_id, active) FROM stdin;
1	E regjistruar	1	t
2	Në proces	1	t
3	Në pritje të qytetarit	1	t
4	Afishim	1	t
5	Pezulluar	1	t
6	Zgjidhur – pajisur me dokument	2	t
7	Zgjidhur – kthyer përgjigje	2	t
8	Orientuar për aplikim	3	t
9	Transferuar	3	t
10	Pa zgjidhje ligjore	4	t
\.


--
-- Data for Name: system_parameters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_parameters (id, parameter_key, name, value, updated_at) FROM stdin;
1	STANDARD_PROCESSING_DAYS	Afati standard i trajtimit (ditë)	30	2026-10-01 15:29:13.809274+02
2	UPDATE_DELAY_DAYS	Pragu i vonesës së përditësimit (ditë)	14	2026-10-01 15:29:13.809274+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, directorate_id, username, password_hash, role, active, created_at, updated_at) FROM stdin;
1	\N	admin	$2b$10$vXqkRQQwSKBzHZUTy.IJUugRiEaTb3aIX.72/smSU6KOTiiCBuXSK	admin	t	2026-10-05 11:27:35.689253+02	2026-10-05 11:31:19.010952+02
2	18	eda.eltari	$2b$10$K0R.pJF5fgKHKoYfR9cZLuq0/Id6WIUw3Q0au5cxM/MqqN/B.Wwc2	user	t	2026-10-05 12:07:40.441664+02	2026-10-05 12:07:40.441664+02
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: complaint_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaint_history_id_seq', 1, false);


--
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaints_id_seq', 3, true);


--
-- Name: counties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.counties_id_seq', 12, true);


--
-- Name: deputies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.deputies_id_seq', 73, true);


--
-- Name: directorates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.directorates_id_seq', 20, true);


--
-- Name: municipalities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.municipalities_id_seq', 130, true);


--
-- Name: notification_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notification_types_id_seq', 6, true);


--
-- Name: obstacles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.obstacles_id_seq', 9, true);


--
-- Name: sectors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sectors_id_seq', 8, true);


--
-- Name: status_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.status_groups_id_seq', 4, true);


--
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.statuses_id_seq', 10, true);


--
-- Name: system_parameters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_parameters_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: complaint_history complaint_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_history
    ADD CONSTRAINT complaint_history_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_complaint_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_complaint_code_key UNIQUE (complaint_code);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: counties counties_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counties
    ADD CONSTRAINT counties_name_key UNIQUE (name);


--
-- Name: counties counties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.counties
    ADD CONSTRAINT counties_pkey PRIMARY KEY (id);


--
-- Name: deputies deputies_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deputies
    ADD CONSTRAINT deputies_name_key UNIQUE (name);


--
-- Name: deputies deputies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deputies
    ADD CONSTRAINT deputies_pkey PRIMARY KEY (id);


--
-- Name: deputy_counties deputy_counties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deputy_counties
    ADD CONSTRAINT deputy_counties_pkey PRIMARY KEY (deputy_id, county_id);


--
-- Name: directorates directorates_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directorates
    ADD CONSTRAINT directorates_code_key UNIQUE (code);


--
-- Name: directorates directorates_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directorates
    ADD CONSTRAINT directorates_name_key UNIQUE (name);


--
-- Name: directorates directorates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directorates
    ADD CONSTRAINT directorates_pkey PRIMARY KEY (id);


--
-- Name: municipalities municipalities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipalities
    ADD CONSTRAINT municipalities_pkey PRIMARY KEY (id);


--
-- Name: notification_types notification_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_types
    ADD CONSTRAINT notification_types_name_key UNIQUE (name);


--
-- Name: notification_types notification_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_types
    ADD CONSTRAINT notification_types_pkey PRIMARY KEY (id);


--
-- Name: obstacles obstacles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obstacles
    ADD CONSTRAINT obstacles_name_key UNIQUE (name);


--
-- Name: obstacles obstacles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obstacles
    ADD CONSTRAINT obstacles_pkey PRIMARY KEY (id);


--
-- Name: sectors sectors_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key UNIQUE (name);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);


--
-- Name: status_groups status_groups_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_groups
    ADD CONSTRAINT status_groups_name_key UNIQUE (name);


--
-- Name: status_groups status_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.status_groups
    ADD CONSTRAINT status_groups_pkey PRIMARY KEY (id);


--
-- Name: statuses statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_name_key UNIQUE (name);


--
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- Name: system_parameters system_parameters_parameter_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT system_parameters_parameter_key_key UNIQUE (parameter_key);


--
-- Name: system_parameters system_parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_parameters
    ADD CONSTRAINT system_parameters_pkey PRIMARY KEY (id);


--
-- Name: municipalities uq_directorate_municipality; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipalities
    ADD CONSTRAINT uq_directorate_municipality UNIQUE (directorate_id, name);


--
-- Name: users users_directorate_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_directorate_id_key UNIQUE (directorate_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_complaints_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_category ON public.complaints USING btree (category_id);


--
-- Name: idx_complaints_closed_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_closed_date ON public.complaints USING btree (closed_date);


--
-- Name: idx_complaints_deputy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_deputy ON public.complaints USING btree (deputy_id);


--
-- Name: idx_complaints_directorate; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_directorate ON public.complaints USING btree (directorate_id);


--
-- Name: idx_complaints_last_update; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_last_update ON public.complaints USING btree (last_update_date);


--
-- Name: idx_complaints_municipality; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_municipality ON public.complaints USING btree (municipality_id);


--
-- Name: idx_complaints_received_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_received_date ON public.complaints USING btree (received_date);


--
-- Name: idx_complaints_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_complaints_status ON public.complaints USING btree (status_id);


--
-- Name: idx_history_complaint; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_history_complaint ON public.complaint_history USING btree (complaint_id);


--
-- Name: complaints update_complaints_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: directorates update_directorates_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_directorates_updated_at BEFORE UPDATE ON public.directorates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: complaints fk_complaint_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_category FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_created_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_created_by FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_deputy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_deputy FOREIGN KEY (deputy_id) REFERENCES public.deputies(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_directorate; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_directorate FOREIGN KEY (directorate_id) REFERENCES public.directorates(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_municipality; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_municipality FOREIGN KEY (municipality_id) REFERENCES public.municipalities(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_notification; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_notification FOREIGN KEY (notification_type_id) REFERENCES public.notification_types(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_obstacle; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_obstacle FOREIGN KEY (obstacle_id) REFERENCES public.obstacles(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_sector; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_sector FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_status; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_status FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE RESTRICT;


--
-- Name: complaints fk_complaint_updated_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_updated_by FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: deputy_counties fk_deputy_county_county; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deputy_counties
    ADD CONSTRAINT fk_deputy_county_county FOREIGN KEY (county_id) REFERENCES public.counties(id) ON DELETE CASCADE;


--
-- Name: deputy_counties fk_deputy_county_deputy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deputy_counties
    ADD CONSTRAINT fk_deputy_county_deputy FOREIGN KEY (deputy_id) REFERENCES public.deputies(id) ON DELETE CASCADE;


--
-- Name: complaint_history fk_history_complaint; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_history
    ADD CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON DELETE CASCADE;


--
-- Name: complaint_history fk_history_obstacle; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_history
    ADD CONSTRAINT fk_history_obstacle FOREIGN KEY (obstacle_id) REFERENCES public.obstacles(id) ON DELETE RESTRICT;


--
-- Name: complaint_history fk_history_status; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_history
    ADD CONSTRAINT fk_history_status FOREIGN KEY (status_id) REFERENCES public.statuses(id) ON DELETE RESTRICT;


--
-- Name: complaint_history fk_history_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_history
    ADD CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: municipalities fk_municipality_county; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipalities
    ADD CONSTRAINT fk_municipality_county FOREIGN KEY (county_id) REFERENCES public.counties(id) ON DELETE RESTRICT;


--
-- Name: municipalities fk_municipality_directorate; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.municipalities
    ADD CONSTRAINT fk_municipality_directorate FOREIGN KEY (directorate_id) REFERENCES public.directorates(id) ON DELETE RESTRICT;


--
-- Name: statuses fk_status_group; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT fk_status_group FOREIGN KEY (status_group_id) REFERENCES public.status_groups(id) ON DELETE RESTRICT;


--
-- Name: users fk_user_directorate; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_directorate FOREIGN KEY (directorate_id) REFERENCES public.directorates(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 06wf1lVGIGkImHEbrBNekGX9ZucuWeCLaOCfXTfChaDc5bAxUZaTSfFgZj1NuDp

