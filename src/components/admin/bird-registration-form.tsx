"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, Bird, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  globalRange: z.array(z.string()).min(1, { message: "Pelo menos uma região é obrigatória."}),
  imageUrl: z.string().url({ message: "Por favor, insira uma URL de imagem válida."}).optional().or(z.literal('')),
});

export function BirdRegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      globalRange: [],
      imageUrl: ""
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rangeInput, setRangeInput] = useState("");

  const handleRangeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && rangeInput.trim() !== "") {
      e.preventDefault();
      const currentRanges = form.getValues("globalRange") || [];
      const newRanges = [...currentRanges, rangeInput.trim()];
      form.setValue("globalRange", newRanges);
      setRangeInput("");
    }
  };

  const removeRange = (index: number) => {
    const currentRanges = form.getValues("globalRange");
    const newRanges = currentRanges.filter((_, i) => i !== index);
    form.setValue("globalRange", newRanges);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
        const response = await fetch('/api/birds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao cadastrar pássaro');
        }

        toast({
            title: "Pássaro Cadastrado",
            description: `${values.name} foi adicionado ao banco de dados.`,
        });
        form.reset();
        form.setValue("globalRange", []);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Falha no Cadastro",
        description: error.message || "Não foi possível adicionar o pássaro.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Cadastrar um novo pássaro</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nome do Pássaro</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: Sabiá-laranjeira" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Descreva a aparência, comportamento, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                 <FormField
                  control={form.control}
                  name="globalRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área de Abrangência Global</FormLabel>
                      <FormControl>
                        <Input
                            placeholder="Ex: América do Sul, Europa. Pressione Enter para adicionar."
                            value={rangeInput}
                            onChange={(e) => setRangeInput(e.target.value)}
                            onKeyDown={handleRangeKeyDown}
                        />
                      </FormControl>
                       <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((range, index) => (
                          <Badge key={index} variant="secondary">
                            {range}
                            <button type="button" onClick={() => removeRange(index)} className="ml-2">
                              <X className="h-3 w-3"/>
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>URL da Foto</FormLabel>
                      <FormControl>
                          <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />


                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                    </>
                ) : (
                    <>
                    <Bird className="mr-2 h-4 w-4" />
                    Cadastrar Pássaro
                    </>
                )}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
