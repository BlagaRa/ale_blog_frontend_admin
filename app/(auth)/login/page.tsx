'use client'
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function Page() {
  const { login, isLoading, error } = useAuthStore();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = await login(email, password);
    
    if (isSuccess) {
      router.push('/');
    }
  }

  return (
    <div className='flex items-center justify-center h-screen bg-b-first'>
      <form 
      onSubmit={handleSubmit}
      className='bg-bsecond flex flex-col py-10 px-5 gap-1 border-2 rounded-md'>
        <h1 className='font-bold text-2xl text-center mb-5'>Login</h1>
        
        {error && <p className="text-red-500 font-bold text-sm text-center mb-2">{error}</p>}

        <input 
        required
        onChange={(e)=>setEmail(e.target.value)}
        type="email" placeholder="Email" className="p-2 border-2 rounded" />
        
        <input 
        onChange={(e)=>setPassword(e.target.value)}
        required
        type="password" placeholder="Parolă" className="p-2 border-2 rounded" />
        
        <button 
        type='submit'
        disabled={isLoading}
        className='border-2 rounded-md bg-accent font-bold w-30 mx-auto mt-5 hover:opacity-80 cursor-pointer disabled:opacity-50'>
          {isLoading ? 'Is loading...' : "Login"}
        </button>
      </form>
    </div>
  )
}

export default Page