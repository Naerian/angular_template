# TEMPLATE DE PROYECTO ANGULAR

[![Angular](https://img.shields.io/badge/Angular%20CLI-17.2.1-red?style=for-the-badge)](#)

[![Angular Material](https://img.shields.io/badge/Angular%20Material-17.2.0-blue?style=for-the-badge)](#)

Proyecto desarrollado en [Angular](https://github.com/angular/angular-cli), junto con [Angular Material](https://material.angular.io/). Éste último ha sido útil para la creación de tablas, overlays, checkbox, radiobutton y varias utilidades de accesibilidad.

## Documentación técnica

> Para generar una documetnación técnica del proyecto **UEM** deberemos lanzar el siguiente comando, que nos generará una documentación en la ruta **documentation**

```sh
npm run compodoc
```

## Ver componentes compartidos
**DEMO:** http://localhost:4200/test

## Despliegues / Compilaciones


###### **WEB LOCAL**

> Lanzará la web en local, bajo el propio servidor de Angular cuya ruta por defecto será **http://localhost:4200/test**.

```sh
npm run ng:serve
```

###### **COMPILACIÓN (PRO, PRE y DEV):**

> Compilará la web en la carpeta **/dist** del proyecto.

```sh
npm run build:pro
npm run build:pre
npm run build:dev
```

## Scaffolding

Angular posee diferentes comandos para generar componentes, directivas, servicios, etc... Algunos comandos básicos son:

- `ng generate component component-name` para generar componentes
- `ng generate service service-name` para generar servicios
- `ng generate directive|pipe|class|guard|interface|enum|module` para generar directivas, pipes, guard...

Para más información, revisa la documentación oficial de [Angular CLI](https://angular.io/cli/generate).

## Ejecución de tests

Ejecutar `ng test` para lanzar los test unitarios vía [Karma](https://karma-runner.github.io) / Jasmine .

###### &copy; NEORIS - ÁNGEL JIMÉNEZ
