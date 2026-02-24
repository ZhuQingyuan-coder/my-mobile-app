import {
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {  TabBar } from 'antd-mobile'
export default function Bottom({tabs}){
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    navigate(value)
  }

  

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)} style={{backgroundColor:'white'}}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}