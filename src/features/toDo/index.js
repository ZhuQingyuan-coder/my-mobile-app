import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toDoRequest from '../../api/toDo/todo'
// 1. 初始状态
const initialState = {
    value: JSON.parse(sessionStorage.getItem('toDoList')) || [],//待办数据信息
    status: 'idle',  //异步状态(idle/loading/succeeded/failed)
    filterResult: {}
};

const ToDoListSlice = createSlice({
    name: 'toDo',//slice名称（作为action类型的命名空间，避免冲突）
    initialState,
    reducers: {
        //不可以写基于返回数据的再处理方法
    },
    extraReducers: (builder) => {  //处理「非本slice生成的action」（如异步action）
        builder.addCase(getToDoList.pending, (state) => { state.status = 'loading' });
        builder.addCase(getToDoList.fulfilled, (state, action) => {
            const {response,toDolistData} = action.payload
            state.value = response.data;
            state.status = 'succeeded';
            console.log(response,'response.data')
            state.filterResult = response.data.filter(item => {
                return toDolistData.findIndex((i => item.proName == i)) != -1;
            }).reduce((acc, cur) => {
                acc[cur.proName] = cur.qty
                return acc
            }, {})
        });
        builder.addCase(getToDoList.rejected, (state) => { state.status = 'failed' });
    }
})

// 3. 异步Thunk（处理异步逻辑，如API请求）
export const getToDoList = createAsyncThunk(//thunk中可以直接处理数据，比如过滤?这样最终我们需要的数据格式就在组件中直接拿即可
    'toDo/getToDoList',  // action类型前缀（格式：slice名/自定义名）
    async (params) => {          // 异步逻辑函数（返回一个Promise）
        const response = await toDoRequest(params.req); // 模拟API请求
        return {
            response,
            toDolistData:params.toDolistData
        }; // 返回值会作为action.payload传给reducer
    }
);

// 4. 导出自动生成的action creators（供组件dispatch用）
//export const {filterListFn} = ToDoListSlice.actions;

// 5. 导出选择器（从state中提取数据的纯函数，类似组件的computed属性）
export const selectToDoList = state => state.toDo.value;
export const selectStatus = state => state.toDo.status; // 提取异步状态
export const selectfilterResult = state => state.toDo.filterResult; // 提取异步状态

// 6. 导出reducer（供store注册用）
export default ToDoListSlice.reducer;