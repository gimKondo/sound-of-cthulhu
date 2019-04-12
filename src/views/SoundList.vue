<template>
  <v-container>
    <router-link to="/">Home</router-link>
    <v-layout wrap>
      <v-flex xs6 md4 v-for="(name, index) in names" :key="index">
        <SoundBox :name="name"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SoundBox from '@/components/SoundBox.vue'
export default {
  name: 'SoundList',
  components: {
    SoundBox
  },
  props: {
  },
  data: () => ({
    names: ['hoge', 'fuga', 'hogera']
  })
}
</script>
