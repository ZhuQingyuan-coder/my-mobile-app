import { ScanningOutline,ArrowsAltOutline } from "antd-mobile-icons"
import { Grid,List} from 'antd-mobile'
import { selectLoginData } from "../../features/Login"
import { useDispatch,useSelector } from "react-redux"
import { getToDoList ,selectToDoList,selectStatus,selectfilterResult} from '../../features/toDo/index'
import { useEffect, useState } from "react"

export default function Home() {
    const { employeeName, shopName } = useSelector(selectLoginData)
    const dispatch = useDispatch()
    const status = useSelector(selectStatus);
    const ToDoList = useSelector(selectToDoList);
    const filterResult = useSelector(selectfilterResult)
    const [toDoState,setToDoState] = useState({})
    const toDolistData = ['p_order','back_out','delivery_receive','stock_in','stock_out']
    const req = {
        serviceId:'DCP_ToDoListQuery',
        request:{
        }
    }
    const param = {
        req,
        toDolistData
    }
    console.log('filterResult',filterResult,'toDoState',toDoState,'ToDoList',ToDoList)
    useEffect(()=>{
        dispatch(getToDoList(param))
    },[])
    useEffect(()=>{
        if(status=='succeeded'){
            setToDoState({
                ...filterResult
            })
        }
    },[ToDoList,status])
    return (
        <div className="grayBackgroundColor fullScreen">
            <div style={{ backgroundColor: '#1677FF' }} className="padding10" >
                <Grid columns={2} gap={8}>
                    <Grid.Item style={{ display: 'flex', alignItems: 'center' }} span={1}>
                        <div >
                            <p className="white fontbold fontSize18">
                                欢迎回来! {employeeName}
                            </p>
                        </div>
                    </Grid.Item>
                    <Grid.Item>
                        <div className="right">
                            <ScanningOutline color='white' fontSize={24} span={1} />
                        </div>
                    </Grid.Item>
                    <Grid.Item style={{ display: 'flex', alignItems: 'center' }} span={2}>
                        <div >
                            <p className="white  fontSize18">
                                当前组织:{shopName}
                            </p>
                        </div>
                    </Grid.Item>
                </Grid>

            </div>
            <div className="card">
                <div className="cardContent">
                    <div className="paddingTop10">
                        <Grid columns={4} gap={8}>
                            <Grid.Item className="flexCenter">
                                <div className="textAlign">
                                    <span className="iconfont icon-moban" style={{ color: '#1677FF', fontSize: 24 }} ></span>
                                    <p className="fontbold marginTop" >模板要货</p>
                                </div>

                            </Grid.Item>
                            <Grid.Item className="flexCenter">
                                <div className="textAlign">
                                    <span className="iconfont icon-yaohuomingxi" style={{ color: '#F19353', fontSize: 24 }} ></span>
                                    <p className="fontbold marginTop" >要货</p>
                                </div>

                            </Grid.Item>
                            <Grid.Item className="flexCenter">
                                <div className="textAlign">
                                    <span className="iconfont icon-caigoushenqing" style={{ color: '#0DBA0D', fontSize: 24 }} ></span>
                                    <p className="fontbold marginTop" >采购</p>
                                </div>

                            </Grid.Item>
                            <Grid.Item className="flexCenter">
                                <div className="textAlign">
                                    <span className="iconfont icon-tiaoboguanli1" style={{ color: '#7452BF', fontSize: 24 }} ></span>
                                    <p className="fontbold marginTop" >调拨</p>
                                </div>

                            </Grid.Item>
                        </Grid>
                    </div>
                    <div className="paddingTop15">
                        <Grid columns={2} gap={8}>
                            <Grid.Item>
                                <div className="gradientColorYellow padding10 fontColorOrange borderRadius10" style={{ height: '100%' }}>
                                    <p className="fontSize18 fontbold">退货出库</p>
                                    <p className="fontSize18">{toDoState.back_out ? toDoState.back_out : '--'} <span className="fontSize12">待确认</span></p>
                                </div>
                            </Grid.Item>
                            <Grid columns={1} gap={8}>
                                <Grid.Item>
                                    <div className="gradientColorRed padding10 fontColorWhite borderRadius10">
                                        <p className="fontSize18 fontbold" >配送收货</p>
                                        <p className="fontSize18">{toDoState.delivery_receive ? toDoState.delivery_receive : '--'} <span className="fontSize12">待收货</span></p>
                                    </div>
                                </Grid.Item>
                                <Grid.Item>
                                    <div className="gradientColorBlue padding10 fontColorWhite  borderRadius10" >
                                        <p className="fontSize18 fontbold">调拨收货</p>
                                        <p className="fontSize18">{toDoState.stock_in ? toDoState.stock_in :'--'} <span className="fontSize12">待收货</span></p>
                                    </div>
                                </Grid.Item>
                            </Grid>
                        </Grid>
                    </div>

                </div>
            </div>
            <div className="card">
                <div className="cardContent">
                    <div >
                        <List>
                            <List.Item
                                prefix={<div className='daibanIconBox cocoa-bg-blue_light'><span className="daibanIcon cocoa-bg-blue">{toDoState.p_order ? toDoState.p_order:'--'}</span></div>}
                                description={`有${toDoState.p_order? toDoState.p_order:'--'}笔待确认的新单据，请尽快确认!`}
                                arrowIcon={<span className="iconfont icon-xiangyouyuanjiantouyoujiantouxiangyoumianxing" style={{ fontSize: 24 }} ></span>}
                                onClick={() => { }}
                            >
                                确认要货
                            </List.Item>
                            <List.Item
                                prefix={<div className='daibanIconBox cocoa-bg-yellow_light'><span className="daibanIcon cocoa-bg-yellow">{toDoState.stock_out ? toDoState.stock_out:'--'}</span></div>}
                                description={`有${toDoState.stock_out? toDoState.stock_out:'--'}笔待确认的新单据，请尽快确认!`}
                                arrowIcon={<span className="iconfont icon-xiangyouyuanjiantouyoujiantouxiangyoumianxing" style={{ fontSize: 24 }} ></span>}
                                onClick={() => { }}
                            >
                                确认调拨出库
                            </List.Item>
                        </List>
                    </div>
                </div>
            </div>
        </div>
    )
}