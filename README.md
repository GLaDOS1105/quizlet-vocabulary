# quizlet-vocabulary

## Options UI

* Quizlet Set URLs // After get API
* Auto Injection?
  * Inclusive List
* Marker Style
* About

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

## How to Create the Template with [`browser-extension`](https://github.com/adambullmer/vue-cli-plugin-browser-extension) and `vuetify` Plugins (this project for example)

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

### Remove Vue-Router and Vuex Dependencies

``` bash
// remove vue-router and vuex
npm uninstall --save vue-router vuex
```

* Remove `src/store` folder.
* Modify [`src/background.js`](src/background.js) to remove `src/store` dependency.
* Remove `src/popup/router` folder.
* Modify [`src/popup/App.vue`](src/popup/App.vue) to remove `src/popup/router` dependency.
* Modify [`src/popup/popup.js`](src/popup/popup.js) to remove `./router` and `../store` dependencies.
