'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Success() {

    const router = useRouter()
  
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        localStorage.setItem('token', token);
        console.log("Use effect of Success Page")
        router.push('/')
    });


    return (
        <>Redirecting...</>
    )
}