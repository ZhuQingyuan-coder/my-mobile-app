import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../features/Login/index';
import toDoReducer from '../features/toDo/index';
import shopListReducer from '../features/shopList/index'
import porderListReducer from '../features/Porder/index'
export default configureStore({
  reducer: {
    login: loginReducer, // 注册slice的reducer
    toDo: toDoReducer,
    shopList:shopListReducer,
    porderList:porderListReducer
  },
});

