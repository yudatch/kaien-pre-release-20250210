"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  Typography,
} from '@mui/material';
import {
  People,
  Business,
  ShoppingCart,
  Construction,
  ExpandLess,
  ExpandMore,
  LogoutOutlined,
  Receipt,
} from '@mui/icons-material';
import { useDocumentType } from '@/app/contexts/DocumentTypeContext';
import { MenuItem } from '@/app/types/components/core/sidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { DocumentType } from '@/app/contexts/DocumentTypeContext';

const generalMenuItems: MenuItem[] = [
  {
    title: '顧客管理',
    icon: <People />,
    path: '/customers/list',
    permission: 'general.access',
    subItems: [
      { title: '顧客一覧', path: '/customers/list' },
      { title: '顧客情報登録', path: '/customers/new' },
    ],
  },
  {
    title: '案件管理',
    icon: <Business />,
    path: '/projects/list',
    permission: 'general.access',
    subItems: [
      { title: '案件一覧', path: '/projects/list' },
      { title: '案件登録', path: '/projects/new' },
      { title: '入金予定', path: '/projects/payments/list' },
    ],
  },
  {
    title: '書類管理',
    icon: <Receipt />,
    permission: 'general.access',
    subItems: [
      { title: '見積書管理', path: '/projects/quotations' },
      { title: '請求書管理', path: '/projects/invoices' },
    ],
  },
  // {
  //   title: '仕入管理',
  //   icon: <ShoppingCart />,
  //   path: '/purchases/list',
  //   subItems: [
  //     { title: '仕入一覧', path: '/purchases/list' },
  //     { title: '発注一覧', path: '/purchases/orders/list' },
  //   ],
  // },
  {
    title: '経費精算',
    icon: <Receipt />,
    path: '/expenses/list',
    permission: 'general.access',
    subItems: [
      { title: '経費申請', path: '/expenses/new' },
      { title: '経費一覧', path: '/expenses/list' },
      // { title: '承認待ち一覧', path: '/expenses/approval/list' },
    ],
  },
  // {
  //   title: '工事管理',
  //   icon: <Construction />,
  //   path: '/constructions/list',
  //   subItems: [
  //     { title: '工事一覧', path: '/constructions/list' },
  //     { title: '工事情報登録', path: '/constructions/details/new' },
  //   ],
  // },
];

const approvalMenuItems: MenuItem[] = [
  {
    title: '承認業務',
    icon: <Receipt />,
    path: '/expenses/approval/list',
    permission: 'approval.access',
    subItems: [
      { 
        title: '承認待ち一覧', 
        path: '/expenses/approval/list',
        permission: 'approval.access'
      },
    ],
  },
];

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const { documentType } = useDocumentType();
  const { logout, checkPermission } = useAuth();

  const shouldExpandMenu = (item: MenuItem): boolean => {
    const isHovered = hoveredItem === item.title;
    const isCurrentPath = item.path === pathname;
    const hasActiveSubItem = item.subItems?.some(subItem => {
      if (pathname && pathname.includes('-preview')) {
        if (documentType && documentType === 'quotation' && subItem.path === '/projects/quotations') {
          return true;
        }
        if (documentType && documentType === 'invoice' && subItem.path === '/projects/invoices') {
          return true;
        }
      }
      return subItem.path === pathname;
    }) ?? false;
    
    return isHovered || isCurrentPath || hasActiveSubItem;
  };

  const isCurrentPath = (path: string): boolean => {
    if (pathname && pathname.includes('-preview')) {
      if (documentType && documentType === 'quotation' && path === '/projects/quotations') {
        return true;
      }
      if (documentType && documentType === 'invoice' && path === '/projects/invoices') {
        return true;
      }
    }
    return path === pathname;
  };

  const handleLogout = () => {
    logout();
  };

  // 権限に基づいてメニュー項目をフィルタリング
  const visibleMenuItems = [
    ...generalMenuItems.filter(item => !checkPermission('approval.access') && checkPermission(item.permission || '')),
    ...approvalMenuItems.filter(item => checkPermission(item.permission || '')),
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100vh',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
          overflowX: 'hidden',
        },
      }}
    >
      <div className="py-5 px-6 mb-10 flex items-center border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.5rem',
              lineHeight: '2rem',
              padding: '8px',
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '0.025em',
              textTransform: 'uppercase',
              position: 'relative',
              cursor: 'pointer',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '4px',
                left: '8px',
                width: 'calc(100% - 16px)',
                height: '2px',
                background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.2) 100%)',
                borderRadius: '1px',
              }
            }}
          >
            KAIEN
          </Typography>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <List>
          {visibleMenuItems.map((item) => (
            <div 
              key={item.title}
              onMouseEnter={() => setHoveredItem(item.title)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link href={item.path || ''} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem
                  button
                  sx={{
                    py: 1,
                    px: 2,
                    mx: 1,
                    borderRadius: 1,
                    backgroundColor: isCurrentPath(item.path || '') ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 40, 
                    color: isCurrentPath(item.path || '') ? '#3b82f6' : '#666666'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    primaryTypographyProps={{
                      sx: { 
                        fontWeight: isCurrentPath(item.path || '') ? 600 : 500,
                        fontSize: '0.95rem',
                        color: isCurrentPath(item.path || '') ? '#3b82f6' : 'inherit',
                      }
                    }}
                  />
                  {item.subItems && (
                    shouldExpandMenu(item) ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItem>
              </Link>
              {item.subItems && (
                <Collapse 
                  in={shouldExpandMenu(item)} 
                  timeout={200}
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <Link 
                        href={subItem.path} 
                        key={subItem.path}
                        style={{ textDecoration: 'none' }} 
                      >
                        <ListItem
                          button
                          sx={{
                            pl: 6,
                            pr: 2,
                            py: 0.75,
                            mx: 1,
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <ListItemText 
                            primary={subItem.title}
                            primaryTypographyProps={{
                              sx: { 
                                fontSize: '0.875rem',
                                color: isCurrentPath(subItem.path) ? '#3b82f6' : '#666666',
                                fontWeight: isCurrentPath(subItem.path) ? 600 : 'normal',
                              }
                            }}
                          />
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </div>
      <div className="border-t border-gray-200 mt-auto">
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              py: 2,
              px: 2,
              mx: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText 
              primary="ログアウト"
              primaryTypographyProps={{
                sx: { 
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#666666',
                }
              }}
            />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;