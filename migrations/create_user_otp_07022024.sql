CREATE TABLE public.user_otp (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.user(id) NOT NULL,
    otp INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);
