
import { supabase } from "@/integrations/supabase/client";

export const uploadAudioFile = async (audioBlob: Blob, originalFileName?: string): Promise<string | null> => {
  try {
    // Generate a unique filename with appropriate extension
    const timestamp = Date.now();
    
    // Determine the file extension based on the blob type
    let extension = 'webm'; // default fallback
    
    if (audioBlob.type.includes('mp4')) {
      extension = 'mp4';
    } else if (audioBlob.type.includes('wav')) {
      extension = 'wav';
    } else if (audioBlob.type.includes('webm')) {
      extension = 'webm';
    } else if (audioBlob.type.includes('mpeg') || audioBlob.type.includes('mp3')) {
      extension = 'mp3';
    } else if (originalFileName) {
      // Extract extension from original filename if available
      const fileExtension = originalFileName.split('.').pop()?.toLowerCase();
      if (fileExtension && ['mp3', 'mp4', 'wav', 'webm', 'm4a', 'aac'].includes(fileExtension)) {
        extension = fileExtension;
      }
    }
    
    const filename = originalFileName ? 
      `${originalFileName.split('.')[0]}_${timestamp}.${extension}` : 
      `audio_${timestamp}.${extension}`;
    
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
