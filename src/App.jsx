import router from './router/index.jsx'
import { RouterProvider } from 'react-router-dom'
import store from './app/store.js'; // 导入创建的store
import { Provider } from 'react-redux'; // 导入Provider组件
function App() {
  return <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>
}

export default App
