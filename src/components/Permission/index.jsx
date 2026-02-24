import { useEffect } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Error403 = ()=>{
    const navigate = useNavigate()
    useEffect(()=>{
        navigate('/')
    })
}
const Permission = (props) => {
   // 这个root是我们在前面路由中定义了 id: 'root'
   const { children,id } = props
   const loaderData = useRouteLoaderData(id)
   if (loaderData) {
      return <>{children}</>
   }
   return <Error403></Error403>
}

export default Permission
