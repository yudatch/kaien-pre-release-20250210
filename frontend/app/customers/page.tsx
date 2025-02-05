"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
  Button,
} from '@mui/material';
import { DashboardData } from '../types/dashboard';
import { LoadingSpinner } from '@/app/components/core/feedback/LoadingSpinner';
import { PersonAdd, History } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/app/components/core/display/PageTitle';
import { api } from '@/app/api/client';

export default function CustomersPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<{ data: DashboardData; message?: string; success?: boolean }>('/api/dashboard');
        if ('data' in response.data) {
          setData(response.data.data);
        } else {
          setError('データの取得に失敗しました。');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'データが見つかりません。'}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <PageTitle title="顧客管理" />

        <ButtonGroup 
          variant="outlined" 
          sx={{ 
            '& .MuiButton-root': {
              borderColor: '#e0e0e0',
              color: '#666666',
              '&:hover': {
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.04)',
              }
            }
          }}
        >
          <Button 
            startIcon={<PersonAdd />}
            onClick={() => router.push('/customers/new')}
          >
            顧客情報登録
          </Button>
          <Button 
            startIcon={<History />}
            onClick={() => router.push('/customers/contacts')}
          >
            コンタクト履歴
          </Button>
        </ButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>顧客サマリー</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="総顧客数"
                    secondary={`${data.customers.totalCustomers}社`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="今月の新規顧客"
                    secondary={`${data.customers.newCustomersThisMonth}社`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="進行中の案件数"
                    secondary={`${data.customers.activeProjects}件`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>最近のコンタクト履歴</Typography>
              <List>
                {data.customers.recentContacts.map((contact, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={contact.customerName}
                      secondary={`${contact.date} - ${contact.type}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 