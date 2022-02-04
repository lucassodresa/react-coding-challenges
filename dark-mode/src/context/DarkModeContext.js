import React, { createContext, useEffect, useState } from "react";

// create a context and logic to add darkmode class in html element when it is activated

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeClass = "dark-mode";
    const htmlElement = document.querySelector("html");

    htmlElement.classList[isDarkMode ? "add" : "remove"](darkModeClass);

    // if (isDarkMode) {
    //   htmlElement.classList.add(darkModeClass);
    // } else {
    //   htmlElement.classList.remove(darkModeClass);
    // }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeContext, DarkModeProvider };
