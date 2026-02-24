import { useNavigate ,useLocation} from "react-router-dom";
import templateDetailRequset from "../../api/templateDetail";
import { SearchOutline, ScanningOutline, PayCircleOutline } from 'antd-mobile-icons';
import { Space, NavBar, List, Grid, Stepper, Input, Button, Toast } from 'antd-mobile';
import { useEffect, useMemo, useState } from "react";
import hot from '../../assets/images/hot.png';
import defaultGoodsImage from '../../assets/images/goods-img.png';
import './index.less'

const moneyNumberClassName = "fontSize15 fontbold fontColorOrange"
export default function TemplateDetail() {
    const location = useLocation()
    const [templateGoodsList, setTemplateGoodsList] = useState([])
    const templateDetail = JSON.parse(sessionStorage.getItem('selectedTemplateInfo'))
    // const caulculateTotalPrice = () => {
    //     return templateGoodsList.reduce((acc,cur)=>{
    //         return acc + (cur.pqty * cur.price)
    //     },0)
    // }
    // const totalPrice = useMemo(caulculateTotalPrice,[templateGoodsList])
    const caulculateTotalDistriPrice = () => {
        return templateGoodsList.reduce((acc,cur)=>{
            return acc + (cur.pqty * cur.supPrice)
        },0)
    }
    const supTotalPrice = useMemo(caulculateTotalDistriPrice,[templateGoodsList])

    const navigate = useNavigate()
    const right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ '--gap': '16px' }}>
                <SearchOutline color='var(--adm-color-primary)' />
                <ScanningOutline color='var(--adm-color-primary)' />
            </Space>
        </div>
    )

    const handleChange = (value, goodsItem, mulQty) => {
        console.log(templateGoodsList,'templateGoodsList')
        //检查倍量
        if (value % mulQty !== 0) {//有余数
            Toast.show('请输入倍量的整数倍!')
            setTemplateGoodsList(prevTemplateGoodsItem => prevTemplateGoodsItem.map(item => {
                return {
                    ...item,
                    pqty: 1
                }
            })
            )
        } else {
            setTemplateGoodsList(prevTemplateGoodsItem => prevTemplateGoodsItem.map(item => {
                return goodsItem.pluNo == item.pluNo ? { ...item, pqty: value }:item
            })
            )
        }

    }
    const back = () => {
        sessionStorage.removeItem('templateGoodsList')
        navigate('/p_order', { state: { from: '/templateDetail' } })
    }
    const getTemplateDetail = async () => {
        const param = {
            req: {
                serviceId: 'DCP_POrderTemplateDetailQuery',
                request: {
                    templateNo:templateDetail.pTemplateNo
                },
                pageNumber:'1',
                pageSize:'999'
            }
        }
        const response = await templateDetailRequset(param.req)
        const result = response.data[0].goodsList.map(item => {
            return {
                ...item,
                pqty: 0//添加要货量字段
            }
        })
        setTemplateGoodsList(result)
    }
    const handleClick = ()=>{
       //校验是否存在每一个要货量都为0
        if(
            templateGoodsList.reduce((acc,cur)=>{
                return acc + cur.pqty
            },0) == 0
        ){
            Toast.show('要货量不可以全部为0')
            return;
        }
        const requestGoods = templateGoodsList.filter(item=>{
            return item.pqty !== 0
        })
        //session存储要货信息
        sessionStorage.setItem('templateGoodsList',JSON.stringify(templateGoodsList))
       //不存在直接跳转
       navigate('/porderConfirm',{
            state:{
                requestGoods
            }
       })
    }
    useEffect(() => {
        if(location.state?.from !== 'porderConfirm' && location.state?.from !== 'p_order'){
            navigate('/menu')
        }

        if(location.state?.from == 'porderConfirm'){
            //如果是从
            setTemplateGoodsList(JSON.parse(sessionStorage.getItem('templateGoodsList')))
        }else{
            getTemplateDetail()
        }
        
    }, [])
    return <>
        <NavBar right={right} onBack={back}>
            {templateDetail.pTemplateName}
        </NavBar>
        <List>
            {
                templateGoodsList.map(goodsItem => {
                    return <List.Item key={goodsItem.pluNo}>
                        <TemplateGoodsItem goodsItem={goodsItem} handleChange={handleChange}></TemplateGoodsItem>
                    </List.Item>
                })
            }
        </List>
        <div className="footer">
            <Button shape='rounded' color='primary' style={{ width: 100 }} onClick={handleClick}>已选好</Button>
            <div className="marginRight10 fontSize15">
                {/* <div>零售总价:<PayCircleOutline />{totalPrice}</div> */}
                <div>标准供货总价:
                    <span className={moneyNumberClassName}>
                        <PayCircleOutline />{supTotalPrice}
                    </span>
                </div>
            </div>
        </div>
    </>
}

function TemplateGoodsItem({ goodsItem, handleChange }) {
    const { supPrice, pluName, pluNo, spec,supplierName, pUnitName, mulQty, listImage, maxQty, isHotGoods, isNewGoods, defQty, minQty, pqty } = goodsItem
    return <>
        <div className="padding10">
            <div style={{ display: 'flex' }} >
                <img src={listImage ? listImage : defaultGoodsImage} alt="" style={{ width: 50, height: 50 }} className="marginRight10" />
                <div style={{ flex: 1 }}>
                    <div className="fontbold fontSize15">
                        商品名称:{pluName} 规格:{spec}
                        <img src={isHotGoods == 'Y' ? hot : null} alt="" className="marginLeft10" />
                    </div>
                    <div className="fontColorGary fontSize15">
                        品号:{pluNo} 最大要货:{maxQty} 倍量:{mulQty}
                    </div>
                </div>

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
            <div className="marginTop">
                <div className="flex alignItemsCenter">
                    <div className="flex1 grayBackgroundColor marginRight10" >
                        <Input type="text" placeholder="备注" />
                    </div>
                    <div className="flex1">
                        <Stepper value={pqty} defaultValue={defQty} min={minQty} max={maxQty} step={mulQty}
                            onChange={(value) => { handleChange(value, goodsItem, mulQty) }} />
                    </div>
                    <div className="flex1">
                        单位: {pUnitName}
                    </div>
                </div>
            </div>
        </div>
    </>
}


