"use client";

import { VideoIdentifier } from "@/components/identification/video-identifier";
import { useTranslation } from "@/hooks/use-translation";

export default function IdentifyVideoPage() {
  const { t } = useTranslation();
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t("identifyBirdByVideoTitle")}
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          {t("identifyBirdByVideoDescription")}
        </p>
      </div>
      <div className="mt-12">
        <VideoIdentifier />
      </div>
    </div>
  );
}
