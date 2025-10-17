import { ManualIdentifier } from "@/components/identification/manual-identifier";

export default function IdentifyManualPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Manual Bird Identifier
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Can't get a photo or recording? No problem. Describe the bird you saw
          using the options below, and we'll search our database for possible
          matches.
        </p>
      </div>
      <div className="mt-12">
        <ManualIdentifier />
      </div>
    </div>
  );
}
