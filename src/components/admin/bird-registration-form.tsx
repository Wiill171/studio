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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  size: z.enum(["small", "medium", "large"]),
  habitat: z.enum(["forest", "wetland", "grassland", "urban"]),
  primaryColor: z.string().min(1, { message: "A cor primária é obrigatória." }),
  globalRange: z.array(z.string()).min(1, { message: "Pelo menos uma região é obrigatória."}),
});

export function BirdRegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      globalRange: [],
    },
  });
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Firestore não está disponível.",
      });
      setIsLoading(false);
      return;
    }

    try {
        let photoDataUri;
        if (photoFile) {
          photoDataUri = await fileToDataUri(photoFile);
        }

        const birdData = {
            ...values,
            colors: [values.primaryColor],
            imageUrl: photoDataUri || "",
            createdAt: new Date().toISOString(),
        };

        const birdsCollection = collection(firestore, "birds");
        await addDoc(birdsCollection, birdData);

        toast({
            title: "Pássaro Cadastrado",
            description: `${values.name} foi adicionado ao banco de dados.`,
        });
        form.reset();
        setPhotoFile(null);
        form.setValue("globalRange", []);
    } catch (error: any) {
      console.error("Firebase error:", error);
      toast({
        variant: "destructive",
        title: "Falha no Cadastro",
        description: error.message,
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tamanho</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Selecione o tamanho" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="small">Pequeno</SelectItem>
                                <SelectItem value="medium">Médio</SelectItem>
                                <SelectItem value="large">Grande</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cor Primária</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Selecione a cor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="brown">Marrom</SelectItem>
                                    <SelectItem value="red">Vermelho</SelectItem>
                                    <SelectItem value="blue">Azul</SelectItem>
                                    <SelectItem value="yellow">Amarelo</SelectItem>
                                    <SelectItem value="black">Preto</SelectItem>
                                    <SelectItem value="white">Branco</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
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
                                <SelectValue placeholder="Selecione o habitat" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="forest">Floresta</SelectItem>
                                <SelectItem value="wetland">Área Úmida</SelectItem>
                                <SelectItem value="grassland">Campo</SelectItem>
                                <SelectItem value="urban">Urbano</SelectItem>
                            </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
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
                        <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                    </FormControl>
                </FormItem>

                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                    </>
                ) : (
                    <>
                    <Upload className="mr-2 h-4 w-4" />
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