"use client";

import { useUser } from "@/firebase";
import { useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useMemo } from "react";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";


interface Identification {
  id: string;
  species: string;
  date: string;
  imageUrl: string;
  method: 'photo' | 'song';
}

export default function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useTranslation();

  const historyCollection = useMemo(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/identifications`);
  }, [user, firestore]);

  const { data: history, loading } = useCollection<Identification>(historyCollection);

  if (!user) {
    return <div className="container py-12 text-center">{t("pleaseLogInToViewHistory")}</div>;
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">{t("identificationHistory")}</CardTitle>
            <CardDescription>{t("viewYourPastIdentifications")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div>{t("loadingHistory")}...</div>}
            {!loading && history?.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p>{t("noHistoryFound")}</p>
              </div>
            )}
            {!loading && history && history.length > 0 && (
              <div className="space-y-4">
                {history.map((item) => (
                  <Card key={item.id} className="flex items-center p-4 gap-4">
                     <div className="relative w-24 h-24 rounded-md overflow-hidden">
                        <Image src={item.imageUrl} alt={item.species} fill style={{objectFit: 'cover'}} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.species}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={item.method === 'photo' ? 'default' : 'secondary'}>
                      {t(item.method === 'photo' ? 'photo' : 'song')}
                    </Badge>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
