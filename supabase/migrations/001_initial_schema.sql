-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── FAMILIES ────────────────────────────────────────────────────────────────
create table families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  invite_code text not null unique default substr(md5(random()::text), 1, 8),
  created_at  timestamptz not null default now()
);

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  family_id   uuid references families(id) on delete set null,
  name        text,
  role        text not null default 'contributor'
                check (role in ('admin', 'editor', 'contributor')),
  hue         text not null default '#C8622A',
  created_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── CATEGORIES ──────────────────────────────────────────────────────────────
create table categories (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  name        text not null,
  accent      text not null default '#C8622A',
  sort_order  int not null default 0
);

-- ─── RECIPES ─────────────────────────────────────────────────────────────────
create table recipes (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name        text not null,
  cooktime    int,   -- minutes
  serves      int,
  created_at  timestamptz not null default now()
);

-- ─── RECIPE VERSIONS (FORKS) ─────────────────────────────────────────────────
create table recipe_versions (
  id          uuid primary key default gen_random_uuid(),
  recipe_id   uuid not null references recipes(id) on delete cascade,
  author_id   uuid not null references profiles(id) on delete cascade,
  note        text,
  ingredients jsonb not null default '[]',  -- string[]
  steps       jsonb not null default '[]',  -- string[]
  is_original boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(recipe_id, author_id)
);

-- updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger recipe_versions_updated_at
  before update on recipe_versions
  for each row execute procedure update_updated_at();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table families        enable row level security;
alter table profiles        enable row level security;
alter table categories      enable row level security;
alter table recipes         enable row level security;
alter table recipe_versions enable row level security;

-- Helper: current user's family_id
create or replace function my_family_id()
returns uuid language sql security definer as $$
  select family_id from profiles where id = auth.uid();
$$;

-- Helper: current user's role
create or replace function my_role()
returns text language sql security definer as $$
  select role from profiles where id = auth.uid();
$$;

-- families: members can read their own family
create policy "members read own family" on families
  for select using (id = my_family_id());

-- families: admins can update their own family
create policy "admins update own family" on families
  for update using (id = my_family_id() and my_role() = 'admin');

-- profiles: users read profiles in their family
create policy "family members read profiles" on profiles
  for select using (family_id = my_family_id() or id = auth.uid());

-- profiles: users update own profile
create policy "users update own profile" on profiles
  for update using (id = auth.uid());

-- profiles: admins update any profile in their family
create policy "admins update family profiles" on profiles
  for update using (
    family_id = my_family_id() and my_role() = 'admin'
  );

-- profiles: admins delete family members (except self)
create policy "admins delete family members" on profiles
  for delete using (
    family_id = my_family_id() and my_role() = 'admin' and id != auth.uid()
  );

-- categories: family members read
create policy "family members read categories" on categories
  for select using (family_id = my_family_id());

-- categories: editors+ can manage categories
create policy "editors manage categories" on categories
  for all using (
    family_id = my_family_id() and my_role() in ('admin', 'editor')
  );

-- recipes: family members read
create policy "family members read recipes" on recipes
  for select using (family_id = my_family_id());

-- recipes: editors+ can create/update/delete recipes
create policy "editors manage recipes" on recipes
  for insert with check (
    family_id = my_family_id() and my_role() in ('admin', 'editor')
  );

create policy "editors update recipes" on recipes
  for update using (
    family_id = my_family_id() and my_role() in ('admin', 'editor')
  );

create policy "admins delete recipes" on recipes
  for delete using (
    family_id = my_family_id() and my_role() in ('admin', 'editor')
  );

-- recipe_versions: family members read
create policy "family members read versions" on recipe_versions
  for select using (
    recipe_id in (select id from recipes where family_id = my_family_id())
  );

-- recipe_versions: any member can create their own version
create policy "members create own version" on recipe_versions
  for insert with check (
    author_id = auth.uid() and
    recipe_id in (select id from recipes where family_id = my_family_id())
  );

-- recipe_versions: author or editor+ can update
create policy "author or editor updates version" on recipe_versions
  for update using (
    author_id = auth.uid() or my_role() in ('admin', 'editor')
  );

-- recipe_versions: author or admin can delete
create policy "author or admin deletes version" on recipe_versions
  for delete using (
    author_id = auth.uid() or my_role() in ('admin', 'editor')
  );
