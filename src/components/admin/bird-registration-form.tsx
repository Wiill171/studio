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
import { Loader2, Bird, X, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  globalRange: z.array(z.string()).min(1, { message: "Pelo menos uma região é obrigatória."}),
  imageUrl: z.string().optional().or(z.literal('')),
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue("imageUrl", base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("imageUrl", "");
    setImagePreview(null);
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
        setImagePreview(null);
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

                <FormItem>
                    <FormLabel>Foto</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                                    <Image src={imagePreview} alt="Preview" layout="fill" objectFit="cover" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={removeImage}>
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground mt-1">Carregar</span>
                                    <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>


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
