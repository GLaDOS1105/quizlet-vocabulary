<template>
  <v-app dark>
    <v-toolbar app dense>
      <img src="@/assets/logo.png" alt="Vuetify.js" class="logo ma-1">
      <v-toolbar-title>In-Page Vocabulary</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-menu bottom left>
        <v-btn slot="activator" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
          v-for="(item, index) in menuItems"
          :key="index"
          :href="item.url"
          target="_blank"
          >
          <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container grid-list-md>
        <v-layout row wrap>
          <term-card
          v-for="(item, index) in termItems"
          :key="index"
          :term="item.term"
          :definition="item.definition"
          ></term-card>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import TermCard from '../components/TermCard'

export default {
  components: {
    TermCard
  },
  data () {
    return {
      menuItems: [
        { title: 'Settings', url: chrome.extension.getURL('../options/options.html') },
        { title: 'Rate Extension', url: '#' },
        { title: 'Bugs Report', url: 'https://github.com/GLaDOS1105/quizlet-vocabulary/issues' }
      ],
      termItems: [
        { term: 'why', definition: '為什麼' },
        { term: 'so', definition: '如此' },
        { term: 'superfluous', definition: '多餘' }
      ]
    }
  }
}
</script>

<style>
html {
  width: 400px;
  min-height: 200px;
}
.logo {
  max-width: 70%;
  max-height: 70%;
}
</style>
