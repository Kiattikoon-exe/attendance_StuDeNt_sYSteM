--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: curriculum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curriculum (
    id integer NOT NULL,
    curr_name_th character varying(100),
    curr_name_en character varying(100),
    short_name_th character varying(100),
    short_name_en character varying(100)
);


ALTER TABLE public.curriculum OWNER TO postgres;

--
-- Name: curriculum_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.curriculum_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.curriculum_id_seq OWNER TO postgres;

--
-- Name: curriculum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.curriculum_id_seq OWNED BY public.curriculum.id;


--
-- Name: prefix; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prefix (
    id integer NOT NULL,
    prefix character varying(30) NOT NULL
);


ALTER TABLE public.prefix OWNER TO postgres;

--
-- Name: prefix_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prefix_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prefix_id_seq OWNER TO postgres;

--
-- Name: prefix_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prefix_id_seq OWNED BY public.prefix.id;


--
-- Name: section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.section (
    id integer NOT NULL,
    section character varying(50) NOT NULL
);


ALTER TABLE public.section OWNER TO postgres;

--
-- Name: section_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.section_id_seq OWNER TO postgres;

--
-- Name: section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.section_id_seq OWNED BY public.section.id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id integer NOT NULL,
    prefix_id integer,
    firstname character varying(200) NOT NULL,
    lastname character varying(200) NOT NULL,
    date_birth date,
    sex character(1),
    curriculum_id integer,
    telephone character varying(50),
    email character varying(100),
    status character varying(50)
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_id_seq OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- Name: student_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_list (
    id integer NOT NULL,
    section_id integer,
    student_id integer,
    status character varying(20),
    datecheck date,
    timecheck time without time zone
);


ALTER TABLE public.student_list OWNER TO postgres;

--
-- Name: student_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_list_id_seq OWNER TO postgres;

--
-- Name: student_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_list_id_seq OWNED BY public.student_list.id;


--
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    id integer NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    email character varying(200) NOT NULL,
    pwd character varying(200) NOT NULL,
    status character varying(20)
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- Name: teacher_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teacher_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teacher_id_seq OWNER TO postgres;

--
-- Name: teacher_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teacher_id_seq OWNED BY public.teacher.id;


--
-- Name: curriculum id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum ALTER COLUMN id SET DEFAULT nextval('public.curriculum_id_seq'::regclass);


--
-- Name: prefix id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefix ALTER COLUMN id SET DEFAULT nextval('public.prefix_id_seq'::regclass);


--
-- Name: section id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section ALTER COLUMN id SET DEFAULT nextval('public.section_id_seq'::regclass);


--
-- Name: student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- Name: student_list id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_list ALTER COLUMN id SET DEFAULT nextval('public.student_list_id_seq'::regclass);


--
-- Name: teacher id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher ALTER COLUMN id SET DEFAULT nextval('public.teacher_id_seq'::regclass);


--
-- Data for Name: curriculum; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curriculum (id, curr_name_th, curr_name_en, short_name_th, short_name_en) FROM stdin;
1	\N	information technology	\N	IT
2	\N	Computer Science	\N	CS
\.


--
-- Data for Name: prefix; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prefix (id, prefix) FROM stdin;
27	655021000046
28	655021000047
29	655021000048
30	655021000049
31	655021000050
32	655021000051
33	655021000052
34	655021000053
35	655021000054
36	655021000055
37	655021000022
\.


--
-- Data for Name: section; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.section (id, section) FROM stdin;
15	1
27	2
28	3
29	4
30	5
31	6
32	7
33	8
34	9
35	10
36	11
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id, prefix_id, firstname, lastname, date_birth, sex, curriculum_id, telephone, email, status) FROM stdin;
41	28	Lina	Crowell	2000-03-23	F	2	0800000002	lina.crowell@example.com	student
42	29	Talon	Graves	2001-07-11	M	1	0800000003	talon.graves@example.com	student
43	30	Mira	Hasting	2002-05-02	F	2	0800000004	mira.hasting@example.com	student
44	31	Kai	Fenton	2000-08-18	M	1	0800000005	kai.fenton@example.com	student
45	32	Elara	Vaughn	2001-09-14	F	2	0800000006	elara.vaughn@example.com	student
46	33	Orin	Ashford	2000-11-22	M	1	0800000007	orin.ashford@example.com	student
47	34	Zara	Lennox	2001-12-19	F	2	0800000008	zara.lennox@example.com	student
48	35	Tess	Hawke	2000-06-10	F	1	0800000009	tess.hawke@example.com	student
49	36	Jace	Rivers	2002-04-05	M	1	0800000010	jace.rivers@example.com	student
40	27	Aric	Summers	2001-01-15	M	1	08055559651	aric.summers@example.com	student
50	37	kiattikoon	rodklongtun	2003-03-15	M	1	0909090909	kiattikoon@hotmail.com	student
\.


--
-- Data for Name: student_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_list (id, section_id, student_id, status, datecheck, timecheck) FROM stdin;
116	28	42	\N	\N	\N
117	29	43	\N	\N	\N
118	29	44	\N	\N	\N
119	30	45	\N	\N	\N
106	27	41	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-23	11:23:00
125	28	42	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-23	11:53:00
136	30	46	\N	\N	\N
137	30	47	\N	\N	\N
138	30	48	\N	\N	\N
139	30	49	\N	\N	\N
140	30	40	\N	\N	\N
141	15	50	\N	\N	\N
142	30	45	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-26	13:37:00
143	30	46	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-26	13:37:00
144	30	47	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-26	13:37:00
145	30	48	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-26	13:37:00
146	30	49	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-26	13:37:00
147	30	40	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-26	13:37:00
148	30	45	เธชเธฒเธข	2024-10-27	13:37:00
149	30	46	เธชเธฒเธข	2024-10-27	13:37:00
150	30	47	เธชเธฒเธข	2024-10-27	13:37:00
151	30	48	เธชเธฒเธข	2024-10-27	13:37:00
152	30	49	เธชเธฒเธข	2024-10-27	13:37:00
153	30	40	เธฅเธฒ	2024-10-27	13:37:00
154	15	50	เธชเธฒเธข	2024-10-24	18:31:00
155	15	50	เธฅเธฒ	2024-10-25	18:31:00
156	15	50	เธเธฒเธ”	2024-10-23	18:31:00
157	15	50	เน€เธเนเธฒเน€เธฃเธตเธขเธ	2024-10-30	18:32:00
\.


--
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher (id, firstname, lastname, email, pwd, status) FROM stdin;
1	teacherAdmin	admin	admin@admin.com	1234	admin
9	teacher	admin2	teacher1@admin.com	4321	teacher
8	teacher	admin	teacher@1234.com	9999	admin
26	kiattikoon	rodklongtun	k@k	999	teacher
28	เน€เธเธตเธขเธฃเธ•เธดเธเธธเธฅ	เธฃเธญเธ”เธเธฅเธญเธเธ•เธฑเธ	a@b	1	teacher
11	kiattik00n999999	inwzazaa99999	z@zzzz	9999	teacher
10	a	a	a@a	1	teacher
29	teacher	1	teacher@admin	admin	teacher
\.


--
-- Name: curriculum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.curriculum_id_seq', 3, true);


--
-- Name: prefix_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prefix_id_seq', 37, true);


--
-- Name: section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.section_id_seq', 36, true);


--
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_id_seq', 50, true);


--
-- Name: student_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_list_id_seq', 157, true);


--
-- Name: teacher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_id_seq', 29, true);


--
-- Name: curriculum curriculum_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculum
    ADD CONSTRAINT curriculum_pkey PRIMARY KEY (id);


--
-- Name: prefix prefix_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prefix
    ADD CONSTRAINT prefix_pkey PRIMARY KEY (id);


--
-- Name: section section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (id);


--
-- Name: student_list student_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_list
    ADD CONSTRAINT student_list_pkey PRIMARY KEY (id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (id);


--
-- Name: student student_curriculum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_curriculum_id_fkey FOREIGN KEY (curriculum_id) REFERENCES public.curriculum(id);


--
-- Name: student_list student_list_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_list
    ADD CONSTRAINT student_list_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.section(id);


--
-- Name: student student_prefix_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_prefix_id_fkey FOREIGN KEY (prefix_id) REFERENCES public.prefix(id);


--
-- PostgreSQL database dump complete
--

