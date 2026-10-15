-- =====================================================================
-- ClassPulse National: Foundation SQL (v4)
-- Run in Supabase: left menu > SQL Editor > New query.
-- Run ONE PART AT A TIME (A, then B, then C ...). Click Run after each.
-- If a part shows a red error, STOP and show the error to Claude.
-- This file is the single source of truth for the database. Claude must
-- not invent table or function names that are not in this file or in
-- the "Contract" section of ClassPulse_National_Guidelines.md.
-- =====================================================================


-- =====================================================================
-- PART A: Tools and tables
-- =====================================================================
create extension if not exists pgcrypto with schema extensions;

create table public.code_words (
  id serial primary key,
  word text not null unique
);

create table public.curriculum_templates (
  id serial primary key,
  level_group text not null,
  subject_name text not null,
  is_default boolean not null default true,
  sort_order int not null default 0,
  unique (level_group, subject_name)
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  state text not null,
  lga text not null,
  address text,
  school_types text[] not null check (cardinality(school_types) >= 1),
  head_portal_code text not null unique,
  teacher_entry_code text not null unique,
  student_entry_code text not null unique,
  created_at timestamptz not null default now()
);

create table public.classes_arms (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_level text not null,
  arm text not null default '' check (char_length(arm) <= 10),
  name text generated always as (class_level || arm) stored,
  created_at timestamptz not null default now(),
  unique (school_id, class_level, arm)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 60),
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  personal_code text unique,
  status_code text not null unique,
  code_revealed boolean not null default false,
  flagged boolean not null default false,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table public.class_offerings (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_arm_id uuid not null references public.classes_arms(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (class_arm_id, subject_id)
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_arm_id uuid not null references public.classes_arms(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 80),
  personal_code text unique,
  status_code text not null unique,
  code_revealed boolean not null default false,
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.student_enrollment_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  class_offering_id uuid not null references public.class_offerings(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (student_id, class_offering_id)
);

create table public.feedback_sessions (
  id uuid primary key default gen_random_uuid(),
  class_offering_id uuid not null references public.class_offerings(id) on delete cascade,
  session_date date not null default current_date,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
-- Only ONE open session per offering at any time:
create unique index one_open_session_per_offering
  on public.feedback_sessions (class_offering_id) where is_open;

create table public.feedback_entries (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.feedback_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  colour text not null check (colour in ('green', 'yellow', 'red')),
  -- points are worked out by the database, so nobody can cheat them:
  points int generated always as (case colour when 'green' then 2 when 'yellow' then 1 else 0 end) stored,
  submitted_at timestamptz not null default now(),
  unique (session_id, student_id)   -- one answer per student per lesson, enforced here
);

create table public.app_sessions (
  token text primary key,
  role text not null check (role in ('head', 'teacher', 'student')),
  actor_id uuid not null,
  school_id uuid not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.auth_attempts (
  id bigserial primary key,
  ip text not null,
  kind text not null,
  ok boolean not null,
  attempted_at timestamptz not null default now()
);
create index auth_attempts_lookup on public.auth_attempts (ip, kind, attempted_at);


-- =====================================================================
-- PART B: Lock every table (the browser can never touch tables directly)
-- =====================================================================
alter table public.code_words enable row level security;
alter table public.curriculum_templates enable row level security;
alter table public.schools enable row level security;
alter table public.classes_arms enable row level security;
alter table public.subjects enable row level security;
alter table public.teachers enable row level security;
alter table public.class_offerings enable row level security;
alter table public.students enable row level security;
alter table public.student_enrollment_requests enable row level security;
alter table public.feedback_sessions enable row level security;
alter table public.feedback_entries enable row level security;
alter table public.app_sessions enable row level security;
alter table public.auth_attempts enable row level security;

-- No policies are created on purpose: with RLS on and no policy, the
-- public key can read and write NOTHING. Only the "doors" (functions) below can.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;


-- =====================================================================
-- PART C: Words and curriculum data
-- =====================================================================
insert into public.code_words (word) values
('SUNRISE'),('RIVER'),('EAGLE'),('MAPLE'),('COMET'),('GINGER'),('HARBOR'),('METEOR'),('PEBBLE'),('SPARK'),
('WILLOW'),('ZEBRA'),('MANGO'),('COCONUT'),('PALM'),('BAOBAB'),('LION'),('ELEPHANT'),('GIRAFFE'),('PARROT'),
('FALCON'),('ROBIN'),('HERON'),('CRANE'),('TURTLE'),('DOLPHIN'),('WHALE'),('PANDA'),('KOALA'),('TIGER'),
('CHEETAH'),('ANTELOPE'),('GAZELLE'),('OSTRICH'),('PEACOCK'),('SWAN'),('OTTER'),('BEAVER'),('RABBIT'),('SQUIRREL'),
('ORANGE'),('LEMON'),('BANANA'),('PAPAYA'),('GUAVA'),('PEANUT'),('MILLET'),('COCOA'),('CASSAVA'),('BEAN'),
('HONEY'),('SUGAR'),('MOUNTAIN'),('VALLEY'),('DESERT'),('OCEAN'),('LAKE'),('STREAM'),('WATERFALL'),('RAINBOW'),
('THUNDER'),('BREEZE'),('CLOUD'),('STAR'),('MOON'),('PLANET'),('GALAXY'),('ROCKET'),('SUNSHINE'),('MORNING'),
('EVENING'),('SUMMER'),('HARMATTAN'),('SILVER'),('GOLDEN'),('COPPER'),('AMBER'),('CORAL'),('IVORY'),('SCARLET'),
('VIOLET'),('INDIGO'),('EMERALD'),('LANTERN'),('COMPASS'),('ANCHOR'),('BRIDGE'),('TOWER'),('CASTLE'),('GARDEN'),
('ORCHARD'),('MEADOW'),('FOREST'),('CANOE'),('SAILOR'),('PILOT'),('DRUMMER'),('PAINTER'),('FARMER'),('BAKER'),
('WEAVER'),('SCHOLAR'),('EXPLORER'),('CHAMPION'),('HERO'),('WIZARD'),('KNIGHT'),('BAMBOO'),('CEDAR'),('DAISY'),
('LOTUS'),('ORCHID'),('TULIP'),('JASMINE'),('CLOVER'),('FERN'),('MARBLE'),('CRYSTAL'),('DIAMOND'),('PEARL'),
('BUTTON'),('PUZZLE'),('DOMINO'),('TRUMPET'),('BANJO'),('FLUTE'),('CYMBAL'),('BEACON');

-- Subjects follow the 2025/26 revised national curriculum announced by the Federal
-- Government in September 2025. The School Head can untick or add subjects
-- before saving. Items marked VERIFY must be checked against the official NERDC
-- documents before real schools use them.
insert into public.curriculum_templates (level_group, subject_name, is_default, sort_order) values
('Primary 1-3','English Studies',true,1),
('Primary 1-3','Mathematics',true,2),
('Primary 1-3','Nigerian Language',true,3),
('Primary 1-3','Basic Science',true,4),
('Primary 1-3','Physical and Health Education',true,5),
('Primary 1-3','Nigerian History',true,6),
('Primary 1-3','Social and Citizenship Studies',true,7),
('Primary 1-3','Cultural and Creative Arts',true,8),
('Primary 1-3','Christian Religious Studies',true,9),
('Primary 1-3','Islamic Studies',true,10),

('Primary 4-6','English Studies',true,1),
('Primary 4-6','Mathematics',true,2),
('Primary 4-6','Nigerian Language',true,3),
('Primary 4-6','Basic Science and Technology',true,4),
('Primary 4-6','Physical and Health Education',true,5),
('Primary 4-6','Basic Digital Literacy',true,6),
('Primary 4-6','Nigerian History',true,7),
('Primary 4-6','Social and Citizenship Studies',true,8),
('Primary 4-6','Cultural and Creative Arts',true,9),
('Primary 4-6','Pre-Vocational Studies',true,10),
('Primary 4-6','Christian Religious Studies',true,11),
('Primary 4-6','Islamic Studies',true,12),
('Primary 4-6','French',false,13),

('JSS','English Studies',true,1),
('JSS','Mathematics',true,2),
('JSS','Nigerian Language',true,3),
('JSS','Integrated Science',true,4),          -- VERIFY exact official name
('JSS','Physical and Health Education',true,5),
('JSS','Digital Technologies',true,6),
('JSS','Nigerian History',true,7),
('JSS','Social and Citizenship Studies',true,8),
('JSS','Cultural and Creative Arts',true,9),
('JSS','Business Studies',true,10),
('JSS','Christian Religious Studies',true,11),
('JSS','Islamic Studies',true,12),
('JSS','French',false,13),
('JSS','Arabic',false,14),
('JSS','Solar PV Installation and Maintenance',false,15),   -- trade: the school picks ONE
('JSS','Fashion Design and Garment Making',false,16),      -- trade: the school picks ONE

('SS','English Language',true,1),
('SS','General Mathematics',true,2),
('SS','Citizenship and Heritage Studies',true,3),
('SS','Digital Technologies',true,4),
('SS','Solar PV Installation and Maintenance',false,5),    -- trade: the school picks ONE
('SS','Fashion Design and Garment Making',false,6),        -- trade: the school picks ONE
('SS','Physics',false,7),
('SS','Chemistry',false,8),
('SS','Biology',false,9),
('SS','Economics',false,10),
('SS','Government',false,11),
('SS','Literature in English',false,12),
('SS','Financial Accounting',false,13),
('SS','Commerce',false,14);


-- =====================================================================
-- PART D: Helper functions (private: the browser can NOT call these)
-- =====================================================================
create or replace function public.rand_int(p_max int)
returns int language sql volatile set search_path = public, extensions as $$
  select (('x' || encode(extensions.gen_random_bytes(3), 'hex'))::bit(24)::int) % p_max;
$$;

create or replace function public.make_code(p_words int, p_digits int)
returns text language plpgsql volatile set search_path = public, extensions as $$
declare v_total int; v_code text := ''; v_word text; i int;
begin
  select count(*) into v_total from public.code_words;
  for i in 1..p_words loop
    select word into v_word from public.code_words order by id offset public.rand_int(v_total) limit 1;
    v_code := v_code || v_word || '-';
  end loop;
  return v_code || lpad(public.rand_int((10 ^ p_digits)::int)::text, p_digits, '0');
end $$;

-- kind: 'entry' (EAGLE-42), 'head' (4 words + 4 digits), anything else = personal (3 words + 4 digits)
create or replace function public.unique_code(p_kind text)
returns text language plpgsql volatile set search_path = public, extensions as $$
declare v_code text; v_taken boolean;
begin
  loop
    v_code := case p_kind
      when 'entry' then public.make_code(1, 2)
      when 'head' then public.make_code(4, 4)
      else public.make_code(3, 4) end;
    select exists (select 1 from public.schools
                    where head_portal_code = v_code or teacher_entry_code = v_code or student_entry_code = v_code)
        or exists (select 1 from public.teachers where personal_code = v_code)
        or exists (select 1 from public.students where personal_code = v_code)
      into v_taken;
    exit when not v_taken;
  end loop;
  return v_code;
end $$;

create or replace function public.make_status_code()
returns text language plpgsql volatile set search_path = public, extensions as $$
declare v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; v_out text := ''; v_taken boolean; i int;
begin
  loop
    v_out := '';
    for i in 1..8 loop
      v_out := v_out || substr(v_alphabet, public.rand_int(32) + 1, 1);
    end loop;
    v_out := 'WAIT-' || v_out;
    select exists (select 1 from public.teachers where status_code = v_out)
        or exists (select 1 from public.students where status_code = v_out) into v_taken;
    exit when not v_taken;
  end loop;
  return v_out;
end $$;

create or replace function public.level_group(p_level text)
returns text language sql immutable as $$
  select case
    when p_level in ('Creche','Nursery 1','Nursery 2','Nursery 3') then 'Early Years'
    when p_level in ('Primary 1','Primary 2','Primary 3') then 'Primary 1-3'
    when p_level in ('Primary 4','Primary 5','Primary 6') then 'Primary 4-6'
    when p_level in ('JSS 1','JSS 2','JSS 3') then 'JSS'
    when p_level in ('SS 1','SS 2','SS 3') then 'SS'
    else null end;
$$;

create or replace function public.client_ip()
returns text language plpgsql stable set search_path = public as $$
declare v_headers text := nullif(current_setting('request.headers', true), '');
begin
  if v_headers is null then return 'unknown'; end if;
  return coalesce(nullif(trim(split_part(coalesce(v_headers::jsonb ->> 'x-forwarded-for', ''), ',', 1)), ''), 'unknown');
end $$;

create or replace function public.too_many_failures()
returns boolean language sql stable set search_path = public as $$
  -- 60 failures per 15 minutes per network address. Schools often share one address, so this is generous.
  select count(*) >= 60 from public.auth_attempts
   where ip = public.client_ip() and ok = false and attempted_at > now() - interval '15 minutes';
$$;

create or replace function public.log_attempt(p_kind text, p_ok boolean)
returns void language sql volatile set search_path = public as $$
  insert into public.auth_attempts (ip, kind, ok) values (public.client_ip(), p_kind, p_ok);
$$;

create or replace function public.new_session(p_role text, p_actor uuid, p_school uuid)
returns text language plpgsql volatile set search_path = public, extensions as $$
declare v_token text := encode(extensions.gen_random_bytes(24), 'hex');
begin
  insert into public.app_sessions (token, role, actor_id, school_id, expires_at)
  values (v_token, p_role, p_actor, p_school, now() + interval '30 days');
  return v_token;
end $$;

create or replace function public.require_session(p_token text, p_role text)
returns public.app_sessions language plpgsql stable set search_path = public, extensions as $$
declare v public.app_sessions;
begin
  select * into v from public.app_sessions
   where token = p_token and role = p_role and expires_at > now();
  if not found then raise exception 'Please log in again.'; end if;
  if p_role = 'teacher' and not exists
     (select 1 from public.teachers t where t.id = v.actor_id and t.status = 'approved') then
    raise exception 'Please log in again.';
  end if;
  if p_role = 'student' and not exists
     (select 1 from public.students s where s.id = v.actor_id and s.personal_code is not null) then
    raise exception 'Please log in again.';
  end if;
  return v;
end $$;


-- =====================================================================
-- PART E: Public doors for registration and login
-- (every door is SECURITY DEFINER: it runs with the database owner's rights
--  and checks who is knocking before doing anything)
-- =====================================================================
create or replace function public.get_curriculum_templates()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'level_group', level_group, 'subject_name', subject_name, 'is_default', is_default)
         order by level_group, sort_order), '[]'::jsonb)
  from public.curriculum_templates;
$$;

create or replace function public.register_school(
  p_name text, p_state text, p_lga text, p_address text, p_types text[], p_classes jsonb)
returns jsonb language plpgsql volatile security definer set search_path = public, extensions as $$
declare
  v_school_id uuid; v_head text; v_t text; v_s text;
  v_cls jsonb; v_class_id uuid; v_level text; v_arm text; v_subj text; v_subj_id uuid;
begin
  if (select count(*) from public.auth_attempts
       where ip = public.client_ip() and kind = 'register_school'
         and attempted_at > now() - interval '1 hour') >= 10 then
    raise exception 'Too many schools were registered from this device. Please try again later.';
  end if;
  if p_name is null or char_length(trim(p_name)) < 2 then raise exception 'Please type the school name.'; end if;
  if p_state is null or p_lga is null then raise exception 'Please choose a State and an LGA.'; end if;
  if p_types is null or cardinality(p_types) < 1 then raise exception 'Pick at least one school type.'; end if;
  if not (p_types <@ array['Creche','Nursery','Primary','Secondary']) then raise exception 'Unknown school type.'; end if;
  if p_classes is null or jsonb_typeof(p_classes) <> 'array' or jsonb_array_length(p_classes) = 0 then
    raise exception 'Add at least one class.';
  end if;
  if jsonb_array_length(p_classes) > 80 then raise exception 'That is too many classes at once.'; end if;

  v_head := public.unique_code('head');
  v_t := public.unique_code('entry');
  loop
    v_s := public.unique_code('entry');
    exit when v_s <> v_t;
  end loop;

  insert into public.schools (name, state, lga, address, school_types, head_portal_code, teacher_entry_code, student_entry_code)
  values (trim(p_name), p_state, p_lga, nullif(trim(coalesce(p_address, '')), ''), p_types, v_head, v_t, v_s)
  returning id into v_school_id;

  for v_cls in select value from jsonb_array_elements(p_classes) loop
    v_level := v_cls ->> 'level';
    v_arm := upper(trim(coalesce(v_cls ->> 'arm', '')));
    if public.level_group(v_level) is null then raise exception 'Unknown class level: %', v_level; end if;

    v_class_id := null;
    insert into public.classes_arms (school_id, class_level, arm)
    values (v_school_id, v_level, v_arm)
    on conflict (school_id, class_level, arm) do nothing
    returning id into v_class_id;
    if v_class_id is null then continue; end if;

    for v_subj in select jsonb_array_elements_text(coalesce(v_cls -> 'subjects', '[]'::jsonb)) loop
      v_subj := trim(v_subj);
      if char_length(v_subj) < 2 or char_length(v_subj) > 60 then continue; end if;
      insert into public.subjects (school_id, name) values (v_school_id, v_subj)
      on conflict (school_id, name) do nothing;
      select id into v_subj_id from public.subjects where school_id = v_school_id and name = v_subj;
      insert into public.class_offerings (school_id, class_arm_id, subject_id)
      values (v_school_id, v_class_id, v_subj_id)
      on conflict (class_arm_id, subject_id) do nothing;
    end loop;
  end loop;

  perform public.log_attempt('register_school', true);
  return jsonb_build_object('ok', true, 'school_id', v_school_id,
    'head_portal_code', v_head, 'teacher_entry_code', v_t, 'student_entry_code', v_s);
end $$;

create or replace function public.lookup_entry_code(p_code text, p_kind text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_school public.schools; v_code text := upper(trim(coalesce(p_code, '')));
begin
  if public.too_many_failures() then return jsonb_build_object('ok', false, 'reason', 'throttled'); end if;
  if p_kind = 'teacher' then
    select * into v_school from public.schools where teacher_entry_code = v_code;
  elsif p_kind = 'student' then
    select * into v_school from public.schools where student_entry_code = v_code;
  else
    return jsonb_build_object('ok', false, 'reason', 'bad_kind');
  end if;
  if not found then
    perform public.log_attempt('entry', false);
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  return jsonb_build_object('ok', true, 'school_name', v_school.name);
end $$;

-- Students use this to see the classes and subjects (only subjects that already have a teacher)
create or replace function public.get_registration_options(p_entry_code text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_school public.schools; v_arms jsonb; v_code text := upper(trim(coalesce(p_entry_code, '')));
begin
  if public.too_many_failures() then return jsonb_build_object('ok', false, 'reason', 'throttled'); end if;
  select * into v_school from public.schools where student_entry_code = v_code;
  if not found then
    perform public.log_attempt('entry', false);
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', ca.id, 'name', ca.name,
      'offerings', (select coalesce(jsonb_agg(jsonb_build_object('id', o.id, 'subject', s.name) order by s.name), '[]'::jsonb)
                      from public.class_offerings o join public.subjects s on s.id = o.subject_id
                     where o.class_arm_id = ca.id and o.teacher_id is not null)
    ) order by ca.name), '[]'::jsonb)
    into v_arms from public.classes_arms ca where ca.school_id = v_school.id;
  return jsonb_build_object('ok', true, 'school_name', v_school.name, 'arms', v_arms);
end $$;

create or replace function public.teacher_register(p_entry_code text, p_full_name text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_school public.schools; v_status text; v_name text := trim(coalesce(p_full_name, ''));
begin
  if public.too_many_failures() then return jsonb_build_object('ok', false, 'reason', 'throttled'); end if;
  if char_length(v_name) < 2 or char_length(v_name) > 80 then raise exception 'Please type your full name.'; end if;
  if (select count(*) from public.auth_attempts where ip = public.client_ip() and kind = 'register_person'
        and attempted_at > now() - interval '1 hour') >= 40 then
    raise exception 'Too many registrations from this device. Please try again later.';
  end if;
  select * into v_school from public.schools where teacher_entry_code = upper(trim(coalesce(p_entry_code, '')));
  if not found then
    perform public.log_attempt('entry', false);
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  v_status := public.make_status_code();
  insert into public.teachers (school_id, full_name, status_code) values (v_school.id, v_name, v_status);
  perform public.log_attempt('register_person', true);
  return jsonb_build_object('ok', true, 'status_code', v_status, 'school_name', v_school.name);
end $$;

create or replace function public.student_register(
  p_entry_code text, p_full_name text, p_class_arm_id uuid, p_offering_ids uuid[])
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_school public.schools; v_status text; v_name text := trim(coalesce(p_full_name, ''));
        v_ids uuid[]; v_student_id uuid;
begin
  if public.too_many_failures() then return jsonb_build_object('ok', false, 'reason', 'throttled'); end if;
  if char_length(v_name) < 2 or char_length(v_name) > 80 then raise exception 'Please type your full name.'; end if;
  if (select count(*) from public.auth_attempts where ip = public.client_ip() and kind = 'register_person'
        and attempted_at > now() - interval '1 hour') >= 40 then
    raise exception 'Too many registrations from this device. Please try again later.';
  end if;
  select * into v_school from public.schools where student_entry_code = upper(trim(coalesce(p_entry_code, '')));
  if not found then
    perform public.log_attempt('entry', false);
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;
  if not exists (select 1 from public.classes_arms where id = p_class_arm_id and school_id = v_school.id) then
    raise exception 'Please choose your class again.';
  end if;
  select array(select distinct unnest(coalesce(p_offering_ids, '{}'::uuid[]))) into v_ids;
  if cardinality(v_ids) < 1 or cardinality(v_ids) > 15 then raise exception 'Pick between 1 and 15 subjects.'; end if;
  if (select count(*) from public.class_offerings o
       where o.id = any(v_ids) and o.class_arm_id = p_class_arm_id
         and o.school_id = v_school.id and o.teacher_id is not null) <> cardinality(v_ids) then
    raise exception 'Some subjects are not available. Please go back and try again.';
  end if;
  v_status := public.make_status_code();
  insert into public.students (school_id, class_arm_id, full_name, status_code)
  values (v_school.id, p_class_arm_id, v_name, v_status) returning id into v_student_id;
  insert into public.student_enrollment_requests (student_id, class_offering_id)
  select v_student_id, unnest(v_ids);
  perform public.log_attempt('register_person', true);
  return jsonb_build_object('ok', true, 'status_code', v_status, 'school_name', v_school.name);
end $$;

create or replace function public.check_status(p_kind text, p_status_code text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v_code text := upper(trim(coalesce(p_status_code, ''))); t public.teachers; s public.students; v_subjects jsonb;
begin
  if public.too_many_failures() then return jsonb_build_object('ok', false, 'reason', 'throttled'); end if;
  if p_kind = 'teacher' then
    select * into t from public.teachers where status_code = v_code;
    if not found then
      perform public.log_attempt('status', false);
      return jsonb_build_object('ok', false, 'reason', 'not_found');
    end if;
    return jsonb_build_object('ok', true, 'state', t.status,
      'personal_code', case when t.status = 'approved' and not t.code_revealed then t.personal_code end);
  elsif p_kind = 'student' then
    select * into s from public.students where status_code = v_code;
    if not found then
      perform public.log_attempt('status', false);
      return jsonb_build_object('ok', false, 'reason', 'not_found');
    end if;
    select coalesce(jsonb_agg(jsonb_build_object('subject', sub.name, 'status', r.status) order by sub.name), '[]'::jsonb)
      into v_subjects
      from public.student_enrollment_requests r
      join public.class_offerings o on o.id = r.class_offering_id
      join public.subjects sub on sub.id = o.subject_id
     where r.student_id = s.id;
    return jsonb_build_object('ok', true,
      'state', case when s.personal_code is not null then 'approved'
                    when exists (select 1 from public.student_enrollment_requests r where r.student_id = s.id and r.status = 'pending') then 'pending'
                    else 'rejected' end,
      'personal_code', case when s.personal_code is not null and not s.code_revealed then s.personal_code end,
      'subjects', v_subjects);
  end if;
  return jsonb_build_object('ok', false, 'reason', 'bad_kind');
end $$;

create or replace function public.login_with_code(p_code text)
returns jsonb language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_code text := upper(trim(coalesce(p_code, ''))); h public.schools; t public.teachers; s public.students;
begin
  if public.too_many_failures() then return jsonb_build_object('ok', false, 'reason', 'throttled'); end if;
  delete from public.app_sessions where expires_at < now();

  select * into h from public.schools where head_portal_code = v_code;
  if found then
    return jsonb_build_object('ok', true, 'role', 'head', 'name', h.name, 'school_id', h.id,
                              'token', public.new_session('head', h.id, h.id));
  end if;

  select * into t from public.teachers where personal_code = v_code and status = 'approved';
  if found then
    update public.teachers set code_revealed = true where id = t.id;
    return jsonb_build_object('ok', true, 'role', 'teacher', 'name', t.full_name, 'school_id', t.school_id,
                              'token', public.new_session('teacher', t.id, t.school_id));
  end if;

  select * into s from public.students where personal_code = v_code;
  if found then
    update public.students set code_revealed = true where id = s.id;
    return jsonb_build_object('ok', true, 'role', 'student', 'name', s.full_name, 'school_id', s.school_id,
                              'token', public.new_session('student', s.id, s.school_id));
  end if;

  perform public.log_attempt('login', false);
  return jsonb_build_object('ok', false, 'reason', 'not_found');
end $$;

create or replace function public.logout(p_token text)
returns jsonb language sql volatile security definer set search_path = public as $$
  with gone as (delete from public.app_sessions where token = p_token returning 1)
  select jsonb_build_object('ok', true);
$$;


-- =====================================================================
-- PART F: Doors for School Heads and Teachers
-- =====================================================================
create or replace function public.head_pending_teachers(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'head');
  return (select coalesce(jsonb_agg(jsonb_build_object(
            'id', t.id, 'full_name', t.full_name, 'flagged', t.flagged, 'created_at', t.created_at)
            order by t.created_at), '[]'::jsonb)
            from public.teachers t where t.school_id = v.school_id and t.status = 'pending');
end $$;

create or replace function public.head_review_teacher(p_token text, p_teacher_id uuid, p_action text)
returns jsonb language plpgsql volatile security definer set search_path = public, extensions as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'head');
  if not exists (select 1 from public.teachers where id = p_teacher_id and school_id = v.school_id and status = 'pending') then
    raise exception 'That teacher was not found.';
  end if;
  if p_action = 'approve' then
    update public.teachers
       set status = 'approved', personal_code = public.unique_code('personal'), decided_at = now()
     where id = p_teacher_id;
  elsif p_action = 'reject' then
    update public.teachers set status = 'rejected', decided_at = now() where id = p_teacher_id;
  else
    raise exception 'Unknown action.';
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.head_flag_teacher(p_token text, p_teacher_id uuid, p_flagged boolean)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'head');
  update public.teachers set flagged = p_flagged where id = p_teacher_id and school_id = v.school_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.teacher_unclaimed_offerings(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'teacher');
  return (select coalesce(jsonb_agg(jsonb_build_object(
            'offering_id', o.id, 'class_name', ca.name, 'subject', s.name) order by ca.name, s.name), '[]'::jsonb)
            from public.class_offerings o
            join public.classes_arms ca on ca.id = o.class_arm_id
            join public.subjects s on s.id = o.subject_id
           where o.school_id = v.school_id and o.teacher_id is null);
end $$;

-- ATOMIC claim: the "where teacher_id is null" means two teachers can never both win
create or replace function public.teacher_claim_offerings(p_token text, p_offering_ids uuid[])
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v public.app_sessions; v_n int;
begin
  v := public.require_session(p_token, 'teacher');
  with claimed as (
    update public.class_offerings set teacher_id = v.actor_id
     where id = any(coalesce(p_offering_ids, '{}'::uuid[]))
       and school_id = v.school_id and teacher_id is null
    returning id)
  select count(*) into v_n from claimed;
  return jsonb_build_object('ok', true, 'claimed', v_n, 'requested', coalesce(cardinality(p_offering_ids), 0));
end $$;

create or replace function public.teacher_my_offerings(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'teacher');
  return (select coalesce(jsonb_agg(jsonb_build_object(
            'offering_id', o.id, 'class_name', ca.name, 'subject', s.name,
            'open_session_id', (select fs.id from public.feedback_sessions fs where fs.class_offering_id = o.id and fs.is_open limit 1),
            'pending_students', (select count(*) from public.student_enrollment_requests r where r.class_offering_id = o.id and r.status = 'pending')
          ) order by ca.name, s.name), '[]'::jsonb)
            from public.class_offerings o
            join public.classes_arms ca on ca.id = o.class_arm_id
            join public.subjects s on s.id = o.subject_id
           where o.teacher_id = v.actor_id);
end $$;

create or replace function public.teacher_open_session(p_token text, p_offering_id uuid)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v public.app_sessions; v_id uuid;
begin
  v := public.require_session(p_token, 'teacher');
  if not exists (select 1 from public.class_offerings where id = p_offering_id and teacher_id = v.actor_id) then
    raise exception 'That subject is not yours.';
  end if;
  select id into v_id from public.feedback_sessions where class_offering_id = p_offering_id and is_open;
  if v_id is null then
    insert into public.feedback_sessions (class_offering_id) values (p_offering_id) returning id into v_id;
  end if;
  return jsonb_build_object('ok', true, 'session_id', v_id);
end $$;

create or replace function public.teacher_close_session(p_token text, p_session_id uuid)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'teacher');
  update public.feedback_sessions fs set is_open = false, closed_at = now()
   from public.class_offerings o
  where fs.id = p_session_id and o.id = fs.class_offering_id and o.teacher_id = v.actor_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.teacher_pending_students(p_token text, p_offering_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'teacher');
  return (select coalesce(jsonb_agg(jsonb_build_object(
            'request_id', r.id, 'full_name', st.full_name, 'flagged', st.flagged, 'created_at', r.created_at)
            order by r.created_at), '[]'::jsonb)
            from public.student_enrollment_requests r
            join public.class_offerings o on o.id = r.class_offering_id
            join public.students st on st.id = r.student_id
           where r.class_offering_id = p_offering_id and o.teacher_id = v.actor_id and r.status = 'pending');
end $$;

create or replace function public.teacher_review_enrollment(p_token text, p_request_id uuid, p_action text)
returns jsonb language plpgsql volatile security definer set search_path = public, extensions as $$
declare v public.app_sessions; v_student uuid;
begin
  v := public.require_session(p_token, 'teacher');
  select r.student_id into v_student
    from public.student_enrollment_requests r
    join public.class_offerings o on o.id = r.class_offering_id
   where r.id = p_request_id and o.teacher_id = v.actor_id and r.status = 'pending';
  if not found then raise exception 'That request was not found.'; end if;
  if p_action = 'approve' then
    update public.student_enrollment_requests set status = 'approved', decided_at = now() where id = p_request_id;
    -- The Personal Code is created on the FIRST approved subject only
    update public.students set personal_code = public.unique_code('personal')
     where id = v_student and personal_code is null;
  elsif p_action = 'reject' then
    update public.student_enrollment_requests set status = 'rejected', decided_at = now() where id = p_request_id;
  else
    raise exception 'Unknown action.';
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.teacher_flag_student(p_token text, p_request_id uuid, p_flagged boolean)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'teacher');
  update public.students st set flagged = p_flagged
    from public.student_enrollment_requests r
    join public.class_offerings o on o.id = r.class_offering_id
   where r.id = p_request_id and r.student_id = st.id and o.teacher_id = v.actor_id;
  return jsonb_build_object('ok', true);
end $$;

-- THE PRIVACY DOOR: returns totals only. No student name or id is ever selected next to a colour.
-- Results stay hidden until at least 3 students have answered.
create or replace function public.teacher_results(p_token text, p_session_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v public.app_sessions; v_open boolean; v_total int; v_g int; v_y int; v_r int; v_pts int; v_enrolled int;
begin
  v := public.require_session(p_token, 'teacher');
  select fs.is_open into v_open
    from public.feedback_sessions fs
    join public.class_offerings o on o.id = fs.class_offering_id
   where fs.id = p_session_id and o.teacher_id = v.actor_id;
  if not found then raise exception 'That lesson was not found.'; end if;

  select count(*),
         count(*) filter (where colour = 'green'),
         count(*) filter (where colour = 'yellow'),
         count(*) filter (where colour = 'red'),
         coalesce(sum(points), 0)
    into v_total, v_g, v_y, v_r, v_pts
    from public.feedback_entries where session_id = p_session_id;

  select count(*) into v_enrolled
    from public.student_enrollment_requests r
    join public.feedback_sessions fs on fs.class_offering_id = r.class_offering_id
   where fs.id = p_session_id and r.status = 'approved';

  if v_total < 3 then
    return jsonb_build_object('ok', true, 'hidden', true, 'total', v_total, 'enrolled', v_enrolled, 'is_open', v_open,
      'message', 'Results appear when at least 3 students have answered, so nobody can tell who chose what.');
  end if;
  return jsonb_build_object('ok', true, 'hidden', false, 'total', v_total, 'enrolled', v_enrolled, 'is_open', v_open,
    'green', v_g, 'yellow', v_y, 'red', v_r, 'score', round(v_pts * 100.0 / (v_total * 2)));
end $$;


-- =====================================================================
-- PART G: Doors for Students
-- =====================================================================
create or replace function public.student_my_subjects(p_token text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v public.app_sessions;
begin
  v := public.require_session(p_token, 'student');
  return (select coalesce(jsonb_agg(jsonb_build_object(
            'offering_id', o.id, 'class_name', ca.name, 'subject', s.name, 'status', r.status,
            'open_session_id', (select fs.id from public.feedback_sessions fs
                                 where fs.class_offering_id = o.id and fs.is_open limit 1),
            'already_submitted', exists (select 1 from public.feedback_entries fe
                                          join public.feedback_sessions fs2 on fs2.id = fe.session_id
                                         where fe.student_id = v.actor_id
                                           and fs2.class_offering_id = o.id and fs2.is_open)
          ) order by s.name), '[]'::jsonb)
            from public.student_enrollment_requests r
            join public.class_offerings o on o.id = r.class_offering_id
            join public.classes_arms ca on ca.id = o.class_arm_id
            join public.subjects s on s.id = o.subject_id
           where r.student_id = v.actor_id and r.status <> 'rejected');
end $$;

create or replace function public.student_submit_feedback(p_token text, p_session_id uuid, p_colour text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare v public.app_sessions; v_offering uuid;
begin
  v := public.require_session(p_token, 'student');
  if p_colour not in ('green', 'yellow', 'red') then raise exception 'Please choose a colour.'; end if;
  select fs.class_offering_id into v_offering from public.feedback_sessions fs where fs.id = p_session_id and fs.is_open;
  if not found then raise exception 'This lesson is not open for feedback right now.'; end if;
  if not exists (select 1 from public.student_enrollment_requests r
                  where r.student_id = v.actor_id and r.class_offering_id = v_offering and r.status = 'approved') then
    raise exception 'You are not approved for this subject yet.';
  end if;
  begin
    insert into public.feedback_entries (session_id, student_id, colour) values (p_session_id, v.actor_id, p_colour);
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'reason', 'already_submitted');
  end;
  return jsonb_build_object('ok', true);
end $$;


-- =====================================================================
-- PART H: Open only the right doors to the public key, then refresh
-- =====================================================================
revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function
  public.get_curriculum_templates(),
  public.register_school(text, text, text, text, text[], jsonb),
  public.lookup_entry_code(text, text),
  public.get_registration_options(text),
  public.teacher_register(text, text),
  public.student_register(text, text, uuid, uuid[]),
  public.check_status(text, text),
  public.login_with_code(text),
  public.logout(text),
  public.head_pending_teachers(text),
  public.head_review_teacher(text, uuid, text),
  public.head_flag_teacher(text, uuid, boolean),
  public.teacher_unclaimed_offerings(text),
  public.teacher_claim_offerings(text, uuid[]),
  public.teacher_my_offerings(text),
  public.teacher_open_session(text, uuid),
  public.teacher_close_session(text, uuid),
  public.teacher_pending_students(text, uuid),
  public.teacher_review_enrollment(text, uuid, text),
  public.teacher_flag_student(text, uuid, boolean),
  public.teacher_results(text, uuid),
  public.student_my_subjects(text),
  public.student_submit_feedback(text, uuid, text)
to anon, authenticated;

notify pgrst, 'reload schema';

-- =====================================================================
-- QUICK CHECKS (run these one at a time after Part H)
--   select public.make_code(3, 4);          -- looks like EAGLE-WILLOW-MANGO-8841
--   select count(*) from public.code_words;  -- 128
--   select count(*) from public.curriculum_templates;
-- Then, in the browser console of your page, try to break in:
--   await supabase.from('schools').select('*')   -- must FAIL with "permission denied"
-- =====================================================================
