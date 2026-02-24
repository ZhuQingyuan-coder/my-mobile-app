import { createHashRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Spinner from '../components/LoadingSpinner'
import Login from '../pages/Login'
import Permission from '../components/Permission'
const Menu = lazy(() => import('../pages/Menu/index'))
const Home = lazy(() => import('../pages/Home/index'))
const Shop = lazy(() => import('../pages/Shop/index'))
const Report = lazy(() => import('../pages/Report/index'))
const Application = lazy(() => import('../pages/Application/index'))
const User = lazy(() => import('../pages/User/index'))
const LoginHistory = lazy(() => import("../pages/LoginHistory/index"))
const OrgChange = lazy(()=>import("../pages/OrgChange/index"))
const Porder = lazy(()=>import("../pages/Porder/index"))
const TemplateChoose = lazy(()=>import('../pages/TemplateChoose'))
const TemplateDetail = lazy(()=>import('../pages/TemplateDetail'))
const PorderConfirm = lazy(()=>import('../pages/PorderConfirm'))
const lazyLoad = (Component,id) => {
   return (
      <Permission id={id}>
         <Suspense fallback={<Spinner />}>
            <Component />
         </Suspense>
      </Permission>
   )
}
const Loader = async () => {
   return JSON.parse(sessionStorage.getItem('token'))
}
const router = createHashRouter([
    {
        path: '/',
        element: <Login></Login>
    },
    {
        path: '/menu',
        id:'menu',
        loader:Loader,
        element: <Suspense>
            <Menu></Menu>
        </Suspense>,
        children: [
            {
                index: true,
                element: lazyLoad(Home,'menu')
            },
            {
                path: 'shop',
                element: lazyLoad(Shop,'menu')
            },
            {
                path: 'report',
                element: lazyLoad(Report,'menu')
            },
            {
                path: 'application',
                element: lazyLoad(Application,'menu')
            },
            {
                path: 'user',
                element: lazyLoad(User,'menu')
            },
        ]
    },
    {
        path: '/loginHistory',
        element: <Suspense>
            <LoginHistory></LoginHistory>
        </Suspense>
    },
    {
        path: '/orgChange',
        id:'orgChange',
        loader:Loader,
        element:lazyLoad(OrgChange,'orgChange')
    },
    {//要货
        path: '/p_order',
        id:'p_order',
        loader:Loader,
        element:lazyLoad(Porder,'p_order')
    },
    {//模板选择
        path: '/templateChoose',
        id:'templateChoose',
        loader:Loader,
        element:lazyLoad(TemplateChoose,'templateChoose')
    },
    {//模板详情
        path: '/templateDetail',
        id:'templateDetail',
        loader:Loader,
        element:lazyLoad(TemplateDetail,'templateDetail')
        
    },
    {
        path:'/porderConfirm',
        id:'porderConfirm',
        loader:Loader,
        element:lazyLoad(PorderConfirm,'porderConfirm')
    }
])


export default router

