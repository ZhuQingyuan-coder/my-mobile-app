import { useEffect, useState } from "react";
import { useLocation,useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalOutline, KeyOutline, SearchOutline, UserOutline, CloseCircleFill } from 'antd-mobile-icons';
import { Space, Button, Toast } from "antd-mobile";
import md5 from 'blueimp-md5'; // 导入MD5函数
import { selectLoginData, selectGetLoginDataStatus, getLoginData, getOrgData } from '../../features/Login/index';// 导入action creators和选择器
import loginSvg from "../../assets/react.svg"
import "./index.less"
export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginData = useSelector(selectLoginData);
    const getLoginDataStatus = useSelector(selectGetLoginDataStatus);
    const [clearPasswordFlag, setClearPasswordFlag] = useState(false)
    const location = useLocation();
    const state = location.state;
    const [loginInfo, setLoginInfo] = useState({
        enterpriseNum: state?.enterpriseNum || '',
        account: state?.account || '',
        password: state?.password || ''
    });
    const orglevReq = {
        serviceId: 'DCP_OrglevQuery',
        request: {
            keyTxt: loginData.shopId,
            status: '100'
        }
    }
    const orglevParams = {
        req: orglevReq,
        organizationNo: loginData.shopId
    }
    useEffect(() => {
        if (loginInfo.password != '') {
            setClearPasswordFlag(true)
        } else {
            setClearPasswordFlag(false)
        }
    }, [loginInfo.password])
    useEffect(() => {
        if (getLoginDataStatus == 'succeeded' && JSON.parse(sessionStorage.getItem('loginInfo'))) {//&& JSON.parse(sessionStorage.getItem('loginInfo')) 防止刷新丢失redux之后在登录状态的情况下主动向login页面跳转
            const historyLoginInfo = JSON.parse(localStorage.getItem('historyLoginInfo')) || []
            if (historyLoginInfo.findIndex(item => { return item.accountName == loginData.employeeName }) == -1 && loginData.employeeName) {
                historyLoginInfo.push({ ...loginInfo, accountName: loginData.employeeName })
            }
            localStorage.setItem('historyLoginInfo', JSON.stringify(historyLoginInfo))//保存历史登录信息，方便下次登录
            sessionStorage.setItem('loginInfo', JSON.stringify(loginData))//保存本次登录信息
            dispatch(getOrgData(orglevParams))
            navigate('/menu')
        }
    }, [getLoginDataStatus])
    function onChange(e) {//填写账号和密码触发的回调
        setLoginInfo({
            ...loginInfo,
            [e.target.name]: e.target.value
        })
    }
    function handleClearPassword() {
        setLoginInfo({
            ...loginInfo,
            password: ''
        })
    }
    function handleClick() {
        navigate({
            pathname: "/loginHistory",
        })
    }
    function handleLogin() {
        //校验
        if (!(loginInfo.enterpriseNum && loginInfo.account && loginInfo.password)) {
            Toast.show("请输入账号和密码！")
            return
        }
        //定义参数
        const req = {
            serviceId: 'DCP_LoginRetail',
            request: {
                eId: loginInfo.enterpriseNum,
                opNo: loginInfo.account,
                password: md5(loginInfo.account + loginInfo.password),
                langType: 'zh_CN',
                loginType: '2'
            }
        }
        //发送请求，成功再跳转
        dispatch(getLoginData(req))
    }
    return (
        <>
            <div className="backgroundContent">
                <div className="title">
                    <img src={loginSvg} width="100px" height="100px" />
                    <div className="titleContent">登录</div>
                    <p style={{ color: '#55535E', marginTop: 20 }}>欢迎回来!</p>
                </div>
                <div className="form">
                    <div className="formItem">
                        <p style={{ color: '#55535E' }}>企业编码</p>
                        <div className="loginInput">
                            <Space wrap style={{ fontSize: 24 }}>
                                <GlobalOutline color='var(--adm-color-primary)' />
                            </Space>
                            <input placeholder="请输入企业编码" value={loginInfo.enterpriseNum} onChange={onChange} name="enterpriseNum" autoComplete="off" />
                        </div>
                    </div>
                    <div className="formItem">
                        <p style={{ color: '#55535E' }}>账号</p>
                        <div className="loginInput">
                            <Space wrap style={{ fontSize: 24 }}>
                                <UserOutline color='var(--adm-color-primary)' />
                            </Space>
                            <input placeholder="请输入账号" value={loginInfo.account} onChange={onChange} name="account" autoComplete="off" />
                            <Space wrap style={{ fontSize: 20 }}>
                                <SearchOutline color='var(#d9d9d9)' onClick={handleClick} />
                            </Space>
                        </div>
                    </div>
                    <div className="formItem">
                        <p style={{ color: '#55535E' }}>密码</p>
                        <div className="loginInput">
                            <Space wrap style={{ fontSize: 24 }}>
                                <KeyOutline color='var(--adm-color-primary)' />
                            </Space>
                            <form style={{width:'100%'}}>
                                <input type="password" placeholder="请输入密码" value={loginInfo.password} onChange={onChange} name="password" autoComplete="off" />
                            </form>
                            {
                                clearPasswordFlag && (
                                    <Space wrap style={{ fontSize: 20 }}>
                                        <CloseCircleFill color='var(#d9d9d9)' onClick={handleClearPassword} />
                                    </Space>
                                )
                            }
                        </div>
                    </div>
                    <div className="formFoot">
                        <Button block color='primary' size='large'
                            style={{ '--border-radius': '18px', height: 60 }}
                            onClick={handleLogin}
                        >
                            登录
                        </Button>
                    </div>
                </div>

            </div>
        </>


    )
}