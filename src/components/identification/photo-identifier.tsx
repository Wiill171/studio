"use client";

import { useState } from "react";
import { identifyBirdFromPhoto, IdentifyBirdFromPhotoOutput } from "@/ai/flows/identify-bird-from-photo";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/identification/result-card";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";

export function PhotoIdentifier() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyBirdFromPhotoOutput | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null); // Reset result when a new file is chosen
    }
  };

  const handleSubmit = async () => {
    if (!photo || !photoPreview) {
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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="picture" className="font-medium">
                {t("uploadPhoto")}
              </label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file:text-primary"
              />
            </div>
            {photoPreview && (
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <Image
                  src={photoPreview}
                  alt={t("birdPreviewAlt")}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            <Button onClick={handleSubmit} disabled={isLoading || !photo} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("identifying")}...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("identifyBird")}
                </>
              )}
            </Button>
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
