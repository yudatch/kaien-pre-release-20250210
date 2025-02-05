'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthState, User } from '../types/auth';
import { authApi } from '../api/auth';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  hasGeneralAccess: () => boolean;
  hasApprovalAccess: () => boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => false,
  logout: () => {},
  checkPermission: () => false,
  hasGeneralAccess: () => false,
  hasApprovalAccess: () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await authApi.verifyToken();
        if (response.success && response.data) {
          setState({
            user: response.data.user,
            token,
            permissions: response.data.permissions,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            ...initialState,
            isLoading: false,
            error: response.message || null,
          });
          authApi.logout();
          router.push('/login');
        }
      } catch (error) {
        setState({
          ...initialState,
          isLoading: false,
          error: '認証の初期化に失敗しました。',
        });
        authApi.logout();
        router.push('/login');
      }
    };

    initializeAuth();
  }, [router]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login({ username, password });
      if (response.success && response.data) {
        setState({
          user: response.data.user,
          token: response.data.token,
          permissions: response.data.permissions,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // 権限に基づいてリダイレクト
        if (response.data.permissions.includes('approval.access')) {
          router.push('/expenses/approval/list');
        } else {
          router.push('/');
        }

        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'ログインに失敗しました。',
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'ログイン処理中にエラーが発生しました。',
      }));
      return false;
    }
  };

  const logout = () => {
    authApi.logout();
    router.push('/login');
    setState({
      ...initialState,
      isLoading: false
    });
  };

  const checkPermission = (permission: string): boolean => {
    return state.permissions.includes(permission);
  };

  const hasGeneralAccess = (): boolean => {
    // 一般業務へのアクセスは、general.accessを持っている場合のみ許可
    return checkPermission('general.access');
  };

  const hasApprovalAccess = (): boolean => {
    // 承認業務へのアクセスは、approval.accessを持っている場合のみ許可
    return checkPermission('approval.access');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkPermission,
        hasGeneralAccess,
        hasApprovalAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 