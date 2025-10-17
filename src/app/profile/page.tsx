"use client";

import { useUser } from "@/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/use-translation";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const { t } = useTranslation();

  if (loading) {
    return <div>{t("loading")}...</div>;
  }

  if (!user) {
    return <div>{t("pleaseLogIn")}</div>;
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              {t("myProfile")}
            </CardTitle>
            <CardDescription>{t("viewYourProfileInfo")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL ?? undefined} />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.displayName}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {/* Add more profile information here as needed */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
