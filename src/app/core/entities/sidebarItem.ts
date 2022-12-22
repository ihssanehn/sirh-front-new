export interface SidebarItem {
  id: number;
  name: string;
  link: string;
  type: string;
  icon: string;
  srcIcon?: string;
  implemented?: boolean;
  opened?: boolean;
  is_locked?: boolean;
  onlyFor?: Array<any>;
  srcIcon_selectedStyle?: string;
  relative?: boolean;
  subMenu?: Array<SidebarItem>;
}
