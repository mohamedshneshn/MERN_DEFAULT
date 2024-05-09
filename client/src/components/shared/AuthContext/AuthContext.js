import React, { useState, useEffect, useCallback } from "react";
import { createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [inactivityTimer, setInactivityTimer] = useState(null);

  // login function to set the user data in the local storage
  const login = useCallback((userId, token) => {
    setUserId(userId);
    setToken(token);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId: userId, token: token })
    );
  }, []);

  // logout function to clear the user data from the local storage
  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    localStorage.removeItem("userData");
  }, []);

  //function to reset the inactivity timer
  const resetInactivityTimer = useCallback(() => {
    // Clear the existing timer if it exists
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // Set a new timer that will trigger after 10 minutes of inactivity
    const newTimer = setTimeout(() => {
      // Show the alert when the session expires
      alert("Session expired. Please log in again.");
      // Call the logout function
      logout();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    // Store the new timer
    setInactivityTimer(newTimer);
  }, [inactivityTimer, logout]);

  //to keep the user logged in even after the page refreshes
  //useEffect hook to run the code only once when the component is rendered
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      login(storedData.userId, storedData.token);
    }
    return () => {
      clearTimeout(inactivityTimer); //
    };
  }, [login, inactivityTimer]); //dependencies for the useEffect hook to run only once when the component is rendered

  //Event listener to reset the inactivity timer when the user interacts with the page
  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [resetInactivityTimer]);

  const contextValue = {
    userId,
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

/*
what is the useEffect hook used for in the AuthContext component?
- The useEffect hook is used to run the code only once when the component is rendered. 
It is used to keep the user logged in even after the page refreshes by checking the local storage for user data and setting the user data in the state if it exists.
It also clears the inactivity timer when the component is unmounted.


what is the difference between useEffect and useCallback hooks?
-------------------------------------------------------------------
useEffect:
- useEffect is used to perform side effects in function components.
- It is used to run code in response to component lifecycle events, such as when the component is mounted, updated, or unmounted.
- It can be used to fetch data, subscribe to events, update the DOM, and perform other side effects.
- It can be used to run code once when the component is rendered, or to run code in response to changes in props or state.
- used to run code like fetching data or authenticating the user evertime the component renders.
- used to han

useCallback:
- useCallback is used to memoize functions in function components.
- It is used to prevent unnecessary re-renders of child components that depend on the function.
- It is useful when passing functions as props to child components, as it ensures that the function reference remains the same unless the dependencies change.


when the component renders?
---------------------------
1- when we load the page
2- when the state changes
3- when the props change
4- when the context changes

*/

// import React, { useState, useEffect } from "react";
// import { createContext } from "react";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [userId, setUserId] = useState(null);
//   const [token, setToken] = useState(null);

//   //to keep the user logged in even after the page refreshes
//   //useEffect hook to run the code only once when the component is rendered
//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem("userData"));
//     if (storedData && storedData.token) {
//       login(storedData.userId, storedData.token);
//     }
//   }, []);

//   const login = (userId, token) => {
//     setUserId(userId);
//     setToken(token);
//     localStorage.setItem(
//       "userData",
//       JSON.stringify({ userId: userId, token: token })
//     );
//   };

//   const logout = () => {
//     setUserId(null);
//     setToken(null);
//     localStorage.removeItem("userData");
//   };

//   const contextValue = {
//     userId,
//     token,
//     isLoggedIn: !!token,
//     login,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//   );
// };

// export { AuthProvider, AuthContext };
