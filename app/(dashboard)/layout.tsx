import React,{ReactNode} from 'react';
import Sidebar from './dashboard/Sidebar/Sidebar';
const layout:React.FC<{children:ReactNode}>=({children})=> {
  return (
       <div className="flex">
     <Sidebar/>
      <main className="md:ml-64 w-full">{children}</main>
    </div>
  )
}
export default layout
