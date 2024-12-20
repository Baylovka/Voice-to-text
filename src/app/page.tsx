'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useDropzone } from 'react-dropzone';
import { Upload } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import ResultBlock from "@/components/transcript-result";
import InfoBlocks from "@/components/transcript-info";
import { useRouter } from "next/navigation";
import showMessage from "./utils/showMessage";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const router = useRouter()

  const { userId } = useAuth();

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.ogg'] },
    multiple: false
  });

  const handleUpload = async () => {
    try {
      if (!file) return;

      const userResponse = await axios.post('/api/user/get-user-by-id', { userId });
      if (!userResponse.data) {
        return;
      } else if (userResponse.data.user.freeTries <= 0) {
        showMessage("Упс...", "Закінчились спроби. Оплатіть та користуйтесь", true);
        router.push('/payment');
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const startTime = Date.now();
      const response = await axios.post('/api/voice-to-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFile(null);

      const endTime = Date.now();

      const processingTimeMs = endTime - startTime;
      const processingTimeSec = processingTimeMs / 1000;

      const formattedTime = processingTimeSec < 60
        ? `${processingTimeSec.toFixed(1)} с`
        : `${(processingTimeSec / 60).toFixed(1)} хв`;

      setLanguage(response.data.transcript.language_code);
      setProcessingTime(formattedTime);
      setWordCount(response.data.transcript.words?.length ?? 0);
      setTranscript(response.data.transcript.text);

      const now = new Date();
      const timeForTitle = now.toISOString().replace('T', ' ').slice(0, 19);

      const transcriptData = {
        timeForTitle: timeForTitle,
        language: response.data.transcript.language_code,
        processingTime: formattedTime,
        wordCount: response.data.transcript.words?.length ?? 0,
        transcript: response.data.transcript.text
      }

      await saveTranscriptToDB(transcriptData, userId as string);

      // const url = `/history/${timeForTitle}`;
      // window.location.href = url;
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  const saveTranscriptToDB = async (transcriptData: any, userId: string) => {
    try {
      if (!userId || !transcriptData) {
        throw new Error('UserId and transcriptData are required');
      }

      const data = {
        userId,
        title: transcriptData.timeForTitle,
        language: transcriptData.language || "N/A",
        processingTime: transcriptData.processingTime || 0,
        wordCount: transcriptData.wordCount || 0,
        transcript: transcriptData.transcript || "N/A",
      };

      const response = await axios.post('/api/history/create', data);

      console.log("Create item history status", response.data);

    } catch (error) {
      console.error('Error saving transcript:', error);
      return { error: error };
    }
  };

  interface IUser {
    clerkUserId: string
    freeTries: number
  }

  return (
    <>
      <Card className="p-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Завантажити аудіо</h2>
        </CardHeader>
        <CardContent
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-md text-center cursor-pointer 
          ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <p className="text-gray-700">{file.name}</p>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-500" />
              <p className="mt-2">Перетягніть або натисніть для вибору файлу</p>
            </div>
          )}
        </CardContent>
        <Button
          className="mt-4"
          onClick={() => {
            handleUpload(); showMessage("Почалося перетворення", "Будь ласка чекайте завершення обробки аудіо", false)
          }}
          disabled={!file || loading}
        >
          Перетворити
        </Button>
      </Card>
      <br />


      {transcript && (
        <InfoBlocks language={language} processingTime={processingTime} wordCount={wordCount} />
      )}
      <br />

      {transcript && (
        <ResultBlock transcript={transcript} />
      )}
    </>
  );
}
