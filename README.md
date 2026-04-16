# Expenser

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Supabase setup

Expenser przechowuje budżet i wydatki w Supabase. Aplikacja jest dostępna wyłącznie po zalogowaniu (email + hasło); rejestracja jest wyłączona i konto trzeba utworzyć ręcznie w panelu.

### 1. Utwórz projekt

Załóż projekt na [supabase.com](https://supabase.com).

### 2. Schema SQL

W panelu **SQL Editor** uruchom:

```sql
create table public.budgets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  name text,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index expenses_user_id_created_at_idx
  on public.expenses (user_id, created_at);

alter table public.budgets  enable row level security;
alter table public.expenses enable row level security;

create policy "budgets_owner_all" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "expenses_owner_all" on public.expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### 3. Auth

- **Authentication → Providers → Email**: włącz email+password i **wyłącz** "Enable signups".
- **Authentication → Users → Add user**: dodaj swoje konto z hasłem.

### 4. Klucze API

W **Project Settings → API Keys** skopiuj `Project URL` oraz **publishable key** (`sb_publishable_...`, zastępuje legacy `anon` key — [docs](https://supabase.com/docs/guides/api/api-keys)) i wklej do:

- `src/environments/environment.ts` (dev)
- `src/environments/environment.prod.ts` (prod — build produkcyjny używa `fileReplacements`)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
