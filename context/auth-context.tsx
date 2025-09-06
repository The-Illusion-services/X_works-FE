'use client';

import { ApplicationRoutes } from '@/config/routes';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import Cookies from 'js-cookie';

type AuthContextProps = {
  isNewFreelanceUser: boolean;
  setIsNewFreelanceUser: Dispatch<SetStateAction<boolean>>;
  isNewClientUser: boolean;
  setIsNewClientUser: Dispatch<SetStateAction<boolean>>;
  hasJob: boolean;
  setHasJob: Dispatch<SetStateAction<boolean>>;
  isLoggedIn: boolean;
  // accessToken: string;
};

type AuthProviderProps = {
  children?: React.ReactNode;
};

export const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isNewFreelanceUser, setIsNewFreelanceUser] = useState(true);
  const [isNewClientUser, setIsNewClientUser] = useState(true);
  const [hasJob, setHasJob] = useState(false);
  const isLoggedIn = true;

  return (
    <AuthContext.Provider
      value={{
        isNewFreelanceUser,
        setIsNewFreelanceUser,
        isNewClientUser,
        setIsNewClientUser,
        hasJob,
        setHasJob,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const [accessToken, setAccessToken] = useState(
    () => Cookies.get('accessToken') || null,
  );

  const {
    isLoggedIn,
    isNewFreelanceUser,
    setIsNewFreelanceUser,
    isNewClientUser,
    setIsNewClientUser,
    hasJob,
    setHasJob,
    // accessToken
  } = context;

  return {
    logout: () => {
      window.location.replace(ApplicationRoutes.HOME);
    },
    isLoggedIn,
    isNewFreelanceUser,
    setIsNewFreelanceUser,
    isNewClientUser,
    setIsNewClientUser,
    hasJob,
    setHasJob,
    accessToken,
  };
};

export default AuthProvider;
