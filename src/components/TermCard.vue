<template>
  <v-flex xs12>
    <v-card>
      <v-container fill-height fluid>
        <v-layout fill-height>
          <v-flex xs5>
            <span class="title">{{term}}</span>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex xs7>
            <span class="subheading">{{definition}}</span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'TermCard',
  props: ['term', 'definition']
}
</script>

<style scoped>
span {
  word-break: break-all;
}
</style>
