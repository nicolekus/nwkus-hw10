# Supabase Setup Instructions

Run the following SQL in your Supabase SQL Editor to create the required table and policies for the Student Stress Survey.

```sql
create table survey_responses (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  year_in_school text not null,
  stress_frequency text not null,
  stress_source text not null,
  coping_methods text[] not null,
  other_coping_text text,
  sleep_hours text not null,
  additional_comments text not null
);

alter table survey_responses enable row level security;

create policy "Allow public insert"
  on survey_responses for insert
  to anon
  with check (true);

create policy "Allow public select"
  on survey_responses for select
  to anon
  using (true);
```
