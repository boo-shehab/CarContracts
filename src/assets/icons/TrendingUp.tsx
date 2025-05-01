import { SVGProps } from "react";
import { JSX } from "react/jsx-runtime";

const TrendingUp = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.0556 8.04069H13.1718M22 18L16.5024 12.5862C16.2909 12.3779 15.9604 12.3544 15.7219 12.5308L11.4761 15.6712C11.226 15.8563 10.8771 15.8204 10.6694 15.5883L2.7151 6.70262M5.8916 6H3.0694C2.5215 6 2.0741 6.44077 2.0629 6.99179L2 10.0649"
      stroke="#E10600"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default TrendingUp;
