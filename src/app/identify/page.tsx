"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Mic, Search, Video } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const PhotoIdentifier = dynamic(
  () => import("@/components/identification/photo-identifier").then(mod => mod.PhotoIdentifier),
  { ssr: false, loading: () => <IdentifierSkeleton /> }
);
const VideoIdentifier = dynamic(
  () => import("@/components/identification/video-identifier").then(mod => mod.VideoIdentifier),
  { ssr: false, loading: () => <IdentifierSkeleton /> }
);
const SongIdentifier = dynamic(
  () => import("@/components/identification/song-identifier").then(mod => mod.SongIdentifier),
  { ssr: false, loading: () => <IdentifierSkeleton /> }
);
const ManualIdentifier = dynamic(
  () => import("@/components/identification/manual-identifier").then(mod => mod.ManualIdentifier),
  { ssr: false, loading: () => <IdentifierSkeleton /> }
);

function IdentifierSkeleton() {
  return (
    <div className="mt-12">
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function IdentifyPage() {
  const { t } = useTranslation();
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <Tabs defaultValue="photo" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="photo">
              <Camera className="mr-2" />
              {t("identifyByPhoto")}
            </TabsTrigger>
            <TabsTrigger value="video">
              <Video className="mr-2" />
              {t("identifyByVideo")}
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
            <Suspense fallback={<IdentifierSkeleton />}>
              <div className="mt-8">
                <PhotoIdentifier />
              </div>
            </Suspense>
          </TabsContent>
          <TabsContent value="video">
            <Suspense fallback={<IdentifierSkeleton />}>
              <div className="mt-8">
                <VideoIdentifier />
              </div>
            </Suspense>
          </TabsContent>
          <TabsContent value="song">
            <Suspense fallback={<IdentifierSkeleton />}>
              <div className="mt-8">
                <SongIdentifier />
              </div>
            </Suspense>
          </TabsContent>
          <TabsContent value="manual">
            <Suspense fallback={<IdentifierSkeleton />}>
              <div className="mt-8">
                <ManualIdentifier />
              </div>
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
