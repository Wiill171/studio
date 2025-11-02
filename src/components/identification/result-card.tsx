"use client";

import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Mail, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";


interface ResultCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  confidence?: number;
  shareText: string;
  alternativeSpecies?: string[];
}

export function ResultCard({
  title,
  description,
  imageUrl,
  videoUrl,
  confidence,
  shareText,
  alternativeSpecies,
}: ResultCardProps) {
  const { t } = useTranslation();

  const handleShare = (platform: "email" | "whatsapp") => {
    const encodedText = encodeURIComponent(shareText);
    if (platform === "email") {
      window.open(`mailto:?subject=${t("shareEmailSubject")}&body=${encodedText}`);
    } else if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodedText}`);
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg animate-in fade-in-50 zoom-in-95 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">{title}</CardTitle>
        <CardDescription>{t("identificationResult")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          {imageUrl && <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} data-ai-hint="bird photo"/>}
          {videoUrl && <video src={videoUrl} controls className="w-full h-full" />}
        </div>
        <p className="text-foreground/90">{description}</p>
        
        {confidence !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t("confidence")}</span>
              <span className="text-sm font-bold text-primary">
                {(confidence * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={confidence * 100} />
          </div>
        )}
        
        {alternativeSpecies && alternativeSpecies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t("alternativeSpecies")}</h4>
            <div className="flex flex-wrap gap-2">
              {alternativeSpecies.map(species => (
                <Badge key={species} variant="secondary">{species}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-primary/5 p-4 flex justify-end gap-2">
        <Button variant="outline" size="icon">
            <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
            <ThumbsDown className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleShare("email")}>
          <Mail className="mr-2 h-4 w-4" /> Email
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleShare("whatsapp")}>
          <Share2 className="mr-2 h-4 w-4" /> WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
