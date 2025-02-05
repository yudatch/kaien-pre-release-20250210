import { ReactNode } from 'react';
import { CustomButtonGroupStyle } from './table';

export interface ClientLayoutProps {
  children: ReactNode;
  title?: string;
}

export interface ListPageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  addButtonLabel?: string;
  onAddClick?: () => void;
  customLayout?: {
    useButtonGroup?: boolean;
    buttonGroupStyle?: CustomButtonGroupStyle;
    additionalButtons?: {
      label: string;
      icon?: ReactNode;
      onClick: () => void;
    }[];
  };
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
  disabled?: boolean;
  divider?: boolean;
}

export interface PageTitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
} 