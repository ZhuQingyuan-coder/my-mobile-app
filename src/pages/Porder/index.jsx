import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
    NavBar, Space, CalendarPicker, Picker, Popover, Toast, CenterPopup,
    Tabs, Badge, SearchBar, List, InfiniteScroll, Button, Modal, Input
} from "antd-mobile"
import { AddOutline, DownOutline, UpOutline, CalendarOutline, ContentOutline, FillinOutline } from 'antd-mobile-icons'
import porderListRequset from "../../api/porderList"
import { setMenuPower, selectModularPower, } from '../../features/Login/index'
import dayjs from 'dayjs'
import OrderListItem from "../../components/OrderListItem"
import orderStatusUpdate from "../../api/orderStatusUpdate"
import "./index.less"
const defaultRangeStart = dayjs().subtract(3, 'month');
const defaultRangeEnd = dayjs();
const maxDate = dayjs().add(1, 'year').toDate()
const minDate = dayjs().subtract(1, 'year').toDate()
const maxRequestDate = dayjs().add(1, 'month').toDate()
const minRequestDate = dayjs().toDate()
const defaultRange = [
    defaultRangeStart,
    defaultRangeEnd
]
const basicColumns = [
    [
        { label: '单据日期', value: 'bDate' },
        { label: '需求日期', value: 'rDate' },
    ]
]
const actions = [
    { key: 'scan', icon: <FillinOutline />, text: '商品要货' },
    { key: 'template', icon: <ContentOutline />, text: '模板要货' },
]
const dateTypeMap = {
    'bDate': '单据日期',
    'rDate': '需求日期'
}
const keyMap = {
    add: '0',
    submit: '2',
    reject: '5',
    check: '6',
    settle: '7',
    fail: '8'
}
export default function Porder() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const ModularPower = useSelector(selectModularPower)
    const [porderList, setPorderList] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [visible, setVisible] = useState(false);//日期选择显示隐藏标志位
    const [dateType, setDateType] = useState('bDate');
    const [selectedOption, setSelectedOption] = useState([])
    const [dateTypeSelectIsShow, setDateTypeSelectIsShow] = useState(false)
    const [modelRequestDateShow, setModelRequestDateShow] = useState(false)
    const [startDateShow, setStartDateShow] = useState(defaultRangeStart.format('YYYY-MM-DD'))
    const [endDateShow, setEndDateShow] = useState(defaultRangeEnd.format('YYYY-MM-DD'))
    const [keyTxt, setKeyTxt] = useState('')
    const [activeKey, setActiveKey] = useState(JSON.parse(sessionStorage.getItem('activeKey')) || 'add')//tab组件受控模式激活的keys
    const [status, setStatus] = useState(JSON.parse(sessionStorage.getItem('status')) || '0')
    const [pageNumber, setPageNumber] = useState(1)
    const isFirstRender = useRef(true);
    const [totalRecords, setTotalRecords] = useState(0)
    const [loading, setLoading] = useState(false); // 加载状态锁 暂时没用，如果有需求可以用于添加加载动画
    const [modelVisible, setModelVisible] = useState(false)
    const selectedTemplateInfo = JSON.parse(sessionStorage.getItem('selectedTemplateInfo')) || {}
    const orignRouteSet = new Set(['/templateDetail', '/templateChoose'])
    const modalOnceShow = useRef(true)
    const [modelRequestInfo, setModelRequestInfo] = useState({
        modelTemplateNo: selectedTemplateInfo?.pTemplateNo || '',
        modelTemplateName: selectedTemplateInfo?.pTemplateName || '',
        modelRequestDate: JSON.parse(sessionStorage.getItem('modelRequestDate')) || defaultRangeEnd.format('YYYY-MM-DD'),
        // memo: '',
    })

    const params = {
        req: {
            serviceId: 'DCP_POrderQuery',
            request: {
                keyTxt,
                status,
                dateType,
                beginDate: startDateShow.split('-').join(''),
                endDate: endDateShow.split('-').join(''),
            },
            pageSize: 10,
            pageNumber: pageNumber
        }
    }
    const right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ '--gap': '16px' }}>
                <Popover.Menu
                    actions={actions}
                    placement='bottom-start'
                    onAction={node => {
                        if (node.text == '模板要货') {
                            setModelVisible(true)
                        }
                    }
                    }
                    trigger='click'
                >
                    <AddOutline color='var(--adm-color-primary)' fontSize={28} />
                </Popover.Menu>
            </Space>
        </div>
    )
    const loadMore = async () => {
        setPageNumber((prev) => {
            return prev + 1
        })
        const append = await porderListRequset(params.req)
        if (params.req.request.status == '0') {//如果不是新增tab的查询请求不可以更改小气泡中的值
            setTotalRecords(append.totalRecords)
        }
        setPorderList(val => [...val, ...append.data])
        setHasMore(append.data.length > 0)
        setTimeout(() => { //强行控制为下一个渲染周期进行渲染
            if (modalOnceShow.current) { //保证只在从模板选择界面返回的时候渲染一次模态框 ，正常切换的时候不显示
                if (orignRouteSet.has(location.state?.from)) {
                    setModelVisible(true)
                    modalOnceShow.current = false
                }
            }
        }, 0)
    }
    const back = () => {
        navigate('/menu/application')
    }
    const doSearch = () => {
        setPorderList([])
        setHasMore(true)
        setPageNumber(1)
        // loadMore()
    }
    //tab切换函数
    const handleChange = (key) => {
        setActiveKey(key)
        setStatus(keyMap[key])
        sessionStorage.setItem('activeKey', JSON.stringify(key))
        sessionStorage.setItem('status', JSON.stringify(keyMap[key]))
    }
    //搜索框
    const keyTxtChange = (value) => {
        setKeyTxt(value)
    }
    //确认
    const confirm = ({ porderNo, rDate, totDistriAmt }) => {
        Modal.confirm({
            content: <div>
                <div className=" flexCenter fontSize18 fontbold" >确定</div>
                <div className="fontSize18 padding10 fontColorGray">
                    <div style={{ textAlign: 'center' }}>单号:<span className="fontbold">{porderNo}</span></div>
                    <div style={{ textAlign: 'center' }}>需求日期:<span className="fontbold">{rDate}</span></div>
                    <div style={{ textAlign: 'center' }}>进货总金额:<span className="fontbold">{totDistriAmt}</span></div>
                    <div style={{ textAlign: 'center' }}>确认提交此单?</div>
                </div>
            </div>,
            onConfirm: async () => {
                const params = {
                    req: {
                        serviceId: 'DCP_POrderStatusUpdate',
                        request: {
                            pOrderNo: porderNo,
                            oprType: 'submit'
                        },
                    }
                }
                try {
                    const result = await orderStatusUpdate(params.req)
                    if (result.success) {
                        Toast.show('提交成功')
                    } else {
                        Toast.show('提交失败')
                    }
                } catch (error) {
                    Toast.show(error)
                }
                doSearch()

            },
        })
    }
    //删除
    const handleDelete = ({ porderNo, rDate, totDistriAmt }) => {
        Modal.confirm({
            content: <div>
                <div className=" flexCenter fontSize18 fontbold" >删除</div>
                <div className="fontSize18 padding10 fontColorGray">
                    <div style={{ textAlign: 'center' }}>单号:<span className="fontbold">{porderNo}</span></div>
                    <div style={{ textAlign: 'center' }}>需求日期:<span className="fontbold">{rDate}</span></div>
                    <div style={{ textAlign: 'center' }}>进货总金额:<span className="fontbold">{totDistriAmt}</span></div>
                    <div style={{ textAlign: 'center' }}>确认删除此单?</div>
                </div>
            </div>,
            onConfirm: async () => {
                const params = {
                    req: {
                        serviceId: 'DCP_POrderDelete',
                        request: {
                            porderNo,
                        },
                    }
                }
                try {
                    const result = await orderStatusUpdate(params.req)
                    if (result.success) {
                        Toast.show('删除成功')
                    } else {
                        Toast.show('删除失败')
                    }
                } catch (error) {
                    Toast.show(error)
                } finally {
                    doSearch()
                }


            },
        })
    }
    //模板要货弹框确定回调
    const modelEnsure = () => {
        if (modelRequestInfo.modelTemplateNo == '') {
            Toast.show('请选择模板!');
            return
        }
        navigate('/templateDetail', {
            state: {
                from: 'p_order'
            }
        })
    }
    //弹框需求日期调整触发的回调
    const modelRequestDateChange = (value) => {
        setModelRequestInfo({
            ...modelRequestInfo,
            modelRequestDate: dayjs(value).format('YYYY-MM-DD')
        })
        sessionStorage.setItem('modelRequestDate', JSON.stringify(dayjs(value).format('YYYY-MM-DD')))
    }
    //备注改变触发的回调
    // const handleMemoChange = (value) => {
    //     setModelRequestInfo({
    //         ...modelRequestInfo,
    //         memo: value
    //     })
    // }
    //弹框选择模板
    const chooseTemplate = () => {
        navigate('/templateChoose')
    }
    useEffect(() => {
        dispatch(setMenuPower("SCM0210"))
    }, [])
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setPorderList([])
        setHasMore(true)
        setPageNumber(1)
    }, [activeKey])
    return <>
        <NavBar right={right} onBack={back}>
            要货单
        </NavBar>
        <div className="searchCondition">
            <div className="downCondition padding10 fontSize15" onClick={() => { setDateTypeSelectIsShow(true) }}>
                {dateTypeMap[dateType]}
                {dateTypeSelectIsShow == true ? <UpOutline className="marginLeft3" /> : <DownOutline className="marginLeft3" />}
            </div>
            <div className="flexCenter padding10 fontSize15" style={{ flex: 1 }} onClick={() => { setVisible(true) }}>
                <CalendarOutline className="marginRight3" />
                <p>{startDateShow}<span className="marginLeft3 marginRight3">{'至'}</span>  {endDateShow}</p>
            </div>

            <Picker
                columns={basicColumns}
                visible={dateTypeSelectIsShow}
                onClose={() => {
                    setDateTypeSelectIsShow(false);
                }}
                value={selectedOption}
                onConfirm={v => {
                    setSelectedOption(v)
                    setDateType(v[0])
                    doSearch()
                }}
            />

            <CalendarPicker
                visible={visible}
                defaultValue={defaultRange}
                selectionMode='range'
                onClose={() => setVisible(false)}
                onMaskClick={() => setVisible(false)}
                onChange={val => {
                    setStartDateShow(dayjs(val[0]).format('YYYY-MM-DD'));
                    setEndDateShow(dayjs(val[1]).format('YYYY-MM-DD'));
                    doSearch()
                }}
                max={maxDate}
                min={minDate}
            />
        </div>
        <Tabs activeKey={activeKey} onChange={handleChange}>
            <Tabs.Tab
                title={
                    <Badge content={totalRecords} style={{ '--right': '-10px', '--top': '8px' }}>
                        新增
                    </Badge>
                }
                key='add'>
                <SearchBar value={keyTxt} placeholder='请输入内容' onSearch={doSearch} onChange={keyTxtChange} />
                <List>
                    {porderList.map(item => {
                        return <List.Item key={item.porderNo}>
                            <OrderListItem power={ModularPower} billInfo={item}
                                confirm={confirm} handleDelete={handleDelete}
                            ></OrderListItem>
                        </List.Item>
                    })
                    }
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </Tabs.Tab>
            <Tabs.Tab title='已提交' key='submit'>
                <SearchBar value={keyTxt} placeholder='请输入内容' onSearch={doSearch} onChange={keyTxtChange} />
                <List>
                    {porderList.map(item => {
                        return <List.Item key={item.porderNo}>
                            <OrderListItem power={ModularPower} billInfo={item}
                                confirm={confirm} handleDelete={handleDelete}
                            ></OrderListItem>
                        </List.Item>
                    })
                    }
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />

            </Tabs.Tab>
            <Tabs.Tab title='已审核' key='check'>
                <SearchBar value={keyTxt} placeholder='请输入内容' onSearch={doSearch} onChange={keyTxtChange} />
                <List>
                    {porderList.map(item => {
                        return <List.Item key={item.porderNo}>
                            <OrderListItem power={ModularPower} billInfo={item}
                                confirm={confirm} handleDelete={handleDelete}
                            ></OrderListItem>
                        </List.Item>
                    })
                    }
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />

            </Tabs.Tab>
            <Tabs.Tab title='已结案' key='settle'>
                <SearchBar value={keyTxt} placeholder='请输入内容' onSearch={doSearch} onChange={keyTxtChange} />
                <List>
                    {porderList.map(item => {
                        return <List.Item key={item.porderNo}>
                            <OrderListItem power={ModularPower} billInfo={item}
                                confirm={confirm} handleDelete={handleDelete}
                            ></OrderListItem>
                        </List.Item>
                    })
                    }
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </Tabs.Tab>
            <Tabs.Tab title='已作废' key='fail'>
                <SearchBar value={keyTxt} placeholder='请输入内容' onSearch={doSearch} onChange={keyTxtChange} />
                <List>
                    {porderList.map(item => {
                        return <List.Item key={item.porderNo}>
                            <OrderListItem power={ModularPower} billInfo={item}
                                confirm={confirm} handleDelete={handleDelete}
                            ></OrderListItem>
                        </List.Item>
                    })
                    }
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </Tabs.Tab>
            <Tabs.Tab title='已驳回' key='reject'>
                <SearchBar value={keyTxt} placeholder='请输入内容' onSearch={doSearch} onChange={keyTxtChange} />
                <List>
                    {porderList.map(item => {
                        return <List.Item key={item.porderNo}>
                            <OrderListItem power={ModularPower} billInfo={item}
                                confirm={confirm} handleDelete={handleDelete}
                            ></OrderListItem>
                        </List.Item>
                    })
                    }
                </List>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
            </Tabs.Tab>
        </Tabs>
        <CenterPopup
            visible={modelVisible}
            onMaskClick={() => {
                setModelVisible(false)
            }}
            style={{ '--min-width': '90vw' }}
        >
            <div className="padding10">
                <div className="flexCenter fontSize18 fontbold padding10 marginBottom10">
                    新增要货单
                </div>
                <List>
                    <List.Item extra={modelRequestInfo.modelTemplateName === '' ? '请选择(必选)' : modelRequestInfo.modelTemplateName} clickable onClick={chooseTemplate}>
                        <span className="fontbold fontSize18">
                            要货模板
                        </span>
                    </List.Item>
                    <List.Item extra={modelRequestInfo.modelRequestDate} clickable onClick={() => { setModelRequestDateShow(true) }}>
                        <span className="fontbold fontSize18">
                            需求日期
                        </span>
                    </List.Item>
                    {/* <List.Item extra={<Input
                        placeholder='备注'
                        style={{ '--text-align': 'right' }}
                        clearable
                        value={modelRequestInfo.memo}
                        onChange={(value) => { handleMemoChange(value) }}
                    />} clickable >
                        <span className="fontbold fontSize18">
                            备注
                        </span>
                    </List.Item> */}

                </List>
                <div className="marginTop">
                    <Space justify='center' block style={{ '--gap': '64px' }}>
                        <Button shape='default' onClick={() => {
                            setModelVisible(false);
                            setModelRequestInfo({
                                modelTemplateNo: '',
                                modelTemplateName: '',
                                modelRequestDate: defaultRangeEnd.format('YYYY-MM-DD'),
                                // memo: ''
                            })
                            sessionStorage.removeItem('modelRequestDate')
                            sessionStorage.removeItem('selectedTemplateInfo')
                        }}>取消</Button>
                        <Button shape='default' color='primary' onClick={modelEnsure}>确定</Button>
                    </Space>

                </div>
            </div>
            <CalendarPicker
                min={minRequestDate}
                max={maxRequestDate}
                defaultValue={modelRequestInfo.modelRequestDate}
                selectionMode='single'
                visible={modelRequestDateShow}
                onClose={() => setModelRequestDateShow(false)}
                onMaskClick={() => setModelRequestDateShow(false)}
                onChange={modelRequestDateChange}
            />
        </CenterPopup>


    </>
}