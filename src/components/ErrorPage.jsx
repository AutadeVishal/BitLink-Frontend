import React from 'react';

const ErrorPage = () => {
  return (
    <div className="p-8 bg-gray-800 rounded border border-gray-700 text-white">
      <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
      <p className="mt-2 text-base text-gray-200">We're sorry, but an unexpected error occurred.</p>
      <p className="mt-1 text-gray-400">Please try again later.</p>
    </div>
  );
};

export default ErrorPage;
