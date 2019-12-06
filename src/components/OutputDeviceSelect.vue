<template>
  <v-select
    :items="items"
    :value="value"
    @input="$emit('input', $event.target.value)"
    item-text="label"
    label="Output Device"
  />
</template>

<script>
export default {
  name: 'OutputDeviceSelect',
  props: {
    items: Array,
    value: Object
  }
}
</script>

<style>
.v-select {
  margin: 8px;
}
</style>
