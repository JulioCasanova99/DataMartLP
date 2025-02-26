-- Insert Initial Data Role
INSERT INTO
  [Role] ("type")
VALUES
  ('ADMIN'),
  ('USER'),
  ('DIRECTOR');

-- Insert Initial Data TypePeriod
INSERT INTO
  [TypePeriod] ("id", "type")
VALUES
  ('QUI', 'Quimestral');

INSERT INTO
  [TypePeriod] ("id", "type")
VALUES
  ('TRI', 'Trimestral');

-- Insert User Admin
IF NOT EXISTS (
  SELECT
    1
  FROM
    [User]
  WHERE
    USERNAME = 'admin'
)
BEGIN
  INSERT INTO
    [User] ("username", "password", "roleId")
  VALUES
    (
      'admin',
      '$argon2i$v=19$m=65536,t=3,p=4$ABvtnnZoApQG9pmCYBX9Ig$gQA7gLGY2j4iv/Z3Pn4eZqjul2wqIC+29yowfRAXc6xuUb5aCmTpWFqstHk6LP4V/MvQxEmB7rgvgwcwE8NaAw',
      1
    );
END