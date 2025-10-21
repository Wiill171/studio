"use client";

import { useState, useRef, useEffect } from "react";
import { identifyBirdFromVideo, IdentifyBirdFromVideoOutput } from "@/ai/flows/identify-bird-from-video";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/identification/result-card";
import { Loader2, Video, Camera, Zap, X, Pause, PlusSquare } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import Link from "next/link";

export function VideoIdentifier() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyBirdFromVideoOutput | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };
  }, []);

  const saveIdentification = async (identificationResult: IdentifyBirdFromVideoOutput, videoUrl: string) => {
    if (!user || !firestore) return;
    const historyCollection = collection(firestore, `users/${user.uid}/identifications`);
    const identificationData = {
        species: identificationResult.species,
        date: new Date().toISOString(),
        videoUrl: videoUrl,
        method: "video",
        confidence: identificationResult.confidence,
        description: identificationResult.description,
    };
    await addDocumentNonBlocking(historyCollection, identificationData);
  };


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setHasCameraPermission(true);
      setIsRecording(true);
      setResult(null);
      setVideoPreview(null);
      setVideoFile(null);
      
      if(liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      videoChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        videoChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoPreview(videoUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing camera/mic:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Acesso ao Dispositivo Negado",
        description: "Por favor, ative as permissões de câmera e microfone.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
       if(liveVideoRef.current && liveVideoRef.current.srcObject) {
         (liveVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    let dataUriToSubmit: string | null = null;
    
    if (videoPreview) {
        // If preview is a blob URL, fetch and convert to data URI
        if(videoPreview.startsWith('blob:')){
            const response = await fetch(videoPreview);
            const blob = await response.blob();
            dataUriToSubmit = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } else {
             dataUriToSubmit = videoPreview;
        }
    } else if (videoFile) {
        dataUriToSubmit = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(videoFile);
        });
    }


    if (!dataUriToSubmit) {
      toast({
        title: t("noVideoSelectedToastTitle"),
        description: t("noVideoSelectedToastDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const result = await identifyBirdFromVideo({ videoDataUri: dataUriToSubmit });
      setResult(result);
      await saveIdentification(result, videoPreview!);
    } catch (error) {
      console.error("Error identifying bird from video:", error);
      toast({
        title: t("identificationFailedToastTitle"),
        description: t("identificationFailedToastDescription"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearPreview = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {isRecording ? (
                 <div className="space-y-4">
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-black">
                        <video ref={liveVideoRef} className="w-full h-full object-contain" autoPlay muted playsInline />
                    </div>
                     {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>Acesso à Câmera Negado</AlertTitle>
                            <AlertDescription>Por favor, permita o acesso à câmera para usar este recurso.</AlertDescription>
                        </Alert>
                    )}
                    <Button onClick={stopRecording} className="w-full" variant="destructive">
                        <Pause className="mr-2 h-4 w-4" />
                        Parar Gravação
                    </Button>
                </div>
            ) : (
                <>
                    <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="video" className="font-medium">
                        {t("uploadVideo")}
                    </label>
                    <div className="flex gap-2">
                        <Input
                            id="video"
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="file:text-primary flex-1"
                        />
                        <Button onClick={startRecording} variant="outline" size="icon">
                            <Camera />
                            <span className="sr-only">Gravar Vídeo</span>
                        </Button>
                    </div>
                    </div>
                    {videoPreview && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                        <video
                        ref={videoRef}
                        src={videoPreview}
                        controls
                        className="w-full h-full"
                        />
                         <Button onClick={clearPreview} variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white">
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                    )}
                    <Button onClick={handleSubmit} disabled={isLoading || !videoPreview} className="w-full">
                    {isLoading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("identifying")}...
                        </>
                    ) : (
                        <>
                        <Zap className="mr-2 h-4 w-4" />
                        {t("identifyBird")}
                        </>
                    )}
                    </Button>
                </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {result && videoPreview && (
        <ResultCard
          title={result.species}
          description={result.description}
          videoUrl={videoPreview}
          confidence={result.confidence}
          shareText={`${t("shareTextMessage")} ${result.species} ${t("shareTextMessageSuffix")}!`}
        />
      )}
       <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/register-bird">
                <PlusSquare className="mr-2" />
                Cadastrar Novo Pássaro
              </Link>
            </Button>
        </div>
    </div>
  );
}
