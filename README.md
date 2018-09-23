# quizlet-vocabulary

## Project setup

``` bash
npm install
```

### Compiles and hot-reloads for development

``` bash
npm run serve
```

### Compiles and minifies for production

``` bash
npm run build
```

### Lints and fixes files

``` bash
npm run lint
```

## How to Create the Template with `browser-extension` and `vuetify` Plugins (this project for example)

``` bash
npm install @vue/cli -g

// custom settings:
//  * Babel
//  * CSS Pre-processors: Sass/SCSS
//  * Linter + Formatter: Eslint + Standard
vue create my-app

cd my-app

// custom settings:
//  * background.js
//  * popup page
//  * options page
//  * content_scripts
vue add browser-extension

vue add vuetify // all options are default settings when running
```
