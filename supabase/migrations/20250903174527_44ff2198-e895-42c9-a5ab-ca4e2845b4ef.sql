-- Add mock candidate matches without foreign key references for now
INSERT INTO public.candidate_matches (
  job_spec_id,
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
  92,
  95,
  88,
  100,
  85,
  'pending',
  'internal',
  gen_random_uuid(),
  '{"candidate_name": "John Smith", "current_title": "Senior Software Engineer", "current_company": "Tech Corp", "skills_match": ["JavaScript", "React", "TypeScript"], "experience_highlights": ["6 years full-stack", "Lead developer experience"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  87,
  90,
  85,
  95,
  80,
  'pending',
  'similar_companies',
  gen_random_uuid(),
  '{"candidate_name": "Sarah Johnson", "current_title": "Full Stack Developer", "current_company": "StartupXYZ", "skills_match": ["Node.js", "PostgreSQL", "React"], "experience_highlights": ["5 years backend", "Database optimization"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  78,
  75,
  80,
  85,
  75,
  'pending',
  'external',
  gen_random_uuid(),
  '{"candidate_name": "Michael Chen", "current_title": "Frontend Developer", "current_company": "Digital Agency", "skills_match": ["JavaScript", "Vue.js"], "experience_highlights": ["4 years frontend", "Startup experience"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  95,
  98,
  92,
  100,
  90,
  'approved',
  'internal',
  gen_random_uuid(),
  '{"candidate_name": "Emily Rodriguez", "current_title": "Technical Lead", "current_company": "Enterprise Co", "skills_match": ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL"], "experience_highlights": ["8 years full-stack", "Technical lead", "Scalable systems"]}'::jsonb
),
(
  '42a98bc2-41cc-48f2-83b8-f207f65add05',
  65,
  60,
  70,
  75,
  60,
  'rejected',
  'external',
  gen_random_uuid(),
  '{"candidate_name": "David Wilson", "current_title": "Backend Developer", "current_company": "Legacy Systems", "skills_match": ["PHP", "MySQL"], "experience_highlights": ["3 years backend", "Different tech stack"]}'::jsonb
);