
import { supabase } from "@/integrations/supabase/client";

export const uploadAudioFile = async (audioBlob: Blob): Promise<string | null> => {
  try {
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `audio_${timestamp}.wav`;
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('audio_files')
      .upload(filename, audioBlob, {
        contentType: 'audio/wav',
        upsert: false
      });

    if (error) {
      console.error('Error uploading audio:', error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    return null;
  }
};
