import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import porderListRequset from '../../api/porderList';
// 1. 初始状态
const initialState = {
    value: [],//单据信息
    hasMore: true,//是否还有更多
    refreshStatus: 'idle',  //异步状态(idle/loading/succeeded/failed)
    loadStatus: 'idle',
};

const porderListSlice = createSlice({
    name: 'porderList',//slice名称（作为action类型的命名空间，避免冲突）
    initialState,
    reducers: {
        //不可以写基于返回数据的再处理方法
        setValue:(state)=>{
            state.value = []
            state.hasMore = true
        }
    },
    extraReducers: (builder) => {  //处理「非本slice生成的action」（如异步action）
        builder.addCase(getPorderList.pending, (state) => { state.loadStatus = 'loading' });
        builder.addCase(getPorderList.fulfilled, (state, action) => {
            const { response } = action.payload
            console.log(response,'response')
            if (response.data.length > 0) {
                state.value = state.value.concat(response.data);
                state.hasMore = true
            } else {
                state.hasMore = false
            }


            state.loadStatus = 'succeeded';
        });
        builder.addCase(getPorderList.rejected, (state) => { state.loadStatus = 'failed' });
        //refresh
        builder.addCase(refreshPorderList.pending, (state) => { state.refreshStatus = 'loading' });
        builder.addCase(refreshPorderList.fulfilled, (state, action) => {
            const { response } = action.payload
            state.value = response.data;
            state.refreshStatus = 'succeeded';
        });
        builder.addCase(refreshPorderList.rejected, (state) => { state.refreshStatus = 'failed' });
    }
})

// 3. 异步Thunk（处理异步逻辑，如API请求）
export const getPorderList = createAsyncThunk(//thunk中可以直接处理数据，比如过滤?这样最终我们需要的数据格式就在组件中直接拿即可
    'porderList/getPorderList',  // action类型前缀（格式：slice名/自定义名）
    async (params) => {          // 异步逻辑函数（返回一个Promise）
        const response = await porderListRequset(params.req); // 模拟API请求
        return {
            response,
        }; // 返回值会作为action.payload传给reducer
    }
);
export const refreshPorderList = createAsyncThunk(//thunk中可以直接处理数据，比如过滤?这样最终我们需要的数据格式就在组件中直接拿即可
    'porderList/refreshPorderList',  // action类型前缀（格式：slice名/自定义名）
    async (params) => {          // 异步逻辑函数（返回一个Promise）
        const response = await porderListRequset(params.req); // 模拟API请求
        return {
            response,
        }; // 返回值会作为action.payload传给reducer
    }
);
// 4. 导出自动生成的action creators（供组件dispatch用）
export const {setValue} = porderListSlice.actions;

// 5. 导出选择器（从state中提取数据的纯函数，类似组件的computed属性）
export const selectPorderList = state => state.porderList.value;
export const selectLoadStatus = state => state.porderList.loadStatus; // 提取异步状态
export const selectRefreshStatus = state => state.porderList.refreshStatus; // 提取异步状态
export const selectHasMore = state => state.porderList.hasMore
// 6. 导出reducer（供store注册用）
export default porderListSlice.reducer;