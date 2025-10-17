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
import { Search } from "lucide-react";

type FormValues = {
  size: string;
  color: string;
  habitat: string;
};

export function ManualIdentifier() {
  const [results, setResults] = useState<Bird[]>([]);
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
          <CardTitle className="font-headline">Describe the Bird</CardTitle>
          <CardDescription>Select the features of the bird you saw.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Any Size</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
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
                    <FormLabel>Primary Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Any Color</SelectItem>
                        <SelectItem value="brown">Brown</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="white">White</SelectItem>
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
                    <FormLabel>Habitat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select habitat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Any Habitat</SelectItem>
                        <SelectItem value="forest">Forest</SelectItem>
                        <SelectItem value="wetland">Wetland</SelectItem>
                        <SelectItem value="grassland">Grassland</SelectItem>
                        <SelectItem value="urban">Urban</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-headline text-2xl">
          {results.length} {results.length === 1 ? "Match" : "Matches"} Found
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
          <p>No birds match your criteria. Try broadening your search.</p>
        )}
      </div>
    </div>
  );
}
