import React from "react";

const AddAlert = ({ productName }) => {
  return (
    <div role="alert" class="alert alert-success absolute right-5 bottom-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>You have successfully added {productName}!</span>
    </div>
  );
};

export default AddAlert;
