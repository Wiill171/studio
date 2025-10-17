import { SongIdentifier } from "@/components/identification/song-identifier";

export default function IdentifySongPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Identify Bird by Song
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Upload an audio recording of a bird's song. Our AI will analyze the
          sound patterns to identify the species. Clear recordings without
          background noise yield the best results.
        </p>
      </div>
      <div className="mt-12">
        <SongIdentifier />
      </div>
    </div>
  );
}
