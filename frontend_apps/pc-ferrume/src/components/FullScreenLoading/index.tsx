import styles from './style.module.scss';
import { motion } from 'motion/react';

function FullScreenLoading() {
  return (
      <motion.div
        className="w-screen h-screen flex items-center justify-center bg-white dark:bg-black fixed z-[9999] left-0 top-0"

        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.loader} />
      </motion.div>
  );
}

export default FullScreenLoading;
