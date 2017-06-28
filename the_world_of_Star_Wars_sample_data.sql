-- PostgreSQL database dump

ALTER TABLE IF EXISTS ONLY public.sw_users DROP CONSTRAINT IF EXISTS pk_sw_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.sw_planet_votes DROP CONSTRAINT IF EXISTS pk_sw_planet_votes_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.sw_planet_votes DROP CONSTRAINT IF EXISTS fk_sw_user_id CASCADE;

DROP TABLE IF EXISTS public.sw_users;
DROP SEQUENCE IF EXISTS public.sw_users_id_seq;
CREATE TABLE sw_users (
    id serial NOT NULL, -- primary key
    username varchar UNIQUE,
    password varchar
);

DROP TABLE IF EXISTS public.sw_planet_votes;
DROP SEQUENCE IF EXISTS public.sw_planet_votes_id_seq;
CREATE TABLE sw_planet_votes (
    id serial NOT NULL, -- primary key
    planet_id int, -- id from SWAPI data
    planet_name varchar,
    user_id int, -- foreign key
    submission_time timestamp without time zone
);


ALTER TABLE ONLY sw_users
    ADD CONSTRAINT pk_sw_user_id PRIMARY KEY (id);

ALTER TABLE ONLY sw_planet_votes
    ADD CONSTRAINT pk_sw_planet_votes_id PRIMARY KEY (id);

ALTER TABLE ONLY sw_planet_votes
    ADD CONSTRAINT fk_sw_user_id FOREIGN KEY (user_id) REFERENCES sw_users(id)
    ON DELETE CASCADE;

INSERT INTO sw_users VALUES (1, 'Freddie Mercury', 'pbkdf2:sha256:50000$kGrd5vhy$38a8fa35e4a89d47668ab2a9df01a5f00783657c72e1d66965354f9129e47e39');
INSERT INTO sw_users VALUES (2, 'Lord Vader', 'pbkdf2:sha256:50000$QZXHwTmr$676ad3bad9eca034fa0378802436535f825f642796ce4ecdf2d83b1eabcf0f54');
SELECT pg_catalog.setval('sw_users_id_seq', 2, true);