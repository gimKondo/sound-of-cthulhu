<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <router-link to="/" class="header-logo">Sound of Cthulhu</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/about" class="header-about">About</router-link>
      <v-btn
        flat
        href="https://github.com/gimKondo/sound-of-cthulhu/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>

<style>
.header-logo {
  color:firebrick;
  font-weight: bold;
  text-decoration: none;
}
.header-about {
  color:white;
  text-decoration: none;
}
</style>
