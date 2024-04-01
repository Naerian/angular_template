import { MenuEntity } from "@shared/components/side-menu/model/menu.entity";

/**
 * Array que contiene la estructura del menú de la aplicación.
 */
const MENU_ITEMS: MenuEntity[] = [
  {
    label: 'app.home',
    icon: 'ri-home-3-fill',
    route: '/test',
    shortcut: false
  },
];

export default MENU_ITEMS;
