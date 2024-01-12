# SQL Queries Collection

## Document: https://www.dofactory.com/sql
## EXAMPLE: https://sqlbolt.com/

Explore this repository to discover a variety of SQL queries for common tasks. Whether you're a beginner or an experienced SQL user, these examples can help improve your understanding of SQL statements.

## COPY TABLE
```sql
    CREATE TABLE public.user_copy as SELECT * FROM public.user;
    \dt
```

### INSERT
```sql
-- Insert users
INSERT INTO public."user" (username, email, password)
VALUES
    ('user1', 'user1@email.com', 'password1'),
    ('user2', 'user2@email.com', 'password2'),
    ('user3', 'user3@email.com', 'password3');

-- Insert todo_list
INSERT INTO public.todo_list (title, user_id)
VALUES
    ('Work', 1),
    ('Personal', 2),
    ('Shopping', 1);

-- Insert labels
INSERT INTO public.label (name)
VALUES
    ('Important'),
    ('Home'),
    ('Work');

-- Link todo_list and labels
INSERT INTO public.todo_list_label (todo_list_id, label_id)
VALUES
    (1, 1), -- Work list has the label "Important"
    (2, 2), -- Personal list has the label "Home"
    (3, 3), -- Shopping list has the label "Work"
    (3, 1); -- Shopping list has the label "Important"
```

### UPDATE
```sql
-- Update due_date for all todo_list items
UPDATE public.todo_list
SET due_date = '2022-02-28';
```

### DROP ALL TABLE 
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### ALTER
```sql
ALTER TABLE public.todo_list
ADD COLUMN due_date DATE;
```

### Basic SELECT
```sql
SELECT public.user.* FROM public.user;
SELECT * FROM public.todo_list;
SELECT email FROM public.user;
SELECT *, NULL AS password FROM public.user;
```

### INTO Statement
```sql
SELECT * INTO todo_list_copy FROM public.todo_list;
```

### WHERE Clause
```sql
SELECT * FROM public.user WHERE email = 'user1@email.com';
SELECT * FROM public.todo_list WHERE user_id = 1;
SELECT * FROM public.todo_list WHERE created_at > '2024-05-01';
```

### EXPLAIN
```sql
EXPLAIN SELECT * FROM public.todo_list WHERE user_id = 1;
```

### ORDER BY Clause
```sql
SELECT * FROM public.user ORDER BY username ASC; -- Sort small -> big
SELECT * FROM public.todo_list ORDER BY created_at DESC; -- Sort big -> small
SELECT * FROM public.todo_list ORDER BY due_date ASC, title ASC;
```

## JOIN Operations
```sql
SELECT todo_list.*, "user".username FROM public.todo_list INNER JOIN public."user" ON todo_list.user_id = "user".id;
SELECT t.*, u.username FROM public.todo_list AS t LEFT JOIN public.user AS u ON t.user_id = u.id; -- Rename 
SELECT "user".*, todo_list.* FROM public."user" JOIN public.todo_list ON "user".id = todo_list.user_id;

-- Get info with due_date
SELECT todo_list.*, name, due_date FROM public.todo_list
	JOIN public.todo_list_label ON todo_list.id = todo_list_label.todo_list_id
		JOIN public.label ON todo_list_label.label_id = label.id;
```

### LIMIT and OFFSET
```sql
SELECT * FROM public.user ORDER BY username DESC LIMIT 2;
SELECT * FROM public.todo_list ORDER BY title ASC OFFSET 1;  -- Start from row number five
```

### DISTINCT
```sql
SELECT DISTINCT title, user_id FROM public.todo_list;
```

### LOGICAL Operators
```sql
SELECT * FROM public.user WHERE id = 1 AND status = 10;
SELECT * FROM public.user WHERE id = 1 OR status = 10;
SELECT * FROM public.user WHERE NOT status = 20;
```

### CASE Statement
```sql
SELECT *,
       CASE
           WHEN status = 20 THEN 'user'
           WHEN status = 10 THEN 'admin'
           ELSE 'anonymous'
       END AS role
FROM public.user;
```

### BETWEEN OPERATOR
```sql
SELECT * FROM public.user WHERE status BETWEEN 1 AND 10;
```

### LIKE OPERATOR
```sql
SELECT * FROM public.user WHERE username LIKE '%user%'; -- Search anywhere
SELECT * FROM public.user WHERE username LIKE 'user%'; -- Must start with 'user'
SELECT * FROM public.user WHERE username LIKE 'user%'; -- Must end with 'user'
```

### EXISTS OPERATOR
```sql
SELECT *
FROM public.user
WHERE EXISTS (
    SELECT 1 -- 1 is true, 0 is false
    FROM public.user T
    WHERE T.status = 10
);
```

### HAVING
```sql
SELECT user_id, COUNT(*) AS todo_count
    FROM public.todo_list
        GROUP BY user_id
            HAVING COUNT(*) >= 2;
```

### COUNT
```sql
SELECT user_id, COUNT(*) AS todo_count FROM public.todo_list GROUP BY user_id;
```

### MIN and MAX
```sql
SELECT MIN(id) AS smallest_user_id, MAX(id) AS largest_user_id FROM public.user;
SELECT MIN(due_date) AS earliest_due_date, MAX(due_date) AS latest_due_date FROM public.todo_list;
```

### TRANSACTION

```sql
-- Started transaction
BEGIN;

-- Command sql 1
INSERT INTO public.user (username, email, password)
VALUES ('user4', 'user4@email.com', 'password1');

-- Command sql 2
INSERT INTO public.todo_list (title, user_id)
VALUES ('Play', 4);

-- Commit if it succeeded
COMMIT;

-- Rollback if 1 command failed
ROLLBACK;
```

### TRIGGER 
```sql
CREATE OR REPLACE FUNCTION insert_hello_label_after_user_change()
RETURNS TRIGGER AS
$$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.username IS NOT NULL THEN
        INSERT INTO public.label (name) VALUES ('hello create');
    END IF;

    IF TG_OP = 'UPDATE' AND NEW.username <> OLD.username THEN
        INSERT INTO public.label (name) VALUES ('hello update');
    END IF;
    
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_insert_hello_label_after_user_change
AFTER INSERT OR UPDATE
ON public."user"
FOR EACH ROW
EXECUTE FUNCTION insert_hello_label_after_user_change();

SELECT public.user.* FROM public.user;
SELECT public.label.* FROM public.label;

INSERT INTO public."user" (username, email, password)
VALUES
    ('user5', 'user5@email.com', 'password5')
	
UPDATE public.user SET username = 'user442'  where id=4;
```

### FUNCTION
```sql
CREATE OR REPLACE FUNCTION view_label_data()
RETURNS TABLE ( label_name VARCHAR(255)) AS
$$
BEGIN
    RETURN QUERY
    SELECT name
    FROM public.label;
END;
$$
LANGUAGE plpgsql;

SELECT * FROM view_label_data();
```

### PRODUCER
```sql
CREATE OR REPLACE PROCEDURE insert_or_update_user(
    p_username VARCHAR,
    p_email VARCHAR,
    p_password VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check username exits 
    IF EXISTS (SELECT 1 FROM public."user" WHERE username = p_username) THEN
        -- If exit executed UPDATE
        UPDATE public."user"
        SET email = p_email, password = p_password
        WHERE username = p_username;
    ELSE
        -- If not exit executed INSERT
        INSERT INTO public."user" (username, email, password)
        VALUES (p_username, p_email, p_password);
    END IF;
END;
$$;
CALL insert_or_update_user('taidev', 'taidev@email.com', 'password6');
```

# SECURITY 

## 1. CHECK ROLE USER 
```sql
    SELECT * FROM pg_user;

    SELECT current_user;

    SELECT COUNT(*) FROM pg_user;

    SELECT * FROM information_schema.table_privileges WHERE grantee = 'taidev';
```

## 2. CREATE USER AND FORGET PASSWORD
```sql
    CREATE USER tai_demo WITH ENCRYPTED PASSWORD '123456';

    ALTER USER taidev WITH PASSWORD 'taidev';
```

## 3. GRANT ACCESS SCHEMA PUBLIC
```sql
  GRANT USAGE ON SCHEMA public TO tai_demo; 

  GRANT SELECT ON ALL TABLES IN SCHEMA public TO tai_demo;

  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tai_demo;

  GRANT SELECT ON TABLE public.user TO tai_demo;
```

## 4. GRANT ACCESS PRIVILEGES TABLE SCHEMA PUBLIC
```sql
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO tai_demo;

    GRANT SELECT,CREATE  ON ALL TABLES IN SCHEMA public TO tai_demo;

    GRANT CREATE,UPDATE  ON ALL TABLES IN SCHEMA public TO tai_demo;

    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tai_demo;
```

## 5. REVOKE
```sql
    REVOKE CREATE ON TABLE public.user FROM tai_demo; 

    REVOKE CREATE ON ALL TABLES IN SCHEMA public FROM tai_demo; 
```

## 6. DROP USER AND REVOKE 
```sql
    REVOKE ALL PRIVILEGES ON DATABASE class_fullstack_todolist FROM tai_demo; 

    REVOKE ALL PRIVILEGES ON SCHEMA public FROM tai_demo; 

    REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM tai_demo; 

    DROP USER tai_demo; 
```

## 7. SET PERMISSION
```sql
    ALTER USER tai_demo WITH SUPERUSER, CREATEDB, LOGIN;

    ALTER USER fdhhhdjd WITH NOSUPERUSER;

    SELECT * FROM pg_user where usename='taidev';
```

## 8. DISCONNECT ACCOUNT
```sql
    ALTER USER username WITH NOLOGIN;

    ALTER USER username WITH LOGIN;
```

# BACKUP and RESTORE

# 1. pg_dump, pg_dumpall
```sql
    pg_dump or pg_dumpall -h [host] -U [username] -W [database] > [path file]
```

# 2. RESTORE
```sql;
    cat ./migrations/backup/file.sql | psql "link online" 
```


# INDEX 
 <!-- 1ms = 1000µs. 1 milliseconds = 1000 microseconds -->
```sql
    SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'user';
    SHOW INDEX FROM public."user";

    SELECT * from public.user WHERE status = 40;

    CREATE INDEX idx_email_status on public.user(email, status);
    CREATE INDEX idx_status_email on public.user(status, email);

    DROP INDEX idx_email_status;
    DROP INDEX idx_status_email;

    EXPLAIN analyze SELECT status from public.user WHERE status = 40;

    EXPLAIN analyze SELECT email from public.user WHERE email='user128@example.com';

    EXPLAIN ANALYZE SELECT email FROM public."user" WHERE email = 'user128@example.com' AND status = 40;

    EXPLAIN ANALYZE SELECT email FROM public."user" WHERE status = 40  AND email = 'user128@example.com';

    ---
    CREATE INDEX idx_email on public.user(email);

    DROP INDEX idx_email;

    EXPLAIN analyze SELECT email from public.user WHERE email='user128@example.com';

    EXPLAIN analyze SELECT * from public.user WHERE email='user128@example.com';
    EXPLAIN analyze SELECT email, status from public.user WHERE email='user128@example.com';
```

## 6. REVOKE DROP TRUNCATE DELETE
```sql
    CREATE USER demo WITH ENCRYPTED PASSWORD '123456';
    SHOW GRANTS FOR demo;

    SELECT privilege_type FROM information_schema.table_privileges WHERE table_name = 'todo_list_copy' AND grantee = 'demo';

    REVOKE DELETE  ON ALL TABLES IN SCHEMA public FROM demo;  -- Revoke TRUNCATE and Delete

    REVOKE DROP ON ALL TABLES IN SCHEMA public FROM demo;
```

# DELETE
```sql
    CREATE TABLE public.todo_list_copy as SELECT * FROM public.todo_list;

    INSERT INTO public.todo_list_copy SELECT * FROM public.todo_list;

    SELECT * FROM public.todo_list_copy;

    DROP TABLE public.todo_list_copy;

    DELETE from public.todo_list_copy;

    DELETE from public.todo_list_copy where user_id=1;

    TRUNCATE public.todo_list_copy;

    BEGIN;
        DELETE from public.todo_list_copy
    ROLLBACK;

```

