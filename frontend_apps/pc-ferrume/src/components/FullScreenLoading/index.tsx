import styles from './style.module.scss';

function FullScreenLoading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-black fixed z-[9999] left-0 top-0">
      <div className={styles.loader} />
    </div>
  );
}

export default FullScreenLoading;
