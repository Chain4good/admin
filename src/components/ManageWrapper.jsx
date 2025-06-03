import React from "react";

const ManageWrapper = ({ children, title, subtitle, icon, extra }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">{subtitle}</p>
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
};

export default ManageWrapper;
