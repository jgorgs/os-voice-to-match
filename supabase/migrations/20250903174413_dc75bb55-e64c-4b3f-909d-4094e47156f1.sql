-- Add some mock candidate matches for the existing job specification
INSERT INTO public.candidate_matches (
  job_spec_id,
  candidate_id,
  overall_score,
  skills_score,
  experience_score,
  location_score,
  company_score,
  status,
  found_via_layer,
  search_config_id,
  score_breakdown
) VALUES 
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  1001,
  92,
  95,
  88,
  100,
  85,
  'pending',
  'layer_1',
  gen_random_uuid(),
  '{"skills_match": ["JavaScript", "React", "TypeScript"], "experience_highlights": ["6 years full-stack", "Lead developer experience"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  1002,
  87,
  90,
  85,
  95,
  80,
  'pending',
  'layer_1',
  gen_random_uuid(),
  '{"skills_match": ["Node.js", "PostgreSQL", "React"], "experience_highlights": ["5 years backend", "Database optimization"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  1003,
  78,
  75,
  80,
  85,
  75,
  'pending',
  'layer_2',
  gen_random_uuid(),
  '{"skills_match": ["JavaScript", "Vue.js"], "experience_highlights": ["4 years frontend", "Startup experience"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  1004,
  95,
  98,
  92,
  100,
  90,
  'approved',
  'layer_1',
  gen_random_uuid(),
  '{"skills_match": ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL"], "experience_highlights": ["8 years full-stack", "Technical lead", "Scalable systems"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  1005,
  65,
  60,
  70,
  75,
  60,
  'rejected',
  'layer_2',
  gen_random_uuid(),
  '{"skills_match": ["PHP", "MySQL"], "experience_highlights": ["3 years backend", "Different tech stack"]}'::jsonb
);