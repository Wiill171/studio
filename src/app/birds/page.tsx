"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bird, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

interface BirdData {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
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
  const { t } = useTranslation();
  const [birds, setBirds] = useState<BirdData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBirds() {
      try {
        const response = await fetch('/api/birds');
        if (!response.ok) {
          throw new Error('Failed to fetch birds');
        }
        const data = await response.json();
        setBirds(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBirds();
  }, []);

  const handleDelete = async (birdId: string) => {
    try {
        const response = await fetch('/api/birds', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: birdId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete bird');
        }

        setBirds(prevBirds => prevBirds.filter(bird => bird.id !== birdId));

        toast({
            title: "Pássaro Excluído",
            description: "O pássaro foi removido do banco de dados.",
        })

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Falha na Exclusão",
            description: error.message || "Não foi possível excluir o pássaro.",
        });
    }
  }

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

        {error && (
             <Alert variant="destructive">
              <Bird className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!isLoading && !error && birds.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Alert>
              <Bird className="h-4 w-4" />
              <AlertTitle>{t("noBirdsFound")}</AlertTitle>
              <AlertDescription>{t("noBirdsFoundDescription")}</AlertDescription>
            </Alert>
          </div>
        )}
        {!isLoading && !error && birds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {birds.map((bird) => (
              <Card key={bird.id} className="group flex flex-col overflow-hidden transition-transform hover:scale-105 duration-300">
                <div className="relative w-full aspect-square bg-muted">
                  <Image
                    src={bird.imageUrl || "https://picsum.photos/seed/bird/600"}
                    alt={bird.name}
                    fill
                    className="object-cover"
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o pássaro
                            do banco de dados.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(bird.id)}>
                            Excluir
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{bird.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {bird.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
