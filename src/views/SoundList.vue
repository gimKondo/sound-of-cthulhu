<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs10>
        <v-layout wrap>
          <v-flex xs6 md4 pa-1 v-for="(name, index) in bgmNames" :key="index">
            <BGMBox :name="name"/>
          </v-flex>
          <v-icon @click="addBGM" size='75'>playlist_add</v-icon>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout wrap>
          <v-flex xs12 pa-1 v-for="(name, index) in seNames" :key="index">
            <SEBox :name="name"/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import BGMBox from '@/components/BGMBox.vue'
import SEBox from '@/components/SEBox.vue'
export default {
  name: 'SoundList',
  components: {
    BGMBox,
    SEBox
  },
  props: {
  },
  methods: {
    addBGM: function () {
      alert('open new BGM file')
    }
  },
  data: () => ({
    bgmNames: ['hoge', 'fuga', 'hogera'],
    seNames: ['bang', 'bomb']
  })
}
</script>
