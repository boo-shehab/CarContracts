import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";
const ArrowRise = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#3AB54A"
      fillRule="evenodd"
      d="M12.682 8.412 21 6l-2.07 8.41-2.583-2.48-4.166 4.34a.75.75 0 0 1-1.082 0L8.04 13.082l-4.499 4.686a.75.75 0 1 1-1.082-1.038l5.04-5.25a.75.75 0 0 1 1.082 0l3.059 3.186 3.625-3.776-2.583-2.48Z"
      clipRule="evenodd"
    />
  </svg>
)
export default ArrowRise
