<template>
  <div class="sound-box">
    <div>曲名:</div>{{name}}<br/>
    <div>メモ</div>
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