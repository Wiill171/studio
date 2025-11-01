"use client";

import { useCollection, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bird, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Bird {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  size: string;
  habitat: string;
  colors: string[];
}

function BirdCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-0">
                <Skeleton className="w-full aspect-square rounded-t-lg" />
                <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function BirdsPage() {
  const firestore = useFirestore();
  const { t } = useTranslation();

  const birdsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "birds");
  }, [firestore]);

  const { data: birds, isLoading } = useCollection<Bird>(birdsCollection);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold text-primary">
            {t("registeredBirds")}
            </h1>
            <p className="mt-4 text-lg text-foreground/80">
            {t("registeredBirdsDescription")}
            </p>
        </div>

        {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <BirdCardSkeleton key={i} />)}
            </div>
        )}

        {!isLoading && birds?.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Alert>
              <Bird className="h-4 w-4" />
              <AlertTitle>{t("noBirdsFound")}</AlertTitle>
              <AlertDescription>{t("noBirdsFoundDescription")}</AlertDescription>
            </Alert>
          </div>
        )}
        {!isLoading && birds && birds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {birds.map((bird) => (
              <Card key={bird.id} className="flex flex-col overflow-hidden transition-transform hover:scale-105 duration-300">
                <div className="relative w-full aspect-square bg-muted">
                  <Image
                    src={bird.imageUrl || "https://picsum.photos/seed/bird/600"}
                    alt={bird.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{bird.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {bird.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 text-xs">
                     <Badge variant="secondary">{t(bird.size as any)}</Badge>
                     <Badge variant="secondary">{t(bird.habitat as any)}</Badge>
                     {bird.colors?.map(color => <Badge key={color} variant="outline">{t(color as any)}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
