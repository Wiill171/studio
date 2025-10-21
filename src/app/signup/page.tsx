import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="container flex h-full min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Crie uma Conta</CardTitle>
          <CardDescription>
            Junte-se ao Avis Explorer e comece sua jornada de observação de pássaros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}