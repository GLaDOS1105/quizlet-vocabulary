<template>
  <v-app style="background: initial">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader>Highlight</v-subheader>

            <v-list-tile @click=";">
              <v-list-tile-content @click="autoHighlight = !autoHighlight">
                <v-list-tile-title>Automatically Highlight</v-list-tile-title>
                <v-list-tile-sub-title>Automatically highlight the words in user-defined term sets.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-switch v-model="autoHighlight"></v-switch>
              </v-list-tile-action>
            </v-list-tile>

          </v-list>

          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs9>
                <v-subheader>Target URUs</v-subheader>
              </v-flex>
              <v-flex xs3>
                <v-btn depressed>Add Website</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-data-table
            :headers="[{ text: 'URL', value: 'url' }]"
            :items="urls"
            item-key="url"
            v-model="selectedUrls"
            hide-actions
            select-all
          >
            <template slot="items" slot-scope="props">
              <td>
                <v-checkbox
                  v-model="props.selected"
                  hide-details
                  :disabled="!autoHighlight"></v-checkbox>
              </td>
              <td>{{ props.item.url }}</td>
            </template>
          </v-data-table>

          <v-list subheader two-line>
            <v-subheader>Mark Style</v-subheader>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Marking Text Color</v-list-tile-title>
                <v-list-tile-sub-title>Set the marking text color.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-text-field
                  style="border: 0"
                  label="Named Color or Hex Code"
                  box
                  clearable></v-text-field>
              </v-list-tile-action>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Marking Background Color</v-list-tile-title>
                <v-list-tile-sub-title>Set the marking background color.</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-text-field
                  style="border: 0"
                  label="Named Color or Hex Code"
                  box
                  clearable></v-text-field>
              </v-list-tile-action>
            </v-list-tile>

          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      autoHighlight: true,
      selectedUrls: [],
      urls: [
        { url: 'www.google.com' },
        { url: 'www.facebook.com' }
      ],
      // TODO: replace this with color picker
      markingBgColor: 'LightCoral',
      markingFgColor: '#262626'
    }
  }
}
</script>

<style>
html {
  min-width: 600px;
}
body {
  font-size: initial;
}

/* To fix unknown wierd injected stylesheet... */
input {
  border-width: 0 !important;
}
</style>
