import React, { useState } from 'react';
import { env } from './utils/env';
import useStore from 'host/store'
import './App.css';

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const { count: hostCount, increment, clear } = useStore()

  return (
    <div className="mfe2-wrapper mfe-card">
      <h2>{env.appName} Application</h2>
      <div className="mfe-content">
        <div className="feature-container">
          <div className="button-container">
            <button
              onClick={() => setCount(prev => prev + 1)}
              className="button"
            >
              Count: {count}
            </button>
            <button
              onClick={() => setCount(0)}
              className="button"
            >
              Clear
            </button>
          </div>
          <div className="button-container">
            <div className="button-group">
              <button
                onClick={increment}
                className="button"
              >
                Host Count: {hostCount}
              </button>
            </div>
            <div className="button-group">
              <button
                onClick={clear}
                className="button"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
