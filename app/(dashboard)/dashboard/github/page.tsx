"use client";
import React from 'react'

const page = () => {
  const handleInstall=()=>{
    window.location.href=process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || ""
  }
  return (
    <div>
      gtihub app install
      <button onClick={handleInstall}>Install github app</button>
    </div>
  )
}

export default page
