"use client"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { findRepos } from '@/store/slice/repoSlice';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react'

 const page:React.FC = () => {
  return (
  <Suspense>
    <FetchRepo/>
  </Suspense>
  )
}

export default page

const FetchRepo:React.FC=()=>{
 const dispatch=useAppDispatch();
  const {loading,repos}=useAppSelector((state)=>state.repo) 
  const searchParams:any=useSearchParams()
  useEffect(() => {
    const installationId = searchParams.get("installationId") || searchParams.get("installation_id") || "180910099";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (installationId) {
      dispatch(findRepos({ installationId, page, limit }));
    }
  }, [dispatch, searchParams]); 

  if (loading) return <div>loading...</div>;

  const repoList = repos?.paginatedData || [];
return (
       <>
    <div>
      <h2>Repo Page</h2>
      {repoList.length === 0 ? (
        <p>No repositories found. Please make sure the app is installed.</p>
      ) : (
        repoList.map((r: any) => (
          <div key={r.id}>
            <p>{r?.name}</p>
          </div>
        ))
      )}
    </div>
    </> 
)
}
