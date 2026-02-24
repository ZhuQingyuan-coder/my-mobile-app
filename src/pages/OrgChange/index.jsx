import { NavBar, SearchBar, Button, List } from 'antd-mobile'
import { CheckOutline } from 'antd-mobile-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectShopList } from '../../features/shopList'
import { getShopList } from '../../features/shopList/index'
import { selectLoginData, selectShops, changeLoginData, selectChangeLoginDataStatus, getOrgData } from '../../features/Login/index'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function OrgChange() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const loginData = useSelector(selectLoginData)
    const shopList = useSelector(selectShopList)
    const changeLoginDataStatus = useSelector(selectChangeLoginDataStatus)
    const shops = useSelector(selectShops)
    const { state } = useLocation()//路由
    const [nowSelectedId, setNowSelectedId] = useState(JSON.parse(sessionStorage.getItem('temSelectedId')) || state.selectedId)//防止刷新丢失
    const temSelectedId = useRef(state.selectedId)
    const [searchKeyTxt, setSearchKeyTxt] = useState('')
    const [changeOrg, setChangeOrg] = useState({})
    const searchResult = () => {
        return shopList.filter(item => {
            return item.shopId.includes(searchKeyTxt)
        })
    }
    const searchShopListResult = useMemo(searchResult, [searchKeyTxt, shopList])
    const orglevReq = {
        serviceId: 'DCP_OrglevQuery',
        request: {
            keyTxt: changeOrg?.orgNo,
            status: '100'
        }
    }
    const orglevParams = {
        req: orglevReq,
        organizationNo: changeOrg?.orgNo
    }
    const orgReq = {
        serviceId: 'DCP_ShopChange',
        request: {
            oShopName: changeOrg?.orgName,
            oShopId: changeOrg?.orgNo,
            cOrg_Form: changeOrg?.org_Form,
            disCentre: 'N'
        }
    }
    const shopChangeParams = {
        req: orgReq
    }
    const params = {
        req: {
            serviceId: 'DCP_CityShopQuery',
            request: {
                range: '1',
                status: '100',
                keyTxt: searchKeyTxt
            },
            pageSize: 999,
            pageNumber: 1
        }
    }
    const handleClick = (data) => {
        //changeShop服务
        if (data != nowSelectedId) {
            setChangeOrg(shops.filter(item => {
                return item.orgNo == data;
            })[0])
            temSelectedId.current = data
        }
    }
    const handleSearch = (data) => {
        setSearchKeyTxt(data)
    }
    const back = () => {
        navigate('/menu/user')
    }
    useEffect(() => {
        if (changeLoginDataStatus == 'succeeded' && Object.keys(changeOrg).length > 0) { //添加&& Object.keys(changeOrg).length > 0条件保证数据完整再发请求
            sessionStorage.setItem('temSelectedId', JSON.stringify(temSelectedId.current))//防止刷新丢失 成功切换之后再持久化temSelectedShopId
            setNowSelectedId(temSelectedId.current)
            dispatch(getOrgData(orglevParams))
        }
    }, [changeLoginDataStatus])
    useEffect(() => {
        dispatch(getShopList(params))
    }, [nowSelectedId])
    useEffect(() => {//render要先比useEffect执行，换句话说就是先执行重新渲染，再执行副作用
        if (Object.keys(changeOrg).length > 0) {//防止挂载之后直接执行

            dispatch(changeLoginData(shopChangeParams))
        }
    }, [changeOrg])

    return <>
        <NavBar onBack={back} style={{ backgroundColor: '#1677FF', color: 'white', '--height': '55px' }}>选择组织</NavBar>
        <div className='padding10'>
            <SearchBar placeholder='请输入门店名称或编号' style={{ '--border-radius': '12px', '--height': '40px' }} onSearch={handleSearch} />
        </div>
        <div className='padding10 fontSize18 fontbold'>
            总部
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }} className='marginLeft10 marginRight10'>
            {loginData.myShops.map((item => {
                if (item.org_Form == '0') {
                    return <div className='marginTop3 marginRight3 marginBottom3' key={item.orgNo}>
                        <Button inline size="small"
                            shape="rounded"
                            className={item.orgNo == nowSelectedId ? 'selectedButton' : 'detailButton'}
                            style={{ padding: '8px' }}
                            onClick={() => { handleClick(item.orgNo) }}
                        >{item.orgName}</Button>
                    </div>
                }
            }))}
        </div>
        <div className='padding10 fontSize18 fontbold '>
            门店
        </div>
        <List>
            {searchShopListResult.map(item => {
                return <List.Item key={item.shopId} arrowIcon={nowSelectedId == item.shopId ? <CheckOutline color='blue' /> : <></>} onClick={(e) => { handleClick(item.shopId) }}>{item.shopName}({item.shopId})</List.Item>
            })}
        </List>

    </>
}
