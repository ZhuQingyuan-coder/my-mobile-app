import { useLocation, useNavigate } from "react-router-dom"
import { NavBar, Switch, Input, List, Grid, Collapse, Button } from 'antd-mobile'
import { AddSquareOutline, BellOutline, CalendarOutline, FileOutline, PayCircleOutline } from 'antd-mobile-icons'
import defaultGoodsImage from '../../assets/images/goods-img.png';
import { useSelector } from "react-redux";
import { selectLoginData } from '../../features/Login/index'
import porderCreateRequset from "../../api/porderCreate";
import dayjs from "dayjs";
import { useState } from "react"
import './index.less'
const moneyNumberClassName = "fontSize15 fontbold fontColorOrange"
export default function PorderConfirm() {
    const location = useLocation()
    const navigate = useNavigate()
    const requestDate = JSON.parse(sessionStorage.getItem('modelRequestDate'))
    const goodsNumber = location.state.requestGoods.length
    const goodsList = location.state.requestGoods
    const selectedTemplateInfo = JSON.parse(sessionStorage.getItem('selectedTemplateInfo'))
    const [memo, setMemo] = useState('')//备注
    const [isAddTakeGoods, setIsAddTakeGoods] = useState(location.state?.isAdd||false)//
    const [isUrgencyTakeGoods, setIsUrgencyTakeGoods] = useState(false)//
    const supTotalPrice = goodsList.reduce((acc, cur) => {
        return acc + (cur.pqty * cur.supPrice)
    }, 0)
    const totPqty = goodsList.reduce((acc, cur) => {//数量合计
        return acc + cur.pqty
    }, 0)
    const totDistriAmt = goodsList.reduce((acc, cur) => {//进货金额合计
        return acc + (cur.pqty * cur.supPrice)
    }, 0)
    const billDate = dayjs().format('YYYY-MM-DD')
    const loginInfo = useSelector(selectLoginData)
    const  guid = () => {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [];
        const radix = 16;
        for (let i = 0; i < 16; i++)
            uuid[i] = chars[0 | Math.random() * radix];
        return uuid.join('');
    }
    // const goodsNumber = location.state.
    // const [pickViewShow, setPickViewShow] = useState(false)
    // const basicColumns = [
    //     [
    //         { label: '无', value: '0' },
    //         { label: '门店自提', value: '1' },
    //         { label: 'ERP总部配送', value: '2' },
    //         { label: '同城配送', value: '3' },
    //         { label: '全国快递', value: '4' }
    //     ]
    // ]

    const back = () => {
        navigate('/templateDetail', {
            state: {
                from: 'porderConfirm'
            }
        })
    }

    const saveBill = async () => {
        console.log(selectedTemplateInfo.pTemplateNo,'selectedTemplateInfo.pTemplateNo')
        const params = {
            req: {
                serviceId: 'DCP_POrderCreate',
                request: {
                    ISUrgentOrder: isUrgencyTakeGoods ? 'Y':'N',
                    isAdd:isAddTakeGoods? 'Y':'N',
                    oType: '0',
                    rDate: requestDate.split('-').join(''),
                    bdate: billDate.split('-').join(''),
                    pTemplateNo: selectedTemplateInfo.pTemplateNo,
                    porderID:guid(),
                    supplierType:selectedTemplateInfo.supplierType,
                    employeeID:loginInfo.employeeNo,
                    departID:loginInfo.departmentNo,
                    pOrderType:'others',
                    datas:goodsList,
                    rTime:'000000',
                    totPqty:totPqty.toString(),
                    totDistriAmt:totDistriAmt.toString(),
                    totCqty:goodsNumber.toString(),
                    memo:memo
                }
            }
        }
        const response = await porderCreateRequset(params.req)
        if(response.success){
            navigate('/p_order',{state:{
                from:'/porderConfirm'
            }})
        }
    }

    return <>
        <div className="grayBackgroundColor">
            <NavBar onBack={back} style={{ backgroundColor: '#1677FF', color: 'white' }}>
                创建订单
            </NavBar>
            <div style={{ backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px', lineHeight: '50px' }} className="padding20">
                    <div className="fontSize15" style={{ display: 'flex', alignItems: 'center' }}>
                        <AddSquareOutline fontSize={24} color='#76c6b8' /><div className="marginLeft6">追加要货</div>
                    </div>
                    <Switch checked={isAddTakeGoods} onChange={(value) => { setIsAddTakeGoods(value) }} disabled={true}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px', lineHeight: '50px' }} className="padding20">
                    <div className="fontSize15" style={{ display: 'flex', alignItems: 'center' }}>
                        <BellOutline fontSize={24} color='#EB3043' /><div className="marginLeft6">紧急要货</div>
                    </div>
                    <Switch checked={isUrgencyTakeGoods} onChange={(value) => { setIsUrgencyTakeGoods(value) }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px', lineHeight: '50px' }} className="padding20">
                    <div className="fontSize15" style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutline fontSize={24} color='#1677FF' /><div className="marginLeft6">需求日期</div>
                    </div>
                    <div className="fontColorGary fontSize15" >
                        {requestDate}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px', lineHeight: '50px' }} className="padding20">
                    <div className="fontSize15" style={{ display: 'flex', alignItems: 'center' }}>
                        <FileOutline fontSize={24} color='#F19353' /><div className="marginLeft6">备注</div>
                    </div>
                    <div className="fontColorGary fontSize15" >
                        <Input type="text" placeholder="请输入备注" style={{ '--text-align': 'right' }} value={memo} onChange={(value) => setMemo(value)} />
                    </div>
                </div>
            </div>

            <div className="whiteBackgroundColor">
                <div className="padding15 fontbold fontSize15 marginTop20 ">
                    商品列表({goodsNumber})
                </div>
            </div>
            <div className="whiteBackgroundColor">
                {
                    goodsList.map(item => {
                        return <TemplateGoodsItem goodsItem={item} key={item.pluNo}></TemplateGoodsItem>
                    })
                }

            </div>

            <div className="whiteBackgroundColor marginTop20 padding15" style={{ height: '30vh' }}>
                <Collapse >
                    <Collapse.Panel key='1' title={<strong>其它信息</strong>} >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="marginTop">
                            <p className="fontSize15 " style={{ color: 'black' }}>
                                单据日期
                            </p>
                            <div className="fontSize15 " style={{ color: 'black' }}>
                                {
                                    billDate
                                }
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="marginTop">
                            <p className="fontSize15 " style={{ color: 'black' }}>
                                模板名称
                            </p>
                            <div className="fontSize15 " style={{ color: 'black' }}>
                                {
                                    selectedTemplateInfo.pTemplateName
                                }
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="marginTop">
                            <p className="fontSize15" style={{ color: 'black' }}>
                                模板编号
                            </p>
                            <div className="fontSize15" style={{ color: 'black' }}>
                                {
                                    selectedTemplateInfo.pTemplateNo
                                }
                            </div>
                        </div>
                    </Collapse.Panel>
                </Collapse>

            </div>
            <div className="footer">
                <Button shape='rounded' color='primary' style={{ width: 100 }} onClick={saveBill}>保存</Button>
                <div className="marginRight10 fontSize15">
                    <div>标准供货总价:
                        <span className={moneyNumberClassName}>
                            <PayCircleOutline />{supTotalPrice}
                        </span>
                    </div>
                </div>
            </div>

            {/* <List>
            <List.Item extra='无' onClick={() => {

            }}>
                配送方式
            </List.Item>
        </List> */}
            {/* <Picker
            columns={basicColumns}
            visible={pickViewShow}
            onClose={() => {
                setPickViewShow(false);
            }}
            value={selectedOption}
            onConfirm={v => {
                setSelectedOption(v)
                setDateType(v[0])
                
            }}
        /> */}
        </div>


    </>
}

function TemplateGoodsItem({ goodsItem }) {
    const { supPrice, pluName, pluNo, spec, supplierName, pUnitName, mulQty, listImage, maxQty, isHotGoods, isNewGoods, defQty, minQty, pqty } = goodsItem
    return <>
        <div className="padding10">
            <div style={{ display: 'flex' }} >
                <img src={listImage ? listImage : defaultGoodsImage} alt="" style={{ width: 50, height: 50 }} className="marginRight10" />
                <div style={{ flex: 1 }}>
                    <div className="fontbold fontSize15">
                        商品名称:{pluName}
                        <img src={isHotGoods == 'Y' ? hot : null} alt="" className="marginLeft10" />
                    </div>
                    <div className="fontbold fontSize15 marginTop6">
                        规格:{spec}
                    </div>
                </div>
            </div>
            <div className="marginTop">
                <Grid columns={2} gap={8} >
                    <Grid.Item>
                        <div className="fontColorGary">
                            品号:{pluNo}
                        </div>
                    </Grid.Item>
                    <Grid.Item>
                        <div className="fontColorGary">
                            数量:{pqty}
                        </div>
                    </Grid.Item>
                </Grid>
            </div>
            <div className="marginTop">
                <Grid columns={2} gap={8} >
                    <Grid.Item>
                        <div className="fontColorGary">
                            标准供货价: <span className={moneyNumberClassName}><PayCircleOutline />{supPrice}</span>/{pUnitName}
                        </div>
                    </Grid.Item>
                    <Grid.Item>
                        <div className="fontColorGary">
                            供货商: {supplierName}
                        </div>
                    </Grid.Item>
                </Grid>
            </div>
        </div>
    </>
}