import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-xl font-semibold text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Loading;