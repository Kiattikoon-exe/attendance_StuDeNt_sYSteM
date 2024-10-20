-- Insert 10 prefix-student pairs
WITH inserted_prefix1 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000046') RETURNING id
),
inserted_prefix2 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000047') RETURNING id
),
inserted_prefix3 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000048') RETURNING id
),
inserted_prefix4 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000049') RETURNING id
),
inserted_prefix5 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000050') RETURNING id
),
inserted_prefix6 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000051') RETURNING id
),
inserted_prefix7 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000052') RETURNING id
),
inserted_prefix8 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000053') RETURNING id
),
inserted_prefix9 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000054') RETURNING id
),
inserted_prefix10 AS (
  INSERT INTO prefix (prefix) 
  VALUES ('655021000055') RETURNING id
)

-- Insert the corresponding students
INSERT INTO student (prefix_id, firstname, lastname, date_birth, sex, curriculum_id, telephone, email, status)
VALUES
((SELECT id FROM inserted_prefix1), 'Aric', 'Summers', '2001-01-15', 'M', 1, '0800000001', 'aric.summers@example.com', 'student'),
((SELECT id FROM inserted_prefix2), 'Lina', 'Crowell', '2000-03-23', 'F', 2, '0800000002', 'lina.crowell@example.com', 'student'),
((SELECT id FROM inserted_prefix3), 'Talon', 'Graves', '2001-07-11', 'M', 1, '0800000003', 'talon.graves@example.com', 'student'),
((SELECT id FROM inserted_prefix4), 'Mira', 'Hasting', '2002-05-02', 'F', 2, '0800000004', 'mira.hasting@example.com', 'student'),
((SELECT id FROM inserted_prefix5), 'Kai', 'Fenton', '2000-08-18', 'M', 1, '0800000005', 'kai.fenton@example.com', 'student'),
((SELECT id FROM inserted_prefix6), 'Elara', 'Vaughn', '2001-09-14', 'F', 2, '0800000006', 'elara.vaughn@example.com', 'student'),
((SELECT id FROM inserted_prefix7), 'Orin', 'Ashford', '2000-11-22', 'M', 1, '0800000007', 'orin.ashford@example.com', 'student'),
((SELECT id FROM inserted_prefix8), 'Zara', 'Lennox', '2001-12-19', 'F', 2, '0800000008', 'zara.lennox@example.com', 'student'),
((SELECT id FROM inserted_prefix9), 'Tess', 'Hawke', '2000-06-10', 'F', 1, '0800000009', 'tess.hawke@example.com', 'student'),
((SELECT id FROM inserted_prefix10), 'Jace', 'Rivers', '2002-04-05', 'M', 1, '0800000010', 'jace.rivers@example.com', 'student');
