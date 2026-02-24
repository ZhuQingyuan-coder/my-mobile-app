import { NavBar, SearchBar, List } from 'antd-mobile'
import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
export default function LoginHistory() {
    const navigate = useNavigate()
    const [keyWord, setKeyWord] = useState('')
    
    const storage = JSON.parse(localStorage.getItem('historyLoginInfo'))||[]
    
    let loginAccountHistory = storage || []
    if(storage.length > 0){
        
        loginAccountHistory = fuzzySearch(storage,keyWord)
    }
    function fuzzySearch(items, searchTerm) {
        const term = searchTerm.toLowerCase();
        return items.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(term)
            )
        );
    }
    const back = () => {
        navigate('/')
    }
    const handleClick = (item) => {
        navigate('/', {
            state: {
                enterpriseNum:item.enterpriseNum,
                account: item.account,
                password: item.password

            }
        })
    }
    const handleChange = (value) => {
        setKeyWord(value)
    }
    return <>
        <div>
            <NavBar onBack={back}>
                <SearchBar value={keyWord} placeholder='请输入员工编码、名称搜索' onChange={(value) => { handleChange(value) }} />
            </NavBar>
            <List header='最近登录' mode={'card'}>
                {loginAccountHistory.map((item, index) => {
                    return (
                        <List.Item onClick={() => { handleClick(item) }} description={item.account} clickable key={item.account}>
                            {item.accountName}
                        </List.Item>
                    )
                })}

            </List>
        </div>
    </>
}