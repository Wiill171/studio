"use client";

import { useState, useRef, useEffect } from "react";
import { identifyBirdFromSong, IdentifyBirdFromSongOutput } from "@/ai/flows/identify-bird-from-song";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/identification/result-card";
import { Loader2, Music4, Mic, X, Waves, Pause } from "lucide-react";
import placeHolderImages from "@/lib/placeholder-images.json";
import { useTranslation } from "@/hooks/use-translation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export function SongIdentifier() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyBirdFromSongOutput | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { user } = useFirestore();
  const firestore = useFirestore();

  useEffect(() => {
    return () => {
      // Cleanup function to stop any active streams
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const saveIdentification = async (identificationResult: IdentifyBirdFromSongOutput, audioUrl: string) => {
    if (!user || !firestore) return;
    const randomImageUrl = placeHolderImages.placeholderImages.find(p => p.id === "bird-song-generic")?.imageUrl || "https://picsum.photos/seed/birdsong/600/400";
    
    const historyCollection = collection(firestore, `users/${user.uid}/identifications`);
    const identificationData = {
        species: identificationResult.species,
        date: new Date().toISOString(),
        imageUrl: randomImageUrl,
        method: "song",
        confidence: identificationResult.confidence,
        alternativeSpecies: identificationResult.alternativeSpecies,
    };
    await addDocumentNonBlocking(historyCollection, identificationData);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      setIsRecording(true);
      setResult(null);
      setAudioPreview(null);
      setAudioFile(null);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioPreview(audioUrl);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          handleSubmit(base64String); // Pass base64 string to submit
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach(track => track.stop()); // Stop stream after recording
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setHasMicPermission(false);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please enable microphone permissions in your browser settings.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAudioPreview(URL.createObjectURL(file)); // For preview
        handleSubmit(base64); // For submission
      };
      reader.readAsDataURL(file);
      setResult(null); // Reset result
    }
  };
  
  const handleSubmit = async (audioDataUri?: string) => {
    if (!audioPreview && !audioDataUri) {
      toast({
        title: t("noAudioFileSelectedToastTitle"),
        description: t("noAudioFileSelectedToastDescription"),
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
    setResult(null);
  
    try {
      // Ensure we have a data URI
      let dataUriToSubmit = audioDataUri;
      if (!dataUriToSubmit && audioFile) {
        dataUriToSubmit = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(audioFile);
        });
      }
      
      if (!dataUriToSubmit) throw new Error("Could not process audio file.");

      const result = await identifyBirdFromSong({ audioDataUri: dataUriToSubmit });
      setResult(result);
      await saveIdentification(result, dataUriToSubmit);
    } catch (error) {
      console.error("Error identifying bird from song:", error);
      toast({
        title: t("identificationFailedToastTitle"),
        description: t("identificationFailedSongToastDescription"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    setAudioFile(null);
    setAudioPreview(null);
    setResult(null);
  }

  const randomImageUrl = placeHolderImages.placeholderImages[0]?.imageUrl || "https://picsum.photos/seed/birdsong/600/400";


  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
             <div className="grid w-full items-center gap-1.5">
                <label htmlFor="audio" className="font-medium">
                  {t("uploadAudioFile")}
                </label>
                <div className="flex gap-2">
                    <Input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="file:text-primary flex-1"
                        disabled={isRecording}
                    />
                    <Button onClick={isRecording ? stopRecording : startRecording} variant="outline" size="icon">
                        {isRecording ? <Pause /> : <Mic />}
                        <span className="sr-only">{isRecording ? "Stop Recording" : "Start Recording"}</span>
                    </Button>
                </div>
            </div>

            {isRecording && (
                 <div className="flex flex-col items-center justify-center space-y-2 rounded-md border p-4 bg-primary/5 animate-pulse">
                    <Waves className="h-10 w-10 text-primary"/>
                    <p className="text-sm font-medium text-primary">Recording...</p>
                 </div>
            )}
            
            {hasMicPermission === false && (
                <Alert variant="destructive">
                    <AlertTitle>Microphone Access Denied</AlertTitle>
                    <AlertDescription>Please allow microphone access to use this feature.</AlertDescription>
                </Alert>
            )}

            {audioPreview && !isRecording && (
              <div className="relative flex flex-col items-center justify-center space-y-2 rounded-md border p-4">
                <Music4 className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{audioFile?.name || "Recorded Audio"}</p>
                <audio controls src={audioPreview} className="w-full" />
                <Button onClick={clearPreview} variant="ghost" size="icon" className="absolute top-2 right-2">
                    <X className="h-4 w-4"/>
                </Button>
              </div>
            )}

            <Button onClick={() => handleSubmit()} disabled={isLoading || (!audioPreview && !isRecording) || isRecording} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("analyzing")}...
                </>
              ) : (
                <>
                  <Music4 className="mr-2 h-4 w-4" />
                  {t("identifySong")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {result && (
        <ResultCard
          title={result.species}
          description={`${t("identifiedFromSongText")} ${(result.confidence * 100).toFixed(0)}%.`}
          imageUrl={randomImageUrl}
          confidence={result.confidence}
          shareText={`${t("shareTextMessageSong")} ${result.species} ${t("shareTextMessageSuffix")}!`}
          alternativeSpecies={result.alternativeSpecies}
        />
      )}
    </div>
  );
}
