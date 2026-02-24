// src/components/AnimatedOutlet.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../src/styles/AnimatedOutlet.module.less'; // Less 样式文件
import { useNavigation } from "react-router-dom";
import Spinner from './components/Spinner';
export default function AnimatedOutlet() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation()
  // 监听路由变化，显示加载动画
  useEffect(() => {
    
    setIsLoading(true);

    if(navigation.state == 'idle'){
      setIsLoading(false);
    }
  }, [location.pathname]);
  
  return (
    <>
      {/* 主要内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ height: '100%' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {/* 加载动画覆盖层 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className={styles.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.loadingSpinner} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

