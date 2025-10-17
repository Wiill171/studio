"use client";

import { BirdRegistrationForm } from "@/components/admin/bird-registration-form";

export default function RegisterBirdPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Register New Bird
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Add a new bird to the database. Provide its details, including photo, song, and video if available.
        </p>
      </div>
      <div className="mt-12">
        <BirdRegistrationForm />
      </div>
    </div>
  );
}
