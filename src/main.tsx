
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");

if (rootElement) {
  try {
    createRoot(rootElement).render(<App />);
    console.log("Application mounted successfully");
  } catch (error) {
    console.error("Error mounting React application:", error);
    
    // Show a readable error to the user instead of a blank screen
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: system-ui, sans-serif;">
        <h1 style="color: #e11d48;">Application Error</h1>
        <p>Sorry, the application failed to load. Please check the console for more details.</p>
        <pre style="background: #f1f5f9; padding: 15px; border-radius: 4px; overflow: auto;">${error}</pre>
      </div>
    `;
  }
} else {
  console.error("Root element not found");
}
