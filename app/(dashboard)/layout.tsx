import React,{ReactNode} from 'react'
const layout:React.FC<{children:ReactNode}>=({children})=> {
  return (
    <div>
      {children}
    </div>
  )
}
export default layout
