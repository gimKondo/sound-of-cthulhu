<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline">
        <router-link to="/" class="header-logo">
          <img src="../icons/Images/logo1.png" class="header-icon"/>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
.header-icon {
  padding-top: 0.5em;
  padding-right: 0.5em;
}
</style>
