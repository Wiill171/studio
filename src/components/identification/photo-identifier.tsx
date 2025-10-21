"use client";

import { useState, useRef, useEffect } from "react";
import { identifyBirdFromPhoto, IdentifyBirdFromPhotoOutput } from "@/ai/flows/identify-bird-from-photo";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/identification/result-card";
import { Loader2, Upload, Camera, Zap, X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";


export function PhotoIdentifier() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyBirdFromPhotoOutput | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { user } = useUser();
  const firestore = useFirestore();


  useEffect(() => {
    if (isCapturing) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: t("locationAccessDenied"),
            description: "Please enable camera permissions in your browser settings.",
          });
          setIsCapturing(false);
        }
      };
      getCameraPermission();
    } else {
        const stream = videoRef.current?.srcObject as MediaStream | null;
        stream?.getTracks().forEach(track => track.stop());
        if(videoRef.current) videoRef.current.srcObject = null;
    }
  }, [isCapturing, toast, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null); 
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUri = canvas.toDataURL("image/jpeg");
            setPhotoPreview(dataUri);
            setIsCapturing(false);
            setResult(null);
            setPhoto(null); // Clear file input if present
        }
    }
  }

  const saveIdentification = async (identificationResult: IdentifyBirdFromPhotoOutput, imageUrl: string) => {
    if (!user || !firestore) return;

    const historyCollection = collection(firestore, `users/${user.uid}/identifications`);
    const identificationData = {
      species: identificationResult.species,
      date: new Date().toISOString(),
      imageUrl: imageUrl,
      method: "photo",
      confidence: identificationResult.confidence,
      description: identificationResult.description,
    };
    await addDocumentNonBlocking(historyCollection, identificationData);
  }

  const handleSubmit = async () => {
    if (!photoPreview) {
      toast({
        title: t("noPhotoSelectedToastTitle"),
        description: t("noPhotoSelectedToastDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const result = await identifyBirdFromPhoto({ photoDataUri: photoPreview });
      setResult(result);
      await saveIdentification(result, photoPreview);
    } catch (error) {
      console.error("Error identifying bird from photo:", error);
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
    setPhoto(null);
    setPhotoPreview(null);
    setResult(null);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {isCapturing ? (
                 <div className="space-y-4">
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border bg-black">
                        <video ref={videoRef} className="w-full h-full object-contain" autoPlay muted playsInline />
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                     {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <AlertTitle>{t("locationAccessDenied")}</AlertTitle>
                            <AlertDescription>Please allow camera access to use this feature.</AlertDescription>
                        </Alert>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                            <Camera className="mr-2 h-4 w-4" />
                            {t("identifying")}
                        </Button>
                        <Button onClick={() => setIsCapturing(false)} variant="outline" className="w-full">
                            {t("login")}
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid w-full items-center gap-1.5">
                        <label htmlFor="picture" className="font-medium">
                        {t("uploadPhoto")}
                        </label>
                        <div className="flex gap-2">
                             <Input
                                id="picture"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file:text-primary flex-1"
                            />
                            <Button onClick={() => setIsCapturing(true)} variant="outline" size="icon">
                                <Camera />
                                <span className="sr-only">Use Camera</span>
                            </Button>
                        </div>
                    </div>
                    {photoPreview && (
                        <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                            <Image
                                src={photoPreview}
                                alt={t("birdPreviewAlt")}
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                             <Button onClick={clearPreview} variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white">
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                    <Button onClick={handleSubmit} disabled={isLoading || !photoPreview} className="w-full">
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
      
      {result && (
        <ResultCard
          title={result.species}
          description={result.description}
          imageUrl={photoPreview!}
          confidence={result.confidence}
          shareText={`${t("shareTextMessage")} ${result.species} ${t("shareTextMessageSuffix")}!`}
        />
      )}
    </div>
  );
}
