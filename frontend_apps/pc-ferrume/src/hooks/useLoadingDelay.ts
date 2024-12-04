import { useBoolean } from "ahooks";
import { useEffect } from "react";

const useLoadingDelay = (minTime = 500) => {
  const [ready, setReady] = useBoolean(false);
  useEffect(() => {
    const timer = setTimeout(setReady.setTrue, minTime)
    return () => clearTimeout(timer);
  }, [minTime])
  return [ready]
}

export default useLoadingDelay;
