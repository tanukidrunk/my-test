"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({children}:{children:React.ReactNode}){
    const router = useRouter();
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API}/`,{
            credentials:"include",
        }).then(res=>{
            if(!res.ok){
                router.push("/login");
            }
        });
    }, [];)
return <>{children}</>
} 