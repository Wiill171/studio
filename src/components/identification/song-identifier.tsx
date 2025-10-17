"use client";

import { useState, useRef } from "react";
import { identifyBirdFromSong, IdentifyBirdFromSongOutput } from "@/ai/flows/identify-bird-from-song";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/identification/result-card";
import { Loader2, Music4, Upload } from "lucide-react";
import placeHolderImages from "@/lib/placeholder-images.json";

export function SongIdentifier() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyBirdFromSongOutput | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null); // Reset result
    }
  };

  const handleSubmit = async () => {
    if (!audioFile || !audioPreview) {
      toast({
        title: "No audio file selected",
        description: "Please choose an audio file to identify.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const result = await identifyBirdFromSong({ audioDataUri: audioPreview });
      setResult(result);
    } catch (error) {
      console.error("Error identifying bird from song:", error);
      toast({
        title: "Identification Failed",
        description: "An error occurred while trying to identify the bird song. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const randomImageUrl = placeHolderImages.placeholderImages[0]?.imageUrl || "https://picsum.photos/seed/birdsong/600/400";


  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="audio" className="font-medium">
                Upload Audio File
              </label>
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="file:text-primary"
              />
            </div>
            {audioPreview && (
              <div className="flex flex-col items-center justify-center space-y-2 rounded-md border p-4">
                <Music4 className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{audioFile?.name}</p>
                <audio controls src={audioPreview} className="w-full" />
              </div>
            )}
            <Button onClick={handleSubmit} disabled={isLoading || !audioFile} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Identify Song
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {result && (
        <ResultCard
          title={result.species}
          description={`Identified from its song with a confidence of ${(result.confidence * 100).toFixed(0)}%.`}
          imageUrl={randomImageUrl}
          confidence={result.confidence}
          shareText={`I identified a ${result.species} by its song using Avis Explorer!`}
          alternativeSpecies={result.alternativeSpecies}
        />
      )}
    </div>
  );
}
