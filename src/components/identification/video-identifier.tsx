"use client";

import { useState } from "react";
import { identifyBirdFromVideo, IdentifyBirdFromVideoOutput } from "@/ai/flows/identify-bird-from-video";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/identification/result-card";
import { Loader2, Upload } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function VideoIdentifier() {
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyBirdFromVideoOutput | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null); // Reset result when a new file is chosen
    }
  };

  const handleSubmit = async () => {
    if (!video || !videoPreview) {
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
      const result = await identifyBirdFromVideo({ videoDataUri: videoPreview });
      setResult(result);
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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="video" className="font-medium">
                {t("uploadVideo")}
              </label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="file:text-primary"
              />
            </div>
            {videoPreview && (
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full"
                />
              </div>
            )}
            <Button onClick={handleSubmit} disabled={isLoading || !video} className="w-full">
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
      
      {result && videoPreview && (
        <ResultCard
          title={result.species}
          description={result.description}
          videoUrl={videoPreview}
          confidence={result.confidence}
          shareText={`${t("shareTextMessage")} ${result.species} ${t("shareTextMessageSuffix")}!`}
        />
      )}
    </div>
  );
}
