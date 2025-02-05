import { ReactElement } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

export interface SubMenuItem {
  title: string;
  path: string;
  permission?: string;
}

export interface MenuItem {
  title: string;
  icon: ReactElement<SvgIconComponent>;
  path?: string;
  permission?: string;
  subItems?: SubMenuItem[];
} 