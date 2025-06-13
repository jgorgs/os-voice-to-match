
import { supabase } from "@/integrations/supabase/client";

export const uploadAudioFile = async (audioBlob: Blob): Promise<string | null> => {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `audio_${timestamp}.wav`;
    
    console.log('Uploading audio file:', filename, 'Size:', audioBlob.size);
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(filename, audioBlob, {
        contentType: 'audio/wav',
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
