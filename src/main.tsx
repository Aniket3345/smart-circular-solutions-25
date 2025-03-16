
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error boundary component to catch React rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("Error caught in error boundary:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <div className="bg-red-100 p-3 rounded border border-red-200 text-sm font-mono mb-4 overflow-auto max-h-[400px]">
              {this.state.error?.toString()}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log("Starting application...");

// Check if the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM is loaded");
});

// Render the app
const Root = () => {
  console.log("Root component rendering");
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
};

try {
  console.log("Mounting React application");
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element");
    throw new Error("Root element not found");
  }
  ReactDOM.createRoot(rootElement).render(<Root />);
  console.log("React application mounted successfully");
} catch (error) {
  console.error("Error mounting React application:", error);
}
