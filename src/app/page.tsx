"use client";

import Link from "next/link";
import { Camera, Mic, Search, Feather, Bird, Video, PlusSquare, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/firebase";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function FeatureCard({
  icon,
  title,
  href,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group">
      <div className="grid gap-1 text-center h-full p-4 rounded-lg transition-colors hover:bg-accent/10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 mb-4 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-bold font-headline">{title}</h3>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </Link>
  );
}

function HomePageContent() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
                  Avis Explorer
                </h1>
                <p className="max-w-[600px] text-foreground/80 md:text-xl">
                  Seu guia definitivo para o mundo das aves. Identifique pássaros
                  pela aparência, som ou características. Comece sua jornada agora.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row flex-wrap">
                <Button asChild size="lg">
                  <Link href="/identify">
                    <Bird className="mr-2 h-5 w-5" /> Comece a Identificar
                  </Link>
                </Button>
                 <Button asChild size="lg" variant="outline">
                  <Link href="/birds">
                    <BookOpen className="mr-2 h-5 w-5" /> Consultar Pássaros
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/register-bird">
                    <PlusSquare className="mr-2 h-5 w-5" /> Cadastrar Pássaro
                  </Link>
                </Button>
              </div>
            </div>
            <Feather className="mx-auto h-32 w-32 text-accent opacity-20 lg:h-auto lg:w-auto lg:opacity-100" />
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Principais Recursos
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">
                Ferramentas de Identificação Poderosas
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Se você tem uma foto, um vídeo, uma gravação de um canto ou apenas uma
                descrição, nossas ferramentas avançadas de IA podem ajudá-lo a identificar o
                pássaro que você encontrou.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
            <FeatureCard href="/identify/photo" title="ID por Foto" icon={<Camera className="h-8 w-8 text-accent" />}>
              Envie uma foto e deixe nossa IA analisá-la para uma
              identificação instantânea.
            </FeatureCard>
            <FeatureCard href="/identify/video" title="ID por Vídeo" icon={<Video className="h-8 w-8 text-accent" />}>
              Envie um vídeo curto e nossa IA identificará o pássaro.
            </FeatureCard>
            <FeatureCard href="/identify/song" title="ID por Canto" icon={<Mic className="h-8 w-8 text-accent" />}>
              Grave o canto de um pássaro e nós lhe diremos a qual espécie ele
              pertence.
            </FeatureCard>
            <FeatureCard href="/identify/manual" title="ID Manual" icon={<Search className="h-8 w-8 text-accent" />}>
              Use filtros de tamanho, cor e habitat para restringir as
              possibilidades.
            </FeatureCard>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container flex h-full min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <HomePageContent />;
}
