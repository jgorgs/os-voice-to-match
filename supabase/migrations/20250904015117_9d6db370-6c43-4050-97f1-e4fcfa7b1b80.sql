-- Create a search session for the SDR Leader position
INSERT INTO search_sessions (
  id,
  job_spec_id,
  iteration_number,
  total_candidates_found,
  approved_candidates,
  rejected_candidates,
  is_active,
  created_at
) VALUES (
  gen_random_uuid(),
  '5428bd87-7961-4079-b37b-8e3e7187fd44',
  1,
  5,
  1,
  1,
  true,
  now()
);

-- Get the search session ID for use in candidate matches
WITH search_session AS (
  SELECT id as search_config_id 
  FROM search_sessions 
  WHERE job_spec_id = '5428bd87-7961-4079-b37b-8e3e7187fd44' 
  ORDER BY created_at DESC 
  LIMIT 1
)
-- Create 5 diverse candidate matches
INSERT INTO candidate_matches (
  id,
  job_spec_id,
  search_config_id,
  candidate_id,
  overall_score,
  skills_score,
  experience_score,
  location_score,
  company_score,
  status,
  rank_position,
  found_via_layer,
  score_breakdown
) 
SELECT 
  gen_random_uuid(),
  '5428bd87-7961-4079-b37b-8e3e7187fd44',
  search_session.search_config_id,
  NULL,
  candidate_data.overall_score,
  candidate_data.skills_score,
  candidate_data.experience_score,
  candidate_data.location_score,
  candidate_data.company_score,
  candidate_data.status::candidate_status,
  candidate_data.rank_position,
  'external'::search_layer,
  candidate_data.score_breakdown
FROM search_session,
(VALUES
  (
    92,
    94,
    88,
    85,
    95,
    'pending',
    1,
    '{
      "candidate_name": "Sarah Chen",
      "current_title": "SDR Team Lead",
      "current_company": "Salesforce",
      "location": "San Francisco, CA",
      "linkedin_url": "https://linkedin.com/in/sarahchen-sdr",
      "work_email": "sarah.chen@salesforce.com",
      "experience_years": 4,
      "experience_highlights": [
        "Led team of 8 SDRs at Salesforce for 2 years",
        "Consistently exceeded quota by 120-150%",
        "Implemented new prospecting methodologies that increased team performance by 30%"
      ],
      "skills_match": [
        "Team Leadership: Excellent",
        "Sales Development: Expert",
        "CRM Management: Advanced",
        "Outbound Prospecting: Expert",
        "Sales Coaching: Advanced"
      ],
      "key_achievements": [
        "Built and scaled SDR team from 3 to 8 members",
        "Developed training program adopted company-wide",
        "Generated $2M+ in pipeline annually"
      ],
      "education": "BS Marketing, UC Berkeley",
      "why_good_fit": "Strong leadership experience in high-growth SaaS environment with proven track record of team building and performance optimization."
    }'::jsonb
  ),
  (
    95,
    96,
    95,
    90,
    98,
    'approved',
    2,
    '{
      "candidate_name": "Marcus Thompson",
      "current_title": "Sales Development Manager",
      "current_company": "HubSpot",
      "location": "Boston, MA",
      "linkedin_url": "https://linkedin.com/in/marcusthompson-sdm",
      "work_email": "marcus.thompson@hubspot.com",
      "experience_years": 6,
      "experience_highlights": [
        "Manages 15+ SDRs across multiple segments at HubSpot",
        "Built SDR onboarding program with 95% retention rate",
        "Scaled team that generated $5M+ annual pipeline"
      ],
      "skills_match": [
        "Team Leadership: Expert",
        "Sales Development: Expert", 
        "Process Optimization: Expert",
        "Sales Training: Expert",
        "Performance Management: Expert"
      ],
      "key_achievements": [
        "Increased team productivity by 40% through process improvements",
        "Reduced ramp time for new SDRs from 3 months to 6 weeks",
        "Consistently ranked top performing SDR manager globally"
      ],
      "education": "MBA Northwestern Kellogg, BS Business Administration",
      "why_good_fit": "Exceptional track record at leading SaaS company with deep expertise in SDR team scaling and performance optimization. Perfect cultural and experience fit."
    }'::jsonb
  ),
  (
    87,
    90,
    85,
    75,
    92,
    'pending',
    3,
    '{
      "candidate_name": "Jessica Martinez",
      "current_title": "Senior SDR",
      "current_company": "Outreach",
      "location": "Seattle, WA",
      "linkedin_url": "https://linkedin.com/in/jessicamartinez-sdr",
      "work_email": "jessica.martinez@outreach.io",
      "experience_years": 3,
      "experience_highlights": [
        "Top performing SDR at Outreach for 2 consecutive years",
        "Mentors junior SDRs and leads training sessions",
        "Expert in sales engagement platforms and automation"
      ],
      "skills_match": [
        "Sales Development: Expert",
        "Mentoring: Advanced",
        "Sales Technology: Expert",
        "Prospecting: Expert",
        "Team Leadership: Developing"
      ],
      "key_achievements": [
        "Achieved 180% of quota in 2023",
        "Created prospecting playbook used by entire team",
        "Generated $1.2M in qualified pipeline last year"
      ],
      "education": "BA Communications, University of Washington",
      "why_good_fit": "High-performing individual contributor ready for leadership role with strong technical skills and natural mentoring abilities."
    }'::jsonb
  ),
  (
    94,
    98,
    92,
    88,
    96,
    'pending',
    4,
    '{
      "candidate_name": "David Kim",
      "current_title": "SDR Team Lead",
      "current_company": "Gong",
      "location": "New York, NY",
      "linkedin_url": "https://linkedin.com/in/davidkim-sales",
      "work_email": "david.kim@gong.io",
      "experience_years": 5,
      "experience_highlights": [
        "Led SDR team of 12 at Gong with highest conversion rates",
        "Specialized in AI-powered sales intelligence and conversation analytics",
        "Built data-driven prospecting and coaching methodologies"
      ],
      "skills_match": [
        "Team Leadership: Expert",
        "Sales Development: Expert",
        "Data Analysis: Advanced",
        "Sales Intelligence: Expert",
        "Coaching & Development: Expert"
      ],
      "key_achievements": [
        "Improved team conversion rates by 45% using data-driven approaches",
        "Developed AI-assisted prospecting workflows",
        "Team generated $3.2M pipeline with 25% higher close rates"
      ],
      "education": "BS Computer Science, NYU Stern MBA",
      "why_good_fit": "Perfect combination of technical expertise and sales leadership with proven ability to leverage data and AI for SDR team optimization."
    }'::jsonb
  ),
  (
    76,
    70,
    65,
    85,
    80,
    'rejected',
    5,
    '{
      "candidate_name": "Amanda Rodriguez",
      "current_title": "Sales Manager", 
      "current_company": "TechStart Solutions",
      "location": "Austin, TX",
      "linkedin_url": "https://linkedin.com/in/amandarodriguez-sales",
      "work_email": "amanda.rodriguez@techstart.com",
      "experience_years": 2,
      "experience_highlights": [
        "Manages small sales team at 50-person startup",
        "Transitioned from AE to management role 6 months ago",
        "Strong individual contributor background"
      ],
      "skills_match": [
        "Team Leadership: Developing",
        "Sales Development: Good",
        "Account Management: Advanced",
        "Relationship Building: Expert",
        "Startup Experience: Advanced"
      ],
      "key_achievements": [
        "Exceeded personal sales quota by 130% as AE",
        "Successfully transitioned team during leadership change",
        "Built strong customer relationships with 95% retention"
      ],
      "education": "BA Business, University of Texas",
      "why_good_fit": "Ambitious professional with leadership potential but limited SDR-specific experience and team scale management.",
      "concerns": [
        "Limited experience managing large SDR teams",
        "More focused on account management than outbound prospecting",
        "Startup experience may not translate to OutScout scale"
      ]
    }'::jsonb
  )
) AS candidate_data(overall_score, skills_score, experience_score, location_score, company_score, status, rank_position, score_breakdown);