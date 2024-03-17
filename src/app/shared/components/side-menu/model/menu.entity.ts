export interface MenuEntity {
  label: string;
  route?: string;
  icon?: string;
  active?: boolean;
  expanded?: boolean;
  shortcut?: boolean;
  childrens?: MenuEntity[];
}

/**
 * Enumerado para la posición del menú lateral
 */
export enum SideMenuPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

/**
 * Tamaño por defecto y posición por defecto del menú lateral si no se especifica
 */
export const DEFAULT_MENU_POSITION = SideMenuPosition.LEFT;
