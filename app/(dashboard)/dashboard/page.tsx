"use client";
import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import React from 'react'

const page:React.FC = () => {
  const {data:session} =useSession() 
  const router=useRouter()
  const handleLogout=async()=>{
    await signOut({
        fetchOptions:{
            onSuccess:()=>{
            router.push("/login")
            }
        }
    })
  }
  return (
    <div>
      dashboard
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
      <div>
        <button onClick={handleLogout}>
            logout
        </button>
      </div>
          </div>
  )
}
export default page
