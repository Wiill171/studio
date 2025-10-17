import { PhotoIdentifier } from "@/components/identification/photo-identifier";

export default function IdentifyPhotoPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Identify Bird by Photo
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Upload a clear photo of a bird, and our AI will do its best to
          identify the species. For best results, ensure the bird is the main
          subject of the image.
        </p>
      </div>
      <div className="mt-12">
        <PhotoIdentifier />
      </div>
    </div>
  );
}
