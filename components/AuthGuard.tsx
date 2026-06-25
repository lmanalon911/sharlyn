"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isAuth = document.cookie.includes("tdbm_auth=true");
    if (!isAuth) {
      router.replace("/");
    }
  }, [router]);

  return <>{children}</>;
}
