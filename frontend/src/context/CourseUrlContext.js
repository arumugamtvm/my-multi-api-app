// src/context/CourseUrlContext.js
import React, { createContext, useContext, useState } from 'react';

const CourseUrlContext = createContext();

export const CourseUrlProvider = ({ children }) => {
  const [courseUrls, setCourseUrls] = useState([]);

  return (
    <CourseUrlContext.Provider value={{ courseUrls, setCourseUrls }}>
      {children}
    </CourseUrlContext.Provider>
  );
};

export const useCourseUrls = () => {
  const context = useContext(CourseUrlContext);
  if (!context) {
    throw new Error('useCourseUrls must be used within a CourseUrlProvider');
  }
  return context;
};
