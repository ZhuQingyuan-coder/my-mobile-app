
import { useNavigate,useLocation} from "react-router-dom"
import {NavBar,Space} from 'antd-mobile'
import { useEffect, useState } from "react"
import templateListRequset from "../../api/templateList"
import dayjs from "dayjs"
export default function TemplateChoose(){
    const navigate = useNavigate()
    const location = useLocation()
    const [templateName,settemplateName] = useState('')
    const [templateNo,settemplateNo] = useState('')
    const [templateList,setTemplateList] = useState([])
    const back = ()=>{
        navigate('/p_order',{state:{from: location.pathname,templateName,templateNo}})
    }
    const getTemplateRequset = async ()=>{
        const params = {
            req:{
                serviceId:'DCP_PTemplateQuery',
                request:{
                    docType:'0',
                    getType:'1'
                },
                pageNumber:1,
                pageSize:999
            }
        }
        const {data} = await templateListRequset(params.req)
        setTemplateList(data)
    }
    const handleClick = (templateInfo,requestDate)=>{
        sessionStorage.setItem('modelRequestDate',JSON.stringify(requestDate))
        sessionStorage.setItem('selectedTemplateInfo',JSON.stringify(templateInfo))
        navigate('/p_order',{state:{from: location.pathname,templateName:templateInfo.pTemplateName,templateNo:templateInfo.pTemplateNo}})
    }
    useEffect(()=>{
        getTemplateRequset()
    },[])
    return <>
        <NavBar onBack={back}>模板选择</NavBar>
        <div className="grayBackgroundColor fullScreen padding10">
            <div >
                {templateList.map(item=>{
                return <TemplateItem templateInfo={item} key={item.pTemplateNo} handleClick={handleClick}></TemplateItem>
                })}
            </div>
        </div>
    </>
}

function TemplateItem({templateInfo,handleClick}){
    const {pTemplateNo,pTemplateName,optionalTime,preDay} = templateInfo
    const requestDate = dayjs().add(Number(preDay), 'day').format('YYYY-MM-DD')
    return <>
        <div style={{display:'flex',backgroundColor:'white'}} className="marginBottom10" onClick={()=>{handleClick(templateInfo,requestDate)}}>
            <div className="padding20 flexCenter">
                <span className="iconfont icon-moban" style={{ color: '#1677FF', fontSize: 24 }} ></span>
            </div>
            <div style={{flex:1}} className="padding10">
                <div className="fontSize15 fontbold">
                    {pTemplateName}
                </div>
                <div className="fontColorGary">
                    模板编号: {pTemplateNo}
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}} className="fontColorGary">
                    <div>
                        需求日期: {requestDate}
                    </div>
                    <div>
                        截止时间: {optionalTime.slice(0,2) + ':' +optionalTime.slice(2,4) + ':' + optionalTime.slice(4,6) }
                    </div>
                </div>
            </div>
        </div>
    </>
}