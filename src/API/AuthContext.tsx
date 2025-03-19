import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
    xsrfToken: string | null;
    setXsrfToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [xsrfToken, setXsrfToken] = useState<string | null>(null);
    const [dirty, setDirty] = useState<boolean>(true); // Aggiunta della variabile dirty
    return (
        <AuthContext.Provider value={{ xsrfToken, setXsrfToken, dirty, setDirty }}>
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
