import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import shopListRequset from '../../api/shopList/shopList';
// 1. 初始状态
const initialState = {
    value: JSON.parse(sessionStorage.getItem('shopList'))|| [],//能够访问的门店列表
    status: 'idle',  //异步状态(idle/loading/succeeded/failed)
    //searchShopListResult:[]
};

const shopListSlice = createSlice({
    name: 'shopList',//slice名称（作为action类型的命名空间，避免冲突）
    initialState,
    reducers: {
        //不可以写立刻基于返回数据的再处理方法
        
    },
    extraReducers: (builder) => {  //处理「非本slice生成的action」（如异步action）
        builder.addCase(getShopList.pending, (state) => { state.status = 'loading' });
        builder.addCase(getShopList.fulfilled, (state, action) => {
            const {response} = action.payload
            console.log('response.data',response.data)
            state.value = response.data.reduce((acc,cur)=>{
                acc = [...acc,...cur.children]
                return acc
            },[]);
            sessionStorage.setItem('shopList',JSON.stringify(state.value))
            state.status = 'succeeded';
        });
        builder.addCase(getShopList.rejected, (state) => { state.status = 'failed' });
    }
})

// 3. 异步Thunk（处理异步逻辑，如API请求）
export const getShopList = createAsyncThunk(//thunk中可以直接处理数据，比如过滤?这样最终我们需要的数据格式就在组件中直接拿即可
    'shopList/getShopList',  // action类型前缀（格式：slice名/自定义名）
    async (params) => {          // 异步逻辑函数（返回一个Promise）
        const response = await shopListRequset(params.req); // 模拟API请求
        return {
            response
        }; // 返回值会作为action.payload传给reducer
    }
);

// 4. 导出自动生成的action creators（供组件dispatch用）
//export const {filterShopList} = shopListSlice.actions;

// 5. 导出选择器（从state中提取数据的纯函数，类似组件的computed属性）
export const selectShopList = state => state.shopList.value;
export const selectStatus = state => state.shopList.status; // 提取异步状态
//export const selectNowSelectedShopId = state => state.shopList.nowSelectedShopId;
// 6. 导出reducer（供store注册用）
export default shopListSlice.reducer;