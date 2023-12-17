import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [role, setRole] = useState(undefined);

  const auth = getAuth();
  useEffect(() => {
    let myListener = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      //get the role from the backend
      if (user) {
        try {
          let userData = await axios(
            "http://localhost:3000/users/" +
              user.uid +
              "/" +
              user.email
          );
          if (userData.data.status == "Approved") {
            setRole(userData.data.role);
          } else {
            setRole("None");
          }
        } catch (e) {
          console.log(e);
          setRole("None");
        }
      } else {
        setRole("");
      }

      // console.log("onAuthStateChanged", user);
      setLoadingUser(false);
    });

    return () => {
      if (myListener) myListener();
    };
  }, []);

  if (loadingUser) {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, role }}>
      {children}
    </AuthContext.Provider>
  );
};
