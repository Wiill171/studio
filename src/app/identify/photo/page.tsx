import { PhotoIdentifier } from "@/components/identification/photo-identifier";

export default function IdentifyPhotoPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold text-primary">
          Identificar Pássaro por Foto
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Carregue uma foto nítida de um pássaro e nossa IA fará o possível para
          identificar a espécie. Para obter melhores resultados, certifique-se de que o pássaro seja o
          assunto principal da imagem.
        </p>
      </div>
      <div className="mt-12">
        <PhotoIdentifier />
      </div>
    </div>
  );
}
