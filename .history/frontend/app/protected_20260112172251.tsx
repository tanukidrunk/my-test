"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({children}:{children:React.ReactNode}){
    const router = useRouter();
    useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
      router.push("/login");
      return;
    }

        fetch(`${process.env.NEXT_PUBLIC_API}/auth/me`,{
            // credentials:"include",
        }).then(res=>{
            if(!res.ok){
                router.push("/login");
            }
        });
    }, []);
return <>{children}</>;
} 