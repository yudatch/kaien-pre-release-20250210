"use client";

import { TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FormTextFieldProps, FormSelectFieldProps, FormDateFieldProps, FormMoneyFieldProps } from '@/app/types/components/features/projects/forms';

export const FormTextField = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  multiline = false,
  rows = 1,
  variant = 'standard',
  error = false,
  helperText,
  type,
  InputProps,
}: FormTextFieldProps) => {
  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px',
        fontSize: '0.875rem',
        color: disabled ? 'rgba(0, 0, 0, 0.38)' : 'rgba(0, 0, 0, 0.87)'
      }}>
        {label}
        {required && <span style={{ color: '#d32f2f' }}> *</span>}
      </label>
      <TextField
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        multiline={multiline}
        rows={rows}
        variant={variant}
        error={error}
        helperText={helperText}
        type={type}
        fullWidth
        InputProps={InputProps}
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputLabel-root': {
            display: 'none'
          }
        }}
      />
    </div>
  );
};

export function FormSelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  variant,
  error,
  helperText,
  InputProps
}: FormSelectFieldProps) {
  if (disabled && variant === 'standard') {
    const selectedOption = options.find(option => option.value === value);
    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ color: 'text.primary' }}>
          {selectedOption?.label || ''}
        </Typography>
      </Box>
    );
  }

  return (
    <FormControl fullWidth required={required} error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        disabled={disabled}
        variant={variant}
        {...InputProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant="caption" color={error ? "error" : "text.secondary"} sx={{ mt: 0.5, ml: 1.75 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
}

export function FormDateField({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  variant,
  InputProps
}: FormDateFieldProps) {
  if (disabled && variant === 'standard') {
    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ color: 'text.primary' }}>
          {value ? dayjs(value).format('YYYY年MM月DD日') : ''}
        </Typography>
      </Box>
    );
  }

  return (
    <DatePicker
      label={label}
      value={value ? dayjs(value) : null}
      onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
      slotProps={{
        textField: {
          fullWidth: true,
          required: required,
          disabled: disabled,
          variant: variant,
          InputProps: InputProps
        }
      }}
    />
  );
}

export function FormMoneyField({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  variant,
  InputProps
}: FormMoneyFieldProps) {
  if (disabled && variant === 'standard') {
    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ color: 'text.primary' }}>
          ¥{value ? value.toLocaleString() : '0'}
        </Typography>
      </Box>
    );
  }

  return (
    <TextField
      fullWidth
      label={label}
      value={value || ''}
      onChange={(e) => {
        const val = e.target.value ? parseInt(e.target.value, 10) : null;
        onChange(isNaN(val as number) ? null : val);
      }}
      type="number"
      required={required}
      disabled={disabled}
      variant={variant}
      InputProps={{
        ...InputProps,
        startAdornment: <InputAdornment position="start">¥</InputAdornment>,
      }}
    />
  );
} 