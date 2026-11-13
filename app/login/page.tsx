// "use client";

// import { signIn, useSession } from '@/lib/auth-client'
// import React from 'react'

// const Login:React.FC = () => {
//  const {data:session, isPending} = useSession();
//  const handleLogin=async()=>{
//     await signIn.social({
//         provider:"github",
//         callbackURL:"/dashboard"
//     })
//  }  
//  if(isPending) return <div>loading.....</div>
//   return (
//     <div>
//       <button onClick={handleLogin}>
//         login
//       </button>
//     </div>
//   )
// }

// export default Login

"use client";

import { signIn, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";
import React from "react";

const Login: React.FC = () => {
  const { isPending } = useSession();

  const handleLogin = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
        </div>

        {/* shadcn button */}
        <Button
          onClick={handleLogin}
          className="w-full py-6 text-md bg-slate-800 hover:bg-slate-600 text-white flex items-center justify-center gap-2 cursor-pointer"
        >
          <GitBranch className="h-5 w-5" />
          <span>Login with GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default Login;