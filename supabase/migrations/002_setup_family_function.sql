-- Atomic family creation for new users.
-- SECURITY DEFINER lets it INSERT into families (no user-facing INSERT policy by design)
-- and update the caller's profile within the same transaction so subsequent RLS checks
-- on categories/recipes/etc. see the committed family_id immediately.
create or replace function setup_family_for_user(p_family_name text, p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family_id uuid;
begin
  -- Idempotent: if the user already has a family, return it
  select family_id into v_family_id from profiles where id = auth.uid();
  if v_family_id is not null then
    return v_family_id;
  end if;

  insert into families (name, invite_code)
  values (p_family_name, p_invite_code)
  returning id into v_family_id;

  update profiles
  set family_id = v_family_id, role = 'admin'
  where id = auth.uid();

  return v_family_id;
end;
$$;
