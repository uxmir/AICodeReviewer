"use client";

import { signIn, useSession } from '@/lib/auth-client'
import React from 'react'

const Login:React.FC = () => {
 const {data: isPending} = useSession();
 const handleLogin=async()=>{
    await signIn.social({
        provider:"github",
        callbackURL:"/dashboard"
    })
 }  
 if(isPending) return <div>loading.....</div>
  return (
    <div>
      <button onClick={handleLogin}>
        login
      </button>
    </div>
  )
}

export default Login
