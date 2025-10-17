"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhotoIdentifier } from "@/components/identification/photo-identifier";
import { SongIdentifier } from "@/components/identification/song-identifier";
import { ManualIdentifier } from "@/components/identification/manual-identifier";
import { Camera, Mic, Search } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function IdentifyPage() {
  const { t } = useTranslation();
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <Tabs defaultValue="photo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photo">
              <Camera className="mr-2" />
              {t("identifyByPhoto")}
            </TabsTrigger>
            <TabsTrigger value="song">
              <Mic className="mr-2" />
              {t("identifyBySong")}
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Search className="mr-2" />
              {t("identifyManually")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="photo">
            <div className="mt-8">
              <PhotoIdentifier />
            </div>
          </TabsContent>
          <TabsContent value="song">
            <div className="mt-8">
              <SongIdentifier />
            </div>
          </TabsContent>
          <TabsContent value="manual">
            <div className="mt-8">
              <ManualIdentifier />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
