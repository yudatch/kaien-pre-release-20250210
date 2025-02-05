'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box, Container, Typography, Avatar, Stack } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import Sidebar from '../core/layout/Sidebar';

const PUBLIC_PATHS = ['/login'];
const APPROVAL_PATHS = ['/expenses/approval/list'];
const GENERAL_PATHS = [
  '/customers',
  '/projects',
  '/documents',
  '/expenses/create',
  '/expenses/list'
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasGeneralAccess, hasApprovalAccess, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';

  useEffect(() => {
    if (!isLoading) {
      // 未認証ユーザーを/loginにリダイレクト
      if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
        router.push('/login');
        return;
      }

      // 認証済みユーザーのアクセス制御
      if (isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
        const hasApprovalPerm = hasApprovalAccess();
        const hasGeneralPerm = hasGeneralAccess();

        // 承認画面へのアクセス制御
        if (APPROVAL_PATHS.some(path => pathname.startsWith(path))) {
          if (!hasApprovalPerm) {
            router.push('/');
            return;
          }
        }
        // 一般業務画面へのアクセス制御
        else if (GENERAL_PATHS.some(path => pathname.startsWith(path))) {
          if (!hasGeneralPerm) {
            router.push('/expenses/approval/list');
            return;
          }
        }
        // その他のパスの場合、権限に応じてリダイレクト
        else if (pathname === '/') {
          if (hasApprovalPerm) {
            router.push('/expenses/approval/list');
            return;
          }
        }
      }

      // 認証済みユーザーが/loginにアクセスした場合のリダイレクト
      if (isAuthenticated && PUBLIC_PATHS.includes(pathname)) {
        if (hasApprovalAccess()) {
          router.push('/expenses/approval/list');
        } else {
          router.push('/');
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, hasGeneralAccess, hasApprovalAccess]);

  // ローディング中は常にローディング画面を表示
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 公開パスの場合は直接表示
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // 未認証の場合は何も表示しない
  if (!isAuthenticated) {
    return null;
  }

  // 認証済みかつ権限チェックが必要なパスの場合、権限チェックを行う
  const hasApprovalPerm = hasApprovalAccess();
  const hasGeneralPerm = hasGeneralAccess();

  // 承認画面へのアクセス制御
  if (APPROVAL_PATHS.some(path => pathname.startsWith(path)) && !hasApprovalPerm) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 一般業務画面へのアクセス制御
  if (GENERAL_PATHS.some(path => pathname.startsWith(path)) && !hasGeneralPerm) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
        <Stack 
          direction="row" 
          spacing={1.5} 
          alignItems="center"
          sx={{ 
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 1200
          }}
        >
          <Typography
            sx={{
              color: '#666666',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {user?.username}
          </Typography>
          <AccountCircle 
            sx={{ 
              color: '#3b82f6',
              fontSize: 32
            }}
          />
        </Stack>
        <Container maxWidth="lg" sx={{ mx: 'auto', mt: 7 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
} 