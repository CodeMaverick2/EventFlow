import React, { createContext, useState } from "react";
import FlowSimulation from "./components/FlowSimulation.js";
import "./styles.css"; 

export const ThemeContext = createContext();

const App = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-container ${theme}`}>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        <FlowSimulation />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
