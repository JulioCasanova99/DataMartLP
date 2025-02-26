-- Insert Initial Data Role
INSERT INTO
  "Role" ("type")
VALUES
  ('ADMIN');

INSERT INTO
  "Role" ("type")
VALUES
  ('USER');

-- Insert Initial Data TypePeriod
INSERT INTO
  "TypePeriod" ("id", "type")
VALUES
  ('QUI', 'Quimestral');

INSERT INTO
  "TypePeriod" ("id", "type")
VALUES
  ('TRI', 'Trimestral');