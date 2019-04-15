<template>
  <div class="se-box">
    <v-card>
      <v-card-title class="font-weight-bold se-box-title">{{name}}</v-card-title>
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
.se-box-title {
  background-color:darkkhaki
}
</style>
