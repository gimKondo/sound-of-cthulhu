<template>
  <v-slider
    :max="100"
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
    append-icon="volume_up"
    prepend-icon="volume_down"
  ></v-slider>
</template>

<script>
export default {
  name: 'VolumeControl',
  props: {
    value: Number
  }
}
</script>

<style>
.v-slider {
  margin-left: 8px;
  margin-right: 8px;
}
.v-input--slider {
  margin-left: 8px;
  margin-right: 8px;
}
.v-input--slider .v-input__slot {
  margin-bottom: 0;
}
</style>
