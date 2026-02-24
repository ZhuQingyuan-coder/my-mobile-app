import { useSelector } from "react-redux"
import { selectPower } from "../../features/Login"
import { Grid,NavBar } from "antd-mobile"
import { useNavigate } from "react-router-dom"
export default function Application() {
    const supplyCenterModule = []
    const navigate= useNavigate()
    const supplyCenterModuleModularNo = new Set(['SCM02', 'SCM0603', 'SCM0604', 'SCM0602', 'SCM0601'])
        const supplyCenterModuleAll = useSelector(selectPower).filter(item => {
        return item.modularNo == 'SCM'
    })[0].children
    const wordMap = {
        //要货管理
        '100501': <span className="iconfont icon-jurassic_add-template" style={{ color: '#1677FF', fontSize: 24 }} ></span>,
        'SCM0210': <span className="iconfont icon-yaohuomingxi" style={{ color: '#F19353', fontSize: 24 }} ></span>,
        '120123': <span className="iconfont icon-jiandushenhe-56" style={{ color: '#A61D28', fontSize: 24 }} ></span>,
        '120124': <span className="iconfont icon-shenqing" style={{ color: '#539af1', fontSize: 24 }} ></span>,
        '120125': <span className="iconfont icon-jihuachulizhong" style={{ color: '#FFAC3E', fontSize: 24 }} ></span>,
        'SCM0417': <span className="iconfont icon-xinyongshensu" style={{ color: '#6D829A', fontSize: 24 }} ></span>,
        'SCM0421': <span className="iconfont icon-tuihuodan" style={{ color: '#FB6F5C', fontSize: 24 }} ></span>,
        'SCM0422': <span className="iconfont icon-tuihuoshenqing" style={{ color: '#3DD5BB', fontSize: 24 }} ></span>,
        //库存管理
        'SCM060308': <span className="iconfont icon-kucuntiaozheng1" style={{ color: '#79A9FB', fontSize: 24 }} ></span>,
        'SCM060309': <span className="iconfont icon-yingjianzuhe-zuoyexitong" style={{ fontSize: 24 }} ></span>,
        'SCM060310': <span className="iconfont icon-chaijie" style={{ color: '#FF9933', fontSize: 24 }} ></span>,
        //出库管理
        "SCM0505": <span className="iconfont icon-ccgl-diaobochuku-8" style={{  fontSize: 24 }} ></span>,
        "SCM0414": <span className="iconfont icon-caituichuku" style={{ color: '#005EFF', fontSize: 24 }} ></span>,
        "120129": <span className="iconfont icon-chuku" style={{ color: '#666666', fontSize: 24 }} ></span>,
        "SCM060201": <span className="iconfont icon-chuku" style={{ color: '#F6BF26', fontSize: 24 }} ></span>,
        "SCM060202": <span className="iconfont icon-tiaobochuku2" style={{ color: '#FF7300', fontSize: 24 }} ></span>,
        //入库管理
        "SCM0408": <span className="iconfont icon-caigoushouhuo" style={{ color: '#666666', fontSize: 24 }} ></span>,
        'SCM0410': <span className="iconfont icon-caigouruku1" style={{ color: '#3FA9F5', fontSize: 24 }} ></span>,
        "SCM0411": <span className="iconfont icon-zhijian" style={{ color: '#F43451', fontSize: 24 }} ></span>,
        "SCM0407": <span className="iconfont icon-rukuguanli" style={{ color: '#207DFF', fontSize: 24 }} ></span>,
        "SCM0409": <span className="iconfont icon-caigouruku" style={{ color: '#77A8FF', fontSize: 24 }} ></span>,
        "120128": <span className="iconfont icon-ruku2" style={{ color: '#D81E06', fontSize: 24 }} ></span>,
        "SCM0507": <span className="iconfont icon-dingdanwuliaocaigouruku" style={{ color: '#1677FF', fontSize: 24 }} ></span>,
        "SCM060101": <span className="iconfont icon-ruku2" style={{ color: '#F75A53', fontSize: 24 }} ></span>,
        "SCM060102": <span className="iconfont icon-ruku2" style={{ color: '#CCDAFF', fontSize: 24 }} ></span>,
        //库存盘点
        "100503": <span className="iconfont icon-pandianmoban" style={{  fontSize: 24 }} ></span>,
        "120206": <span className="iconfont icon-pandianjihua" style={{ color: '#EC5CA9', fontSize: 24 }} ></span>,
        "SCM060401": <span className="iconfont icon-kucunpandian1" style={{ color: '#3FB583', fontSize: 24 }} ></span>,
        "SCM060402": <span className="iconfont icon-pandianjihua1" style={{ color: '#1677FF', fontSize: 24 }} ></span>,
        "SCM060403": <span className="iconfont icon-tubiao-yuan-" style={{ color: '#4F91EB', fontSize: 24 }} ></span>,
        "SCM060404": <span className="iconfont icon-kucunpandian2" style={{ color: '#2CD09F', fontSize: 24 }} ></span>,
        'SCM060405': <span className="iconfont icon-suijichoucha" style={{ color: '#A190F7', fontSize: 24 }} ></span>,
    }
    supplyCenterModuleAll.forEach((item, index, arr) => {
        if (supplyCenterModuleModularNo.has(item.modularNo)) {
            supplyCenterModule.push(item)
        }
    })
    const handleClick=(proName)=>{
        navigate(`/${proName}`)
    }

    return <>
        <div style={{textAlign:'center',paddingTop:'10px',paddingBottom:'10px'}} className="fontSize18">应用</div>
        <div className="grayBackgroundColor" style={{paddingTop:10,paddingBottom:80}}>
            {supplyCenterModule.map(item => {
                return (
                    <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: 10 }} className="marginLeft10 marginRight10 marginBottom10" key={item.modularNo}>
                        <p className="fontSize15 fontbold">{item.modularName}</p>
                        <Grid columns={4} >
                            {
                                item.children.map((i) => {
                                    if (wordMap[i.modularNo]) {
                                        return <Grid.Item key={i.modularNo}>
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px',paddingLeft:0,paddingRight:0 }}
                                                onClick={()=>handleClick(i.proName)}
                                            >
                                                {wordMap[i.modularNo]}
                                                <p className="fontSize12 marginTop">{i.modularName}</p>
                                            </div>
                                        </Grid.Item>
                                    }
                                })
                            }

                        </Grid>
                    </div>
                )
            })}

        </div>
    </>
}