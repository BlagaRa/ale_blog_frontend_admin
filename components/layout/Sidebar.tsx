'use client'
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Sidebar() {
  const [active, setActive] = useState("books");

  const {logout}=useAuthStore();
  const router = useRouter();

  const handleLinkClick = (linkName: string) => {
    setActive(linkName);
  }

  const handleLogout = async () => {
    const success = await logout();
    
    if (success) {
      router.push('/login');
    } else {
      console.error("Logout-ul a eșuat. Te rugăm să încerci din nou.");
    }
  }

  return (
    <nav className='fixed top-0 left-0 h-screen w-50 flex flex-col items-center p-5 bg-bsecond text-black border-r-2 border-accent'>
        <Link
        href='/'
        onClick={()=>{handleLinkClick("")}}
        >
            <Image
                src="/logo4.png"
                alt="logo"
                width={290}
                height={60}
                className="object-contain w-auto h-20 " 
                priority
            />
        </Link>
        
        
        <hr className="w-full border-t-2 border-accent opacity-40 my-4" />
        
        <div className='flex flex-col gap-3 justify-center items-center text-lg '>
            <Link
                href='/books'
                className={`font-sans px-10 hover:rounded-md hover:bg-bfirst active:opacity-70 transition-all duration-200 ease-in-out ${active === 'books' ? "bg-bfirst rounded-md" : ""}`}
                onClick={() => handleLinkClick('books')}
            >
                Books
            </Link>
            
           
            <Link
                href='/contacts'
                className={`font-sans px-10 hover:rounded-md hover:bg-bfirst active:opacity-70 transition-all duration-200 ease-in-out ${active === 'contacts' ? "bg-bfirst rounded-md" : ""}`}
                onClick={() => handleLinkClick('contacts')}
            >
                Contacts
            </Link>
            <button
            className='bg-red-500 w-full rounded-lg border-2 hover:opacity-80 cursor-pointer'
            onClick={handleLogout}
            >
                Logout
            </button>
        </div>
        <div className="mt-auto">
            <hr className="w-full border-t-2 border-accent opacity-40 my-4" />

            <p className="text-sm text-accent font-sans opacity-70">
                Alessia&apos;s blog 2026
            </p>
        </div>
    </nav>
  )
}

export default Sidebar