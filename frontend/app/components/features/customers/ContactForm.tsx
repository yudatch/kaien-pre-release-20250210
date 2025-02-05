"use client";

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { ContactFormData } from '@/app/types/components/features/customers/forms';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    customerName: '',
    contactDate: dayjs(),
    contactType: '訪問',
    staff: '',
    description: '',
    status: '未対応'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API実装後に追加
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        contactDate: date
      }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            name="customerName"
            label="取引先名"
            value={formData.customerName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DateTimePicker
            label="日時"
            value={formData.contactDate}
            onChange={handleDateChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>種別</InputLabel>
            <Select
              name="contactType"
              value={formData.contactType}
              label="種別"
              onChange={handleChange}
            >
              <MenuItem value="訪問">訪問</MenuItem>
              <MenuItem value="電話">電話</MenuItem>
              <MenuItem value="メール">メール</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            name="staff"
            label="担当者"
            value={formData.staff}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            name="description"
            label="内容"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>ステータス</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="ステータス"
              onChange={handleChange}
            >
              <MenuItem value="未対応">未対応</MenuItem>
              <MenuItem value="対応中">対応中</MenuItem>
              <MenuItem value="完了">完了</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            登録
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
} 