<template>
  <div class="bgm-box">
    <v-card>
      <v-card-title class="font-weight-bold bgm-box-title">{{name}}</v-card-title>
      <div>メモ</div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BGMBox',
  props: {
    name: String
  }
}
</script>

<style>
.bgm-box-title {
  background-color: aquamarine
}
</style>
