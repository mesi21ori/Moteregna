'use client'

import { Suspense, useEffect } from "react"; 

import SignIn from "./signin/page";
import { signOut } from "next-auth/react";
import { Loader } from "lucide-react";
import './globals.css';
export default function Dashboard(props: any) {
  

  return (
    <Suspense fallback={<Loader></Loader>}>
        <SignIn/>  
    </Suspense>
  );
}
