import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string | number;
  options: readonly Option[];
  onChange: (value: string | number) => void;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export function FormSelect({
  label,
  value,
  options,
  onChange,
  required = false,
  error = false,
  helperText,
}: FormSelectProps) {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const newValue = event.target.value;
    // 数値型の場合は変換
    if (options.some(opt => typeof opt.value === 'number')) {
      onChange(Number(newValue));
    } else {
      onChange(newValue);
    }
  };

  return (
    <FormControl fullWidth error={error} required={required}>
      <InputLabel sx={{ transform: 'translate(0, -9px) scale(0.75) !important' }}>{label}</InputLabel>
      <Select<string | number>
        value={value === null || value === undefined ? '' : value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>選択してください</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
} 