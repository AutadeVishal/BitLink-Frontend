import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="page-shell flex items-center justify-center min-h-[70vh]">
      <div className="glass-panel p-10 text-center max-w-xl float-gentle glow-pulse">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="section-title mb-4">Something Broke</h1>
        <p className="text-red-100 mb-2">An unexpected error interrupted the flow.</p>
        <p className="subtitle text-sm mb-6">Refresh the page or return later if the issue persists.</p>
        <Link to="/">
          <button className="btn-primary px-8">
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
