"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { birds, Bird } from "@/lib/birds";
import { Search, PlusSquare } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";


type FormValues = {
  size: string;
  color: string;
  habitat: string;
};

export function ManualIdentifier() {
  const [results, setResults] = useState<Bird[]>([]);
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    defaultValues: {
      size: "all",
      color: "all",
      habitat: "all",
    },
  });

  const onSubmit = (data: FormValues) => {
    let filteredBirds = birds;

    if (data.size !== "all") {
      filteredBirds = filteredBirds.filter((bird) => bird.size === data.size);
    }
    if (data.color !== "all") {
      filteredBirds = filteredBirds.filter((bird) => bird.colors.includes(data.color));
    }
    if (data.habitat !== "all") {
        filteredBirds = filteredBirds.filter((bird) => bird.habitat === data.habitat);
    }

    setResults(filteredBirds);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t("describeTheBird")}</CardTitle>
          <CardDescription>{t("selectBirdFeatures")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("size")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectSize")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">{t("anySize")}</SelectItem>
                        <SelectItem value="small">{t("small")}</SelectItem>
                        <SelectItem value="medium">{t("medium")}</SelectItem>
                        <SelectItem value="large">{t("large")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("primaryColor")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectColor")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">{t("anyColor")}</SelectItem>
                        <SelectItem value="brown">{t("brown")}</SelectItem>
                        <SelectItem value="red">{t("red")}</SelectItem>
                        <SelectItem value="blue">{t("blue")}</SelectItem>
                        <SelectItem value="yellow">{t("yellow")}</SelectItem>
                        <SelectItem value="black">{t("black")}</SelectItem>
                        <SelectItem value="white">{t("white")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="habitat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("habitat")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectHabitat")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">{t("anyHabitat")}</SelectItem>
                        <SelectItem value="forest">{t("forest")}</SelectItem>
                        <SelectItem value="wetland">{t("wetland")}</SelectItem>
                        <SelectItem value="grassland">{t("grassland")}</SelectItem>
                        <SelectItem value="urban">{t("urban")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" /> {t("search")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-headline text-2xl">
          {results.length} {results.length === 1 ? t("matchFound") : t("matchesFound")}
        </h3>
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((bird) => (
              <Card key={bird.id}>
                <CardContent className="p-0">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={bird.imageUrl}
                      alt={bird.name}
                      fill
                      className="rounded-t-lg object-cover"
                      data-ai-hint={bird.imageHint}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold">{bird.name}</h4>
                    <p className="text-sm text-muted-foreground">{bird.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>{t("noBirdsMatch")}</p>
        )}
      </div>
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
