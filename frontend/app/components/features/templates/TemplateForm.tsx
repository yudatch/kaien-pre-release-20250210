"use client";

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { TemplateSection, TemplateData, TemplateFormProps } from '@/app/types/components/templates';

export default function TemplateForm({
  template: initialTemplate,
  onSave,
  onCancel
}: TemplateFormProps) {
  const [template, setTemplate] = useState<TemplateData>(initialTemplate);

  const handleBasicInfoChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (
    sectionId: string,
    field: keyof TemplateSection,
    value: string
  ) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  const handleAddSection = () => {
    const newSection: TemplateSection = {
      id: `section${template.sections.length + 1}`,
      title: '新しいセクション',
      type: 'text',
      content: ''
    };
    setTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleDeleteSection = (sectionId: string) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === template.sections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const sections = [...template.sections];
    [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];

    setTemplate(prev => ({
      ...prev,
      sections
    }));
  };

  const SectionContentField = ({
    section,
    onChange
  }: {
    section: TemplateSection;
    onChange: (value: string | object) => void;
  }) => {
    if (section.type === 'text') {
      return (
        <TextField
          fullWidth
          multiline
          rows={4}
          label="内容"
          value={section.content as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    if (section.type === 'table') {
      const content = typeof section.content === 'string'
        ? JSON.parse(section.content)
        : section.content;

      return (
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="ヘッダー（カンマ区切り）"
            value={content.headers?.join(', ') || ''}
            onChange={(e) => {
              const headers = e.target.value.split(',').map(h => h.trim());
              onChange({ ...content, headers });
            }}
            helperText="例：項目, 数量, 単価, 金額, 備考"
          />
          <TextField
            fullWidth
            label="列幅（カンマ区切り）"
            value={content.widths?.join(', ') || ''}
            onChange={(e) => {
              const widths = e.target.value.split(',').map(w => parseInt(w.trim()));
              onChange({ ...content, widths });
            }}
            helperText="例：300, 100, 150, 150, 200"
          />
        </Stack>
      );
    }

    if (section.type === 'signature') {
      const content = typeof section.content === 'string'
        ? JSON.parse(section.content)
        : section.content;

      return (
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>位置</InputLabel>
            <Select
              value={content.position || 'right'}
              label="位置"
              onChange={(e) => onChange({ ...content, position: e.target.value })}
            >
              <MenuItem value="left">左寄せ</MenuItem>
              <MenuItem value="center">中央</MenuItem>
              <MenuItem value="right">右寄せ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="タイトル"
            value={content.title || ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
          />
          <FormControl>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>日付を表示</Typography>
              <Chip
                label={content.date ? 'ON' : 'OFF'}
                color={content.date ? 'primary' : 'default'}
                onClick={() => onChange({ ...content, date: !content.date })}
              />
            </Stack>
          </FormControl>
        </Stack>
      );
    }

    return null;
  };

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            基本情報
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="テンプレート名"
                name="name"
                value={template.name}
                onChange={handleBasicInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="説明"
                name="description"
                value={template.description}
                onChange={handleBasicInfoChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              セクション
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddSection}
              variant="outlined"
            >
              セクション追加
            </Button>
          </Box>

          <Stack spacing={2}>
            {template.sections.map((section, index) => (
              <Card key={section.id} variant="outlined">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Stack direction="column">
                        <IconButton
                          size="small"
                          onClick={() => handleMoveSection(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleMoveSection(index, 'down')}
                          disabled={index === template.sections.length - 1}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                      </Stack>
                      <TextField
                        fullWidth
                        label="セクションタイトル"
                        value={section.title}
                        onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                      />
                      <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>種類</InputLabel>
                        <Select
                          value={section.type}
                          label="種類"
                          onChange={(e) => handleSectionChange(section.id, 'type', e.target.value)}
                        >
                          <MenuItem value="text">テキスト</MenuItem>
                          <MenuItem value="table">表</MenuItem>
                          <MenuItem value="signature">署名欄</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <SectionContentField
                        section={section}
                        onChange={(value) => {
                          const content = typeof value === 'object' ? JSON.stringify(value) : value;
                          handleSectionChange(section.id, 'content', content);
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(template)}
        >
          保存
        </Button>
      </Box>
    </Stack>
  );
} 