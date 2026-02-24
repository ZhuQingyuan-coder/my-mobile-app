
import { Outlet } from 'react-router-dom'
import {
  AppOutline,
  AppstoreOutline,
  ShopbagOutline,
  UserOutline,
} from 'antd-mobile-icons'
import { useSelector } from 'react-redux'
import {selectLoginData} from '../../features/Login'
import Bottom from '../../components/BottomNavBar'
import './index.less'
export default function Menu() {
    const loginData = useSelector(selectLoginData)
    const tabs = [
    {
      key: '/menu',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/menu/application',
      title: '应用',
      icon: <AppstoreOutline />,
    },
    {
      key: '/menu/user',
      title: '我的',
      icon: <UserOutline />,
    },
  ]
  if(loginData.dataParas?.find(item=>{
    return item.paraName == 'iSgoodsShow'
  }).paraValue=='Y'){
    tabs.splice(1,0,{
      key: '/menu/shop',
      title: '商品',
      icon: <ShopbagOutline />,
    })
  }
  console.log(tabs,'tabs')
    return (
        <div>
            <Outlet/>
            <div className='bottom'>
                <Bottom tabs={tabs}></Bottom>
            </div>
        </div>
    )
}