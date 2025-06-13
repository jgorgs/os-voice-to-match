
-- Create storage policies for the audio_files bucket
CREATE POLICY "Allow public uploads to audio_files" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'audio_files');

CREATE POLICY "Allow public access to audio_files" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'audio_files');

CREATE POLICY "Allow public updates to audio_files" ON storage.objects
  FOR UPDATE 
  USING (bucket_id = 'audio_files');

CREATE POLICY "Allow public deletes from audio_files" ON storage.objects
  FOR DELETE 
  USING (bucket_id = 'audio_files');

-- Add audio_file_path column to chat_history table to store file references
ALTER TABLE public.chat_history 
ADD COLUMN audio_file_path TEXT;
