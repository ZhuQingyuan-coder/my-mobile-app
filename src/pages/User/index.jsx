import { useNavigate } from "react-router-dom"
import { Tag,List } from "antd-mobile"
import storebg from '../../assets/images/ic_store_big.png'
import './index.less'
import { useSelector, useDispatch } from "react-redux"
import { selectLoginData, selectOrgInfo,outLogin } from "../../features/Login"
import { EnvironmentOutline } from "antd-mobile-icons"


export default function User() {
    const navigate = useNavigate()
    const loginData = useSelector(selectLoginData)
    const orgInfo = useSelector(selectOrgInfo)
    const dispatch = useDispatch()
    const handleOutLogin = ()=>{
        dispatch(outLogin())
        navigate('/')
    }
    return (
        <div className="grayBackgroundColor fullScreen">
            <div className="padding10 marginBottom20">
                <div className="shopCard">
                    <div className="shopImage">
                        <img src={storebg} alt="" />
                    </div>

                    <div className="shopInfo">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p className="fontSize18 fontbold" >
                                {loginData.shopName}
                            </p>

                            <Tag color='warning' className="fontSize12">{loginData.org_type == '0'?'直营':loginData.org_type == '1'?'强加盟':'弱加盟'}</Tag>
                        </div>
                        <div style={{ marginTop: 5 }}>
                            <p><EnvironmentOutline />{orgInfo.address}</p>
                        </div>

                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p className="fontbold"><span>{loginData.opName}</span></p>
                    <Tag round color='#2db7f5' className="marginLeft10 fontSize12">
                        ID:{loginData.opNo}
                    </Tag>
                </div>
            </div>
            <div>
                <List>
                    <List.Item
                        prefix={<span className="iconfont icon-shangdian1" style={{ color: '#1677FF', fontSize: 24 }} ></span>}
                        arrowIcon={<span className="iconfont icon-xiangyouyuanjiantouyoujiantouxiangyoumianxing" style={{ fontSize: 24 }} ></span>}
                        onClick={() => { 
                            const state = {
                                selectedId:loginData.shopId
                            }
                            navigate('/orgChange',{state}) 
                        }}
                    >
                        <p className="fontSize15">切换门店</p>
                    </List.Item>
                    <List.Item
                        prefix={<span className="iconfont icon-xiugai" style={{ color:'#EE806F', fontSize: 24 }} ></span>}
                        arrowIcon={<span className="iconfont icon-xiangyouyuanjiantouyoujiantouxiangyoumianxing" style={{ fontSize: 24 }} ></span>}
                        onClick={() => { }}
                    >
                        <p className="fontSize15">修改密码</p>
                    </List.Item>
                    <List.Item
                        prefix={<span className="iconfont icon-24gf-gear" style={{ color:'#F19353', fontSize: 24 }} ></span>}
                        arrowIcon={<span className="iconfont icon-xiangyouyuanjiantouyoujiantouxiangyoumianxing" style={{ fontSize: 24 }} ></span>}
                        onClick={() => { }}
                    >
                        <p className="fontSize15">设置</p>
                    </List.Item>
                    <List.Item
                        prefix={<span className="iconfont icon-tuichudenglu" style={{ color:'#43D4D1', fontSize: 24 }} ></span>}
                        arrowIcon={<span className="iconfont icon-xiangyouyuanjiantouyoujiantouxiangyoumianxing" style={{ fontSize: 24 }} ></span>}
                        onClick={() => {handleOutLogin()}}
                    >
                        <p className="fontSize15">退出登录</p>
                    </List.Item>
                </List>
            </div>
            <div className="flexCenter marginTop15">
                <span className="fontColorGary">
                    {version +' '+ updateDay}
                </span>
            </div>
            <div className="flexCenter">
                <span className="fontColorGary fontSize12">
                    鼎捷数智股份有限公司
                </span>
            </div>
        </div>
    )
}