import { createContext, useState, useContext, ReactNode } from "react";
import {UserDTO} from "./interfaces";

interface AuthContextType {
    xsrfToken: string | null;
    setXsrfToken: (token: string) => void;
    dirty: boolean;
    setDirty:(dirty: boolean) => void;
    role:string;
    setRole:(role:string) => void;
    user:UserDTO;
    setUser: (user:UserDTO) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [xsrfToken, setXsrfToken] = useState<string | null>(null);
    const [dirty, setDirty] = useState<boolean>(true); // Aggiunta della variabile dirty
    const [role , setRole] = useState<string>("ANONYMOUS")
    const [user, setUser] = useState<UserDTO>({
        name:"",
        surname: "",
        email:"",
        userId: "",
    })
    return (
        <AuthContext.Provider value={{ xsrfToken, setXsrfToken, dirty, setDirty , role, setRole, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve essere usato dentro un AuthProvider");
    }
    return context;
};
