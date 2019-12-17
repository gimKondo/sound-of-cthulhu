<template>
  <v-select
    :items="items"
    @input="$emit('input', $event)"
    item-text="label"
    item-value="deviceId"
    label="Output Device"
  />
</template>

<script>
export default {
  name: 'OutputDeviceSelect',
  props: {
    items: Array
  }
}
</script>

<style>
.v-select {
  margin: 8px;
}
</style>
