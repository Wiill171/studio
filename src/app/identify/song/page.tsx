"use client";

import { SongIdentifier } from "@/components/identification/song-identifier";
import { useTranslation } from "@/hooks/use-translation";

export default function IdentifySongPage() {
  const { t } = useTranslation();
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          {t("identifyBirdBySongTitle")}
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          {t("identifyBirdBySongDescription")}
        </p>
      </div>
      <div className="mt-12">
        <SongIdentifier />
      </div>
    </div>
  );
}
