"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Feather, User, LogIn, MapPin, Loader2, Bird, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { useTranslation } from "@/hooks/use-translation";

function GeolocationInfo() {
  const [location, setLocation] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (navigator.geolocation) {
      setLocation(t("detectingLocation"));
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation(t("locationDetected"));
        },
        () => {
          setLocation(t("locationAccessDenied"));
        }
      );
    }
  }, [t]);

  if (location === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {location === t("detectingLocation") ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4 text-accent" />
      )}
      <span>{location}</span>
    </div>
  );
}

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg sm:inline-block">
              Avis Explorer
            </span>
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link
            href="/identify"
            className="flex items-center gap-2 transition-colors hover:text-foreground/80 text-foreground/60"
          >
            <Bird className="h-5 w-5" />
            <span>{t("identify")}</span>
          </Link>
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <GeolocationInfo />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Language Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'pt')}>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pt">Português</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>{t("login")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("signUp")}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
