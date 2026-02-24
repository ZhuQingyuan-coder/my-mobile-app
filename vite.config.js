import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssPxToViewport from 'postcss-px-to-viewport';

export default defineConfig({
  plugins: [react({
      // 启用编译器
      compiler: {
        target: '18',
      },
      babel: {
        plugins: [
          // 必须添加 React Compiler 插件
          ['react-compiler', { target: '18' }]
        ]
      }
    }
  
  )],
    server: {
    host: '0.0.0.0', // 关键
    port: 5173, // Vite默认端口
    strictPort: false // 端口冲突时自动切换
  },
  css: {
    // preprocessorOptions: {
    //   less: {
    //     // 全局注入 Less 变量（设计稿 375px 基准）
    //     additionalData: `
    //       @design-width: 375; // 设计稿宽度
    //       @base-font: 37.5;   // 1rem = 37.5px（375/10）
    //       @primary-color: #1677ff;
    //       @border-radius: 8px;
    //     `,
    //     javascriptEnabled: true,
    //   },
    // },
    postcss: {
      plugins: [
        postcssPxToViewport({
          viewportWidth: 375,        // 设计稿宽度（iPhone 6/7/8 750px 物理像素，设计稿一般是 375px 逻辑像素）
          unitPrecision: 3,         // 转换后保留小数位数
          viewportUnit: 'vw',       // 转换单位
          selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名
          minPixelValue: 1,         // 小于等于1px不转换
          mediaQuery: false,        // 允许在媒体查询中转换
          exclude: [/node_modules/] // 忽略 node_modules
        })
      ]
    }
  },
  
})
