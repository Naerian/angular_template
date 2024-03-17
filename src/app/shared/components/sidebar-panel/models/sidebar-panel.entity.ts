import { Type } from "@angular/core";

/**
 * Interfaz para el panel lateral
 */
export interface SidebarbarPanelEntity {
  component: Type<any>;
  inputs?: SidebarbarPanelInputsEntity[];
  size?: SidebarbarPanelSize;
  position?: SidebarbarPanelPosition;
  title?: string;
  classes?: string[];
}

/**
 * Interfaz para los inputs que recibe el panel lateral
 */
export interface SidebarbarPanelInputsEntity {
  name: string;
  value: any; // Puede ser un string o un objeto
}

/**
 * Enumerado para el tamaño del panel lateral
 */
export enum SidebarbarPanelSize {
  SMALL = 's',
  MEDIUM = 'm',
  LARGE = 'l',
  EXTRA_LARGE = 'xl'
}

/**
 * Enumerado para la posición del panel lateral
 */
export enum SidebarbarPanelPosition {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom'
}

/**
 * Tamaño por defecto y posición por defecto del panel lateral si no se especifica
 */
export const DEFAULT_POSITION = SidebarbarPanelPosition.RIGHT;
export const DEFAULT_SIZE = SidebarbarPanelSize.SMALL;
