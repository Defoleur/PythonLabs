--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-10-27 13:33:32

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

--
-- TOC entry 831 (class 1247 OID 235646)
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 235631)
-- Name: event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event (
    id integer NOT NULL,
    title character varying NOT NULL,
    content character varying,
    date date NOT NULL,
    "startTime" time with time zone,
    "endTime" time with time zone,
    "user" integer NOT NULL
);


ALTER TABLE public.event OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 235630)
-- Name: event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.event ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 235651)
-- Name: event_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_user (
    event integer NOT NULL,
    "user" integer NOT NULL
);


ALTER TABLE public.event_user OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 235638)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    email character varying,
    role public.role NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 3176 (class 2606 OID 235637)
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- TOC entry 3180 (class 2606 OID 235655)
-- Name: event_user event_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_user
    ADD CONSTRAINT event_user_pkey PRIMARY KEY (event, "user");


--
-- TOC entry 3178 (class 2606 OID 235644)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3181 (class 2606 OID 235656)
-- Name: event_user event_constraint_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_user
    ADD CONSTRAINT event_constraint_fk FOREIGN KEY (event) REFERENCES public.event(id);


--
-- TOC entry 3182 (class 2606 OID 235661)
-- Name: event_user user_constraint_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_user
    ADD CONSTRAINT user_constraint_fk FOREIGN KEY ("user") REFERENCES public."user"(id);


-- Completed on 2022-10-27 13:33:33

--
-- PostgreSQL database dump complete
--

