-- Remove the search_configurations table as it's no longer needed
DROP TABLE IF EXISTS public.search_configurations CASCADE;

-- Remove any references to search configurations from other tables if they exist
-- (In this case, we don't have direct foreign key references, so this is just cleanup)