import Link from "next/link";
import { Camera, Mic, Search, Feather } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
                Avis Explorer
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Your ultimate guide to the avian world. Identify birds by their
                look, sound, or features.
              </p>
            </div>
            <Feather className="h-16 w-16 text-accent" />
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl py-12 md:py-24 lg:py-32">
        <div className="container grid gap-8 px-4 md:px-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-accent/20 rounded-full mb-4">
                <Camera className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl">
                Identify by Photo
              </CardTitle>
              <CardDescription>
                Have a picture of a bird? Let our AI analyze it and tell you
                what it is.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/identify/photo">Start Identifying</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-accent/20 rounded-full mb-4">
                <Mic className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl">
                Identify by Song
              </CardTitle>
              <CardDescription>
                Heard a beautiful bird song? Record it, and we'll identify the
                singer for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/identify/song">Start Listening</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <CardHeader className="items-center text-center">
              <div className="p-4 bg-accent/20 rounded-full mb-4">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl">
                Identify Manually
              </CardTitle>
              <CardDescription>
                Know some details like color or size? Use our wizard to find
                the bird.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button asChild>
                <Link href="/identify/manual">Start Describing</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
