# SQL Queries Collection

## Document: https://www.dofactory.com/sql
## EXAMPLE: https://sqlbolt.com/

Explore this repository to discover a variety of SQL queries for common tasks. Whether you're a beginner or an experienced SQL user, these examples can help improve your understanding of SQL statements.

## INSERT
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
## UPDATE
```sql
-- Update due_date for all todo_list items
UPDATE public.todo_list
SET due_date = '2022-02-28';
```
## ALTER
```sql
ALTER TABLE public.todo_list
ADD COLUMN due_date DATE;
```

## Basic SELECT
```sql
SELECT public.user.* FROM public.user;
SELECT * FROM public.todo_list;
SELECT email FROM public.user;
SELECT *, NULL AS password FROM public.user;
```

## INTO Statement
```sql
SELECT * INTO todo_list_copy FROM public.todo_list;
```

## WHERE Clause
```sql
SELECT * FROM public.user WHERE email = 'user1@email.com';
SELECT * FROM public.todo_list WHERE user_id = 1;
SELECT * FROM public.todo_list WHERE created_at > '2024-05-01';
```

## EXPLAIN
```sql
EXPLAIN SELECT * FROM public.todo_list WHERE user_id = 1;
```

## ORDER BY Clause
```sql
SELECT * FROM public.user ORDER BY username ASC; -- Sort big -> small
SELECT * FROM public.todo_list ORDER BY created_at DESC; -- Sort small -> big
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
## LIMIT and OFFSET
```sql
SELECT * FROM public.user ORDER BY username DESC LIMIT 2;
SELECT * FROM public.todo_list ORDER BY title ASC OFFSET 1;  -- Start from row number five
```
## DISTINCT
```sql
SELECT DISTINCT title, user_id FROM public.todo_list;
```
## Logical Operators
```sql
SELECT * FROM public.user WHERE id = 1 AND status = 10;
SELECT * FROM public.user WHERE id = 1 OR status = 10;
SELECT * FROM public.user WHERE NOT status = 20;
```
## CASE Statement
```sql
SELECT *,
       CASE
           WHEN status = 20 THEN 'user'
           WHEN status = 10 THEN 'admin'
           ELSE 'anonymous'
       END AS role
FROM public.user;
```
## BETWEEN OPERATOR
```sql
SELECT * FROM public.user WHERE status BETWEEN 1 AND 10;
```
## LIKE OPERATOR
```sql
SELECT * FROM public.user WHERE username LIKE '%user%'; -- Search anywhere
SELECT * FROM public.user WHERE username LIKE 'user%'; -- Must start with 'user'
SELECT * FROM public.user WHERE username LIKE 'user%'; -- Must end with 'user'
```
## EXISTS OPERATOR
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




