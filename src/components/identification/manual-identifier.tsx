"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Search, PlusSquare, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { identifyBirdFromDescription, IdentifyBirdFromDescriptionOutput } from "@/ai/flows/identify-bird-from-description";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "../ui/progress";

const formSchema = z.object({
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
});


export function ManualIdentifier() {
  const [results, setResults] = useState<IdentifyBirdFromDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setResults(null);
    try {
        const response = await identifyBirdFromDescription({ description: data.description });
        setResults(response);
    } catch (error) {
        console.error("Error identifying bird from description:", error);
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
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t("describeTheBird")}</CardTitle>
          <CardDescription>{t("manualIdentifierDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Pássaro</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: um pássaro pequeno, com peito vermelho e que vive na cidade."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("identifying")}...
                    </>
                    ) : (
                    <>
                        <Search className="mr-2 h-4 w-4" /> {t("search")}
                    </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-4">
            <h3 className="font-headline text-2xl">
                {results.birds.length} {results.birds.length === 1 ? t("matchFound") : t("matchesFound")}
            </h3>
            {results.birds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.birds.map((bird) => (
                <Card key={bird.name}>
                    <CardContent className="p-0">
                    <div className="relative w-full aspect-square">
                        <Image
                        src={bird.imageUrl || "https://picsum.photos/seed/bird/600/600"}
                        alt={bird.name}
                        fill
                        className="rounded-t-lg object-cover"
                        data-ai-hint={bird.imageHint}
                        />
                    </div>
                    <div className="p-4 space-y-2">
                        <h4 className="font-bold">{bird.name}</h4>
                        <p className="text-sm text-muted-foreground">{bird.description}</p>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium">{t("confidence")}</span>
                                <span>{(bird.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={bird.confidence * 100} />
                        </div>
                    </div>
                    </CardContent>
                </Card>
                ))}
            </div>
            ) : (
            <p>{t("noBirdsMatch")}</p>
            )}
        </div>
      )}

       <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/register-bird">
                <PlusSquare className="mr-2" />
                Cadastrar Novo Pássaro
              </Link>
            </Button>
        </div>
    </div>
  );
}
