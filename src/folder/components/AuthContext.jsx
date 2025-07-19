import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();//authcontext is created using createContext
export const useAuth = () => useContext(AuthContext);//useAuth is a custom hook can access the context

export const AuthProvider = ({ children }) => {//wraps your app and manages the user state
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {//onAuthStateChanged provied by the firebase authentication
            setUser(user);//updates the users whenever the state changed
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;