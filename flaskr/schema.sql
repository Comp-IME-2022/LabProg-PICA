DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  birth_date DATETIME NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE docs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author_name TEXT,
  supervisors TEXT,
  college TEXT,
  type_doc TEXT,
  key_words TEXT,
  abstract TEXT
);
