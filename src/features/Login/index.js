import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import loginRequest from '../../api/login/login';
import { orgInfoRequset } from '../../api/login/login';
import changeShopRequset from '../../api/changeShop/changeShop'
import { Toast, Modal } from 'antd-mobile';
//获取对应modularNo的菜单权限
const getTabPower = (powerArr,modularNo)=>{
    for(let element of powerArr){
        if(element.modularNo === modularNo){
            return element;
        }
        if(element.children && Array.isArray(element.children)){
            const childResult = getTabPower(element.children,modularNo)
            if (childResult) return childResult;
        }
    }
}
const getModularPower = (powerArr,modularNo)=>{
    let myPower = {};
    myPower = getTabPower(powerArr,modularNo).datas.reduce((acc,cur)=>{
        acc[cur['proName']] = true
        return acc
    },{})
    return myPower
}
// 1. 初始状态
const initialState = {
    value: JSON.parse(sessionStorage.getItem('loginInfo')) || {},//登录信息
    token: JSON.parse(sessionStorage.getItem('token')) || '',
    power: JSON.parse(sessionStorage.getItem('power')) || [],
    shops: JSON.parse(sessionStorage.getItem('shops')) || [],
    orgInfo: JSON.parse(sessionStorage.getItem('orgInfo')) || {},
    modularPower: JSON.parse(sessionStorage.getItem('modularPower'))||{},
    status: 'idle',  //异步状态(idle/loading/succeeded/failed)
    getLoginDataStatus: 'idle',
    getOrgDataStatus: 'idle',
    changeLoginDataStatus: 'idle'
};

const loginSlice = createSlice({
    name: 'login',//slice名称（作为action类型的命名空间，避免冲突）
    initialState,
    reducers: {
        outLogin: (state) => {
            sessionStorage.clear()
            state.value = {};
            state.token = '';
            state.power = [];
            state.shops = [];
            state.status = 'idle';
            
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setMenuPower:(state, action)=>{
            const power = JSON.parse(sessionStorage.getItem('power'))
            state.modularPower = getModularPower(power,action.payload)
            sessionStorage.setItem('modularPower',JSON.stringify(state.modularPower))
        }
    },
    extraReducers: (builder) => {  //处理「非本slice生成的action」（如异步action）
        builder.addCase(getLoginData.pending, (state) => { state.getLoginDataStatus = 'loading'; });
        builder.addCase(getLoginData.fulfilled, (state, action) => {
            console.log(action.payload,'action.payload')
            state.value = action.payload.data[0];
            state.power = action.payload.data[0].myPower;
            state.shops = action.payload.data[0].myShops;
            state.token = action.payload.token;
            state.getLoginDataStatus = 'succeeded';
            sessionStorage.setItem('loginInfo', JSON.stringify(action.payload.data[0]));
            sessionStorage.setItem('token', JSON.stringify(action.payload.token));
            sessionStorage.setItem('power', JSON.stringify(action.payload.data[0].myPower));
            sessionStorage.setItem('shops', JSON.stringify(action.payload.data[0].myShops));
        });
        builder.addCase(getLoginData.rejected, (state) => { state.getLoginDataStatus = 'failed' });
        //orgInfo
        builder.addCase(getOrgData.pending, (state) => { state.getOrgDataStatus = 'loading' });
        builder.addCase(getOrgData.fulfilled, (state, action) => {
            const { response, organizationNo } = action.payload
            console.log(response, 'response.data')
            state.orgInfo = response.data.filter(item => {
                return item.organizationNo == organizationNo
            })[0]
            sessionStorage.setItem('orgInfo', JSON.stringify(state.orgInfo))
            state.getOrgDataStatus = 'succeeded';
        });
        builder.addCase(getOrgData.rejected, (state) => { state.getOrgDataStatus = 'failed' });
        //changeLoginData
        builder.addCase(changeLoginData.pending, (state) => { state.changeLoginDataStatus = 'loading'; Toast.show({ content: '切换中...', maskClickable: false, icon: 'loading' }) });
        builder.addCase(changeLoginData.fulfilled, (state, action) => {
            const { response } = action.payload
            if (response.success == true) {
                console.log(response, 'res')
                state.value = response.data[0];
                state.power = response.data[0].myPower;
                state.shops = response.data[0].myShops;
                state.token = response.token;
                sessionStorage.setItem('token', JSON.stringify(response.token));
                sessionStorage.setItem('loginInfo', JSON.stringify(response.data[0]));
                sessionStorage.setItem('power', JSON.stringify(response.data[0].myPower));
                sessionStorage.setItem('shops', JSON.stringify(response.data[0].myShops));
                state.changeLoginDataStatus = 'succeeded';
            }
        });
        builder.addCase(changeLoginData.rejected, (state) => { state.changeLoginDataStatus = 'failed'; Toast.show({ content: '切换失败!', icon: 'fail' }) });

    }
})

// 3. 异步Thunk（处理异步逻辑，如API请求）
export const getLoginData = createAsyncThunk(//
    'login/getLoginData',  // action类型前缀（格式：slice名/自定义名）
    async (data) => {      // 异步逻辑函数（返回一个Promise）
        try {
            const response = await loginRequest(data); // 模拟API请求
            return response; // 返回值会作为action.payload传给reducer
        } catch (error) {
            Toast.show('登录失败!')
        }

    }
);
export const getOrgData = createAsyncThunk(//
    'login/getOrgData',  // action类型前缀（格式：slice名/自定义名）
    async (params) => {      // 异步逻辑函数（返回一个Promise）
        try {
            const response = await orgInfoRequset(params.req); // 模拟API请求
            return {
                response,
                organizationNo: params.organizationNo
            }; // 返回值会作为action.payload传给reducer
        } catch (error) {
            Toast.show(error)
        }

    }
);
export const changeLoginData = createAsyncThunk(//
    'login/changeLoginData',  // action类型前缀（格式：slice名/自定义名）
    async (params) => {      // 异步逻辑函数（返回一个Promise）
        try {
            const response = await changeShopRequset(params.req); // 模拟API请求
            if (!response.success) {
                Toast.show(response.serviceDescription)
            }
            return { response } // 返回值会作为action.payload传给reducer
        } catch (error) {
            Toast.show(error)
        }

    }
);
// 4. 导出自动生成的action creators（供组件dispatch用）
export const { outLogin, setToken,setMenuPower } = loginSlice.actions;

// 5. 导出选择器（从state中提取数据的纯函数，类似组件的computed属性）
export const selectLoginData = state => state.login.value;
export const selectGetLoginDataStatus = state => state.login.getLoginDataStatus; // 提取异步状态
export const selectGetOrgDataStatus = state => state.login.getOrgDataStatus; // 提取异步状态
export const selectChangeLoginDataStatus = state => state.login.changeLoginDataStatus; // 提取异步状态
export const selectToken = state => state.login.token;
export const selectPower = state => state.login.power;
export const selectShops = state => state.login.shops;
export const selectOrgInfo = state => state.login.orgInfo;
export const selectModularPower = state => state.login.modularPower;

// 6. 导出reducer（供store注册用）
export default loginSlice.reducer;
