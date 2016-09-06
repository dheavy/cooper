<template>
  <button class="add-btn" @click="addHandler(video)">&hearts;</button>
</template>

<script>
  export default {
    name: 'ButtonAdd',

    props: ['addHandler', 'video']
  }
</script>

<style lang="scss" scoped>
.add-btn {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  left: 100%;
  top: 10px;
  margin-left: -40px;
  background-color: transparent;
  border-color: white;
  color: white;
}
</style>
