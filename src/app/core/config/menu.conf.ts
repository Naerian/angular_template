import { MenuEntity } from "@shared/components/side-menu/model/menu.entity";

/**
 * Array que contiene la estructura del menú de la aplicación.
 */
const MENU_ITEMS: MenuEntity[] = [
  {
    label: 'app.home',
    icon: 'ri-home-3-fill',
    shortcut: false,
    childrens: [
      {
        label: 'Test 1',
        route: '/test',
        shortcut: false,
      },
      {
        label: 'Test 2',
        route: '/test1',
        shortcut: false,
      },
      {
        label: 'Test 3',
        route: '/test2',
        shortcut: false,
      },
      {
        label: 'Test 4',
        shortcut: false,
        childrens: [
          {
            label: 'Test 5',
            route: '/test4',
            shortcut: false,
          },
          {
            label: 'Test 6',
            shortcut: false,
            childrens: [
              {
                label: 'Test 7',
                route: '/test5',
                shortcut: false,
              },
            ]
          },
        ]
      },
    ],
  },
  {
    label: 'Otro menú',
    icon: 'ri-mail-star-fill',
    shortcut: false,
    childrens: [
      {
        label: 'Otro menú 1',
        route: '/test7',
        shortcut: false,
      },
      {
        label: 'Otro menú 2',
        route: '/test8',
        shortcut: false,
      },
    ],
  },
];

export default MENU_ITEMS;
