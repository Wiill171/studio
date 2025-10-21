"use client";

import { BirdRegistrationForm } from "@/components/admin/bird-registration-form";

export default function RegisterBirdPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Cadastrar Novo Pássaro
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Adicione um novo pássaro ao banco de dados. Forneça seus detalhes, incluindo foto, canto e vídeo, se disponíveis.
        </p>
      </div>
      <div className="mt-12">
        <BirdRegistrationForm />
      </div>
    </div>
  );
}