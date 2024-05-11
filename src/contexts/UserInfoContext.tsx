'use Client';

import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { UserInformation } from '@/types/DataModel';

export const LoginUserContext = createContext<{
    loginUser: UserInformation | null;
    setLoginUser: React.Dispatch<React.SetStateAction<UserInformation | null>>;
}>({
    loginUser: null,
    setLoginUser: () => {} 
});

export const useLoginUser = () => {
    const context = useContext(LoginUserContext);
    if (!context) {
        throw new Error('useLoginUser must be used within a LoginUserProvider');
    }
    return context;
};

export const LoginUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loginUser, setLoginUser] = useState<UserInformation | null>(null);
    const value= {
        loginUser,
        setLoginUser
    };
    return (
        <LoginUserContext.Provider value={value}>
            {children}
        </LoginUserContext.Provider>
    );
};