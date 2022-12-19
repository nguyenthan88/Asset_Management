import { createContext, useState } from "react";
import { TOKEN_KEY } from "../constants";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState(JSON.parse(sessionStorage.getItem("auth")));
    
    sessionStorage.setItem('auth', JSON.stringify(auth));

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;