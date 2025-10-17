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
import { Loader2, Upload } from "lucide-react";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  size: z.enum(["small", "medium", "large"]),
  habitat: z.enum(["forest", "wetland", "grassland", "urban"]),
  primaryColor: z.string().min(1, { message: "Primary color is required." }),
});

export function BirdRegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [songFile, setSongFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firestore is not available.",
      });
      setIsLoading(false);
      return;
    }

    try {
        let photoDataUri, songDataUri, videoDataUri;
        if (photoFile) photoDataUri = await fileToDataUri(photoFile);
        if (songFile) songDataUri = await fileToDataUri(songFile);
        if (videoFile) videoDataUri = await fileToDataUri(videoFile);

        const birdData = {
            ...values,
            colors: [values.primaryColor],
            imageUrl: photoDataUri || "",
            songUrl: songDataUri || "",
            videoUrl: videoDataUri || "",
            createdAt: new Date().toISOString(),
        };

        const birdsCollection = collection(firestore, "birds");
        await addDocumentNonBlocking(birdsCollection, birdData);

        toast({
            title: "Bird Registered",
            description: `${values.name} has been added to the database.`,
        });
        form.reset();
        setPhotoFile(null);
        setSongFile(null);
        setVideoFile(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Register a new bird</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Bird Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., American Robin" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the bird's appearance, behavior, etc." {...field} />
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
                            <FormLabel>Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
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
                            <FormLabel>Primary Color</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select color" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="brown">Brown</SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="yellow">Yellow</SelectItem>
                                    <SelectItem value="black">Black</SelectItem>
                                    <SelectItem value="white">White</SelectItem>
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
                                <SelectValue placeholder="Select habitat" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="forest">Forest</SelectItem>
                                <SelectItem value="wetland">Wetland</SelectItem>
                                <SelectItem value="grassland">Grassland</SelectItem>
                                <SelectItem value="urban">Urban</SelectItem>
                            </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                 <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                    </FormControl>
                </FormItem>

                 <FormItem>
                    <FormLabel>Song (Audio)</FormLabel>
                    <FormControl>
                        <Input type="file" accept="audio/*" onChange={(e) => setSongFile(e.target.files?.[0] || null)} />
                    </FormControl>
                </FormItem>

                 <FormItem>
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                        <Input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                    </FormControl>
                </FormItem>

                <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                    </>
                ) : (
                    <>
                    <Upload className="mr-2 h-4 w-4" />
                    Register Bird
                    </>
                )}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
