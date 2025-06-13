
-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to audio_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to audio_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to audio_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from audio_files" ON storage.objects;

-- Create new permissive policies for the audio-files bucket
CREATE POLICY "Allow public uploads to audio-files" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'audio-files');

CREATE POLICY "Allow public access to audio-files" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'audio-files');

CREATE POLICY "Allow public updates to audio-files" ON storage.objects
  FOR UPDATE 
  USING (bucket_id = 'audio-files');

CREATE POLICY "Allow public deletes from audio-files" ON storage.objects
  FOR DELETE 
  USING (bucket_id = 'audio-files');
