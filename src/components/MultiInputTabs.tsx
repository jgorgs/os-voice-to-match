import React, { useState, useRef } from 'react';
import { Send, Mic, Upload, Type } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import FilePreview from './FilePreview';
import RecordingPreview from './RecordingPreview';
import InputControls from './InputControls';

interface MultiInputTabsProps {
  onSendMessage: (message: string, audioBlob?: Blob, file?: File) => void;
  disabled?: boolean;
}

const MultiInputTabs: React.FC<MultiInputTabsProps> = ({ onSendMessage, disabled = false }) => {
  const [activeTab, setActiveTab] = useState('voice');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (disabled) return;

    let message = inputText.trim();
    let audioBlob: Blob | undefined = undefined;
    let fileToProcess: File | undefined = undefined;

    if (activeTab === 'voice' && recordedAudio) {
      message = message || 'Voice message';
      audioBlob = recordedAudio;
    } else if (activeTab === 'upload' && uploadedFile) {
      if (uploadedFile.type.startsWith('audio/')) {
        message = message || `Audio file: ${uploadedFile.name}`;
        audioBlob = new Blob([uploadedFile], { type: uploadedFile.type });
      } else {
        message = message || `File uploaded: ${uploadedFile.name}`;
        fileToProcess = uploadedFile;
      }
    } else if (activeTab === 'text' && !message) {
      return; // No text to send
    }

    if (message || audioBlob || fileToProcess) {
      onSendMessage(message, audioBlob, fileToProcess);
      setInputText('');
      setUploadedFile(null);
      setRecordedAudio(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setRecordedAudio(audioBlob);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeRecording = () => {
    setRecordedAudio(null);
  };

  const canSend = () => {
    if (disabled || isRecording) return false;
    
    switch (activeTab) {
      case 'voice':
        return recordedAudio || inputText.trim();
      case 'text':
        return inputText.trim();
      case 'upload':
        return uploadedFile || inputText.trim();
      default:
        return false;
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic size={16} />
            Voice Note
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type size={16} />
            Text Description
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload size={16} />
            Upload Job Spec
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">Record Your Requirements</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explain the role like you would in a kickoff call
            </p>
          </div>

          {recordedAudio && (
            <RecordingPreview audioBlob={recordedAudio} onRemove={removeRecording} />
          )}

          <div className="flex items-center justify-center space-x-4">
            <InputControls
              onRecordingComplete={handleRecordingComplete}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              onUploadClick={() => {}}
              disabled={disabled}
              hideUpload={true}
            />
            {isRecording && (
              <span className="text-sm text-muted-foreground animate-pulse">Recording...</span>
            )}
          </div>

          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add any additional context or specific requirements..."
            className="min-h-[100px] resize-none"
            disabled={disabled || isRecording}
          />
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">Describe the Role</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tell us about the position, requirements, and ideal candidate
            </p>
          </div>

          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Looking for a senior product designer to lead redesigns and collaborate closely with engineering. They should have 5+ years of experience with Figma, strong portfolio in B2B products, and experience with design systems..."
            className="min-h-[200px] resize-none"
            disabled={disabled}
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">Upload Job Specification</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a PDF, Word doc, or text file with the job details
            </p>
          </div>

          {uploadedFile && (
            <FilePreview file={uploadedFile} onRemove={removeFile} />
          )}

          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              onClick={handleUploadClick}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              Choose File
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,audio/*"
            className="hidden"
          />

          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add any additional notes or modifications to the uploaded job spec..."
            className="min-h-[100px] resize-none"
            disabled={disabled}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSend}
          disabled={!canSend()}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          {activeTab === 'voice' && recordedAudio ? 'Process Voice Note' :
           activeTab === 'upload' && uploadedFile ? 'Process File' :
           'Generate Search Plan'}
        </Button>
      </div>
    </div>
  );
};

export default MultiInputTabs;