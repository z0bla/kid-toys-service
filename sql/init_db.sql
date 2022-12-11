CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name TEXT,
  last_name TEXT
);

INSERT INTO users (first_name, last_name)
VALUES ('Dalibor', 'Blazanovic');

INSERT INTO users (first_name, last_name)
VALUES ('Dejan', 'Blazanovic');

INSERT INTO users (first_name, last_name)
VALUES ('Nemanja', 'Vasic');

INSERT INTO users (first_name, last_name)
VALUES ('Goran', 'Stevanovic');