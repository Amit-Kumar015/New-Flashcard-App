import React, { createContext, useState } from "react";

export const AddDeckContext = createContext(null);

export const AddDeckProvider = ({ children }) => {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <AddDeckContext.Provider value={{ isAdded, setIsAdded }}>
      {children}
    </AddDeckContext.Provider>
  );
};
