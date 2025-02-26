-- Create Admin User
INSERT INTO
  "User" ("username", "password", "roleId")
VALUES
  (
    'admin',
    '$argon2i$v=19$m=65536,t=3,p=4$ABvtnnZoApQG9pmCYBX9Ig$gQA7gLGY2j4iv/Z3Pn4eZqjul2wqIC+29yowfRAXc6xuUb5aCmTpWFqstHk6LP4V/MvQxEmB7rgvgwcwE8NaAw',
    1
  ) ON CONFLICT DO NOTHING;