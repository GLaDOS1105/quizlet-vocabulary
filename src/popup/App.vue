<template>
  <v-app dark>
    <v-toolbar app dense>
      <img src="@/assets/logo.png" alt="Vuetify.js" class="logo ma-1">
      <v-toolbar-title>In-Page Vocabulary</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <v-btn slot="activator" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
          v-for="(item, index) in items"
          :key="index"
          :href="item.url"
          target="_blank"
          >
          <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content></v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      items: [
        { title: 'Settings', url: chrome.extension.getURL('../options/options.html') },
        { title: 'Rate Extension', url: '#' },
        { title: 'Bugs Report', url: 'https://github.com/GLaDOS1105/quizlet-vocabulary/issues' }
      ]
    }
  }
}
</script>

<style>
html {
    width: 400px;
    height: 400px;
}
.logo {
  max-width: 70%;
  max-height: 70%;
}
</style>
