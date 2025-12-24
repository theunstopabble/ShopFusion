import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: "Sign In", link: "/login", active: step1 },
    { name: "Shipping", link: "/shipping", active: step2 },
    { name: "Payment", link: "/payment", active: step3 },
    { name: "Place Order", link: "/placeorder", active: step4 },
  ];

  return (
    <nav className="flex items-center justify-center mb-10 space-x-2 md:space-x-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center group">
            {step.active ? (
              <Link to={step.link} className="flex flex-col items-center">
                <CheckCircle2 className="text-blue-500 mb-1" size={24} />
                <span className="text-xs md:text-sm font-black text-white uppercase tracking-tighter">
                  {step.name}
                </span>
              </Link>
            ) : (
              <div className="flex flex-col items-center opacity-30 cursor-not-allowed">
                <Circle className="text-gray-500 mb-1" size={24} />
                <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-tighter">
                  {step.name}
                </span>
              </div>
            )}
          </div>
          {/* Steps ke beech mein line */}
          {index !== steps.length - 1 && (
            <div
              className={`h-[2px] w-8 md:w-16 mb-6 ${
                steps[index + 1].active ? "bg-blue-500" : "bg-gray-700"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default CheckoutSteps;
