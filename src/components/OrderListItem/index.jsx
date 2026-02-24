import { Grid, Button, Tag, Modal,Space,CenterPopup  } from "antd-mobile"
import { PayCircleOutline, CheckCircleOutline, EditSOutline, DeleteOutline, MoreOutline,AddSquareOutline,TextOutline } from 'antd-mobile-icons'
import {PieOutline} from 'antd-mobile-icons'
import { useState } from "react"
export default function OrderListItem({ power, billInfo, confirm, handleDelete }) {
    const { porderNo, pTemplateName, pTemplateNo, isAdd, totPqty, totAmt, totCqty, rDate, totDistriAmt, isUrgentOrder } = billInfo
    const billProperty = [
        {
            name: '数量',
            number: totPqty,
            fontType: 'common'
        },
        {
            name: '种数',
            number: totCqty,
            fontType: 'common'
        }, {
            name: '零售总价',
            number: totAmt,
            fontType: 'money'
        }, {
            name: '进货总价',
            number: totDistriAmt,
            fontType: 'money'
        }
    ]
    const moneyNumberClassName = "fontSize15 fontbold fontColorOrange"
    const commonNumberClassName = "fontSize15 fontbold"
    const [modelVisible, setModelVisible] = useState(false)
    const handleMore = () => {
        setModelVisible(true)
    }
    return <>
        <div>
            <p className="fontSize15 fontbold " style={{ display: 'flex', alignItems: 'center' }}>
                {porderNo}
                {isUrgentOrder == 'Y' && <Tag color='danger' className="marginLeft6">紧急</Tag>}
            </p>
            <Grid columns={2} className="marginBottom10">
                <Grid.Item>
                    {pTemplateName && <p className="fontSize15">
                        <span className="fontColorGary">模板要货:</span>{pTemplateName}
                    </p>}
                </Grid.Item>
                <Grid.Item style={{ textAlign: 'right' }}>
                    <p className="fontSize15 fontColorGary">
                        需求日期:{rDate}
                    </p>
                </Grid.Item>
            </Grid>
            <Grid columns={4} className="marginBottom10">
                {billProperty.map(item => {
                    return (
                        <Grid.Item key={item.name}>
                            <div className="flexCenter" style={{ flexDirection: 'column' }}>
                                <p className={item.fontType == 'money' ? moneyNumberClassName : commonNumberClassName}>
                                    {item.fontType == 'money' ? <PayCircleOutline /> : <></>}{item.number}
                                </p>
                                <p className="fontSize15 fontColorGary" >
                                    {item.name}
                                </p>
                            </div>
                        </Grid.Item>
                    )
                })}
            </Grid>
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button shape='rounded' color='primary' size='small' className="marginLeft6" onClick={() => { confirm({ porderNo, rDate, totDistriAmt }) }}>
                    <CheckCircleOutline />确认
                </Button>
                <Button shape='rounded' color='primary' size='small' className="marginLeft6">
                    <EditSOutline />编辑
                </Button>
                <Button shape='rounded' color='danger' size='small' className="marginLeft6" onClick={() => { handleDelete({ porderNo, rDate, totDistriAmt }) }}>
                    <DeleteOutline />删除
                </Button>
                <Button shape='rounded' color='primary' size='small' className="marginLeft6" onClick={() => { handleMore() }}>
                    <MoreOutline />更多
                </Button>
            </div>
            <CenterPopup
                visible={modelVisible}
                onMaskClick={() => {
                    setModelVisible(false)
                }}
                style={{ '--min-width': '60vw' }}
            >
                <div className="padding20">
                    <div className="fontSize18 textAlignCenter marginBottom20 fontbold">
                        更多按钮
                    </div>
                    <Space justify='center' align='center' direction='vertical' block style={{'--gap':'16px'}}>
                        <Button color="primary" shape="rounded">
                            <PieOutline className="marginRight6"/>统计
                        </Button >
                        <Button color="primary" shape="rounded">
                            <AddSquareOutline className="marginRight6"/>追加
                        </Button>
                        <Button color="primary" shape="rounded">
                            <TextOutline className="marginRight6"/>复制
                        </Button>
                    </Space>
                </div>
            </CenterPopup>
        </div>
    </>
}