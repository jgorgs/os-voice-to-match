
import { supabase } from "@/integrations/supabase/client";

export const uploadAudioFile = async (audioBlob: Blob): Promise<string | null> => {
  try {
    // Generate a unique filename with appropriate extension
    const timestamp = Date.now();
    const isMP4 = audioBlob.type.includes('mp4');
    const extension = isMP4 ? 'mp4' : 'webm';
    const filename = `audio_${timestamp}.${extension}`;
    
    console.log('Uploading audio file:', filename, 'Size:', audioBlob.size, 'Type:', audioBlob.type);
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(filename, audioBlob, {
        contentType: audioBlob.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading audio:', error);
      return null;
    }

    console.log('Audio upload successful:', data);
    return data.path;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    return null;
  }
};
