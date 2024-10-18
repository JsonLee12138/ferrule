import type { IconBaseProps } from "react-icons";
import { LiaSpinnerSolid } from "react-icons/lia";

const Loading = (props: IconBaseProps) => {
  return <LiaSpinnerSolid className="animate-spin" {...props} />
}

export default Loading;
