"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  LinearProgress,
  IconButton,
  CardHeader,
} from '@mui/material';
import {
  People,
  Business,
  ShoppingCart,
  Construction,
  TrendingUp,
  AddCircle,
  Inventory2,
  Warning,
  Schedule,
  Engineering,
} from '@mui/icons-material';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import Link from 'next/link';
import { DashboardData } from '@/app/api/dashboard';
import { dashboardApi } from '@/app/api/dashboard';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('環境変数:', {
          NODE_ENV: process.env.NODE_ENV,
          API_URL: process.env.NEXT_PUBLIC_API_URL
        });
        
        const response = await dashboardApi.getDashboardData();
        console.log('APIレスポンス:', response);
        if (response) {
          setData(response);
        } else {
          console.error('データが取得できませんでした');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('APIエラー詳細:', {
            message: error.message,
            config: error.config,
            response: error.response?.data
          });
        } else {
          console.error('予期せぬエラー:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <Box className="space-y-6 py-4">
        <PageTitle title="ダッシュボード" />
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box className="space-y-6 py-4">
      <PageTitle title="ダッシュボード" />

      <Grid container spacing={3}>
        {/* 顧客管理カード */}
        <Grid item xs={12} md={6} lg={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: '1px solid rgba(66, 133, 244, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(66, 133, 244, 0.05)',
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              pb: 1,
              px: 2.5,
              '& .MuiStack-root': {
                mx: 0
              }
            }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.15)' },
                      width: 40,
                      height: 40,
                    }}
                  >
                    <People sx={{ color: '#4285f4', fontSize: 20 }} />
                  </IconButton>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1.15rem',
                      letterSpacing: '-0.025em'
                    }}
                  >
                    顧客管理
                  </Typography>
                </Stack>
                <div className="space-y-1.5">
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TrendingUp sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        総顧客数
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.customers.totalCustomers}社
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <AddCircle sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem', 
                        whiteSpace: 'nowrap',
                      }}>
                        今月の新規顧客
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.customers.newCustomersThisMonth}社
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Business sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem', 
                        whiteSpace: 'nowrap',
                      }}>
                        進行中の案件
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.customers.activeProjects}件
                    </Typography>
                  </Stack>
                </div>
              </Stack>
            </CardContent>
            <CardContent sx={{ pt: 0, pb: 2, px: 2.5 }}>
              <Link href="/customers/list" passHref style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: '#1976d2',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 1,
                    '&:hover': {
                      background: '#1976d2',
                      boxShadow: '0 4px 12px rgba(66, 133, 244, 0.25)',
                    }
                  }}
                >
                  顧客一覧
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* 案件管理カード */}
        <Grid item xs={12} md={6} lg={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: '1px solid rgba(66, 133, 244, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(66, 133, 244, 0.05)',
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              pb: 1,
              px: 2.5,
              '& .MuiStack-root': {
                mx: 0
              }
            }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.15)' },
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Business sx={{ color: '#4285f4', fontSize: 20 }} />
                  </IconButton>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1.15rem',
                      letterSpacing: '-0.025em'
                    }}
                  >
                    案件管理
                  </Typography>
                </Stack>
                <div className="space-y-1.5">
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TrendingUp sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        総案件数
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.projects.totalProjects}件
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TrendingUp sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        進行中
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.projects.projectsByStatus.in_progress}件
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TrendingUp sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        見積中
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.projects.projectsByStatus.draft}件
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TrendingUp sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        完了
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.projects.projectsByStatus.completed}件
                    </Typography>
                  </Stack>
                </div>
              </Stack>
            </CardContent>
            <CardContent sx={{ pt: 0, pb: 2, px: 2.5 }}>
              <Link href="/projects/list" passHref style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: '#1976d2',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 1,
                    '&:hover': {
                      background: '#1976d2',
                      boxShadow: '0 4px 12px rgba(66, 133, 244, 0.25)',
                    }
                  }}
                >
                  案件一覧
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        {/* 工事管理カード */}
        {/* <Grid item xs={12} md={6} lg={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: '1px solid rgba(66, 133, 244, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(66, 133, 244, 0.05)',
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              pb: 1,
              px: 2.5,
              '& .MuiStack-root': {
                mx: 0
              }
            }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.15)' },
                      width: 40,
                      height: 40,
                    }}
                  >
                    <Construction sx={{ color: '#4285f4', fontSize: 20 }} />
                  </IconButton>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1.15rem',
                      letterSpacing: '-0.025em'
                    }}
                  >
                    工事管理
                  </Typography>
                </Stack>
                <div className="space-y-1.5">
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Engineering sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        進行中の工事
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.constructions.activeConstructions}件
                    </Typography>
                  </Stack>
                  {data.constructions.upcomingDeadlines.slice(0, 1).map((construction, index) => (
                    <div key={index} className="space-y-2">
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 1 }}>
                        <Schedule sx={{ color: '#64748b', fontSize: 18 }} />
                        <div className="flex-1">
                          <Typography sx={{ 
                            color: '#64748b', 
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            次回期限: {construction.deadline}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={construction.progress} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              mt: 1,
                              backgroundColor: 'rgba(66, 133, 244, 0.12)',
                              '& .MuiLinearProgress-bar': {
                                background: '#1976d2',
                                borderRadius: 3,
                              }
                            }}
                          />
                        </div>
                      </Stack>
                    </div>
                  ))}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Warning sx={{ color: '#4285f4', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        期限が近い工事
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.constructions.upcomingDeadlines.length}件
                    </Typography>
                  </Stack>
                </div>
              </Stack>
            </CardContent>
            <CardContent sx={{ pt: 0, pb: 2, px: 2.5 }}>
              <Link href="/constructions/list" passHref style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: '#1976d2',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 1,
                    '&:hover': {
                      background: '#1976d2',
                      boxShadow: '0 4px 12px rgba(66, 133, 244, 0.25)',
                    }
                  }}
                >
                  工事一覧
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid> */}

        {/* 仕入管理カード */}
        {/* <Grid item xs={12} md={6} lg={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: '1px solid rgba(66, 133, 244, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(66, 133, 244, 0.05)',
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              pb: 1,
              px: 2.5,
              '& .MuiStack-root': {
                mx: 0
              }
            }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(66, 133, 244, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(66, 133, 244, 0.15)' },
                      width: 40,
                      height: 40,
                    }}
                  >
                    <ShoppingCart sx={{ color: '#4285f4', fontSize: 20 }} />
                  </IconButton>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: '#1e293b',
                      fontSize: '1.15rem',
                      letterSpacing: '-0.025em'
                    }}
                  >
                    仕入管理
                  </Typography>
                </Stack>
                <div className="space-y-1.5">
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Inventory2 sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        総仕入件数
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.purchases.totalPurchases}件
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TrendingUp sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        今月の仕入額
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      ¥{data.purchases.monthlyExpenses.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <TrendingUp sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        保留中の発注
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.purchases.pendingOrders}件
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ 
                    px: 1.5,
                    py: 1,
                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    }
                  }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Warning sx={{ color: '#64748b', fontSize: 18 }} />
                      <Typography sx={{ 
                        color: '#64748b', 
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}>
                        在庫警告
                      </Typography>
                    </Stack>
                    <Typography sx={{ 
                      color: '#4285f4',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      pl: 2
                    }}>
                      {data.purchases.lowStockProducts.length}件
                    </Typography>
                  </Stack>
                </div>
              </Stack>
            </CardContent>
            <CardContent sx={{ pt: 0, pb: 2, px: 2.5 }}>
              <Link href="/purchases/list" passHref style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: '#1976d2',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    py: 1,
                    '&:hover': {
                      background: '#1976d2',
                      boxShadow: '0 4px 12px rgba(66, 133, 244, 0.25)',
                    }
                  }}
                >
                  仕入一覧
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
}
