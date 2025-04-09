import React from "react";

const MyInput = React.forwardRef(({ label, ...props }, ref) => {
  return (
    <div className="my-input">
      {label && <label>{label}</label>}
      <input ref={ref} {...props} />
    </div>
  );
});

export default MyInput;
