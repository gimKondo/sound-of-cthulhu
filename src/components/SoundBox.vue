<template>
  <div class="sound-box">
    <v-card>
      <v-card-title class="font-weight-bold">{{name}}</v-card-title>
      <div>メモ</div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'SoundBox',
  props: {
    name: String
  }
}
</script>
