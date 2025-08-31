import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600 mb-2">We're sorry, but an unexpected error occurred.</p>
        <p className="text-gray-500 text-sm">Please try again later or contact support if the problem persists.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
