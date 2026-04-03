import React from "react";

function Input({
  placeholder,
  label,
  ...props
}: {
  placeholder?: string;
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      {label && <label className="text-gray-300">{label}</label>}
      <input
        {...props}
        type="text"
        placeholder={placeholder}
        className="border-primary border px-4 py-2 w-full rounded-lg"
      />
    </>
  );
}

export default Input;
