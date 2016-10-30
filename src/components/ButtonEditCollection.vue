<template>
  <button class="button-edit-collection-component">
    <svg width="40px" height="40px" viewBox="196 239 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="edit" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(196.000000, 239.000000)">
            <g id="pencil" fill="#">
                <g transform="translate(1.065831, 0.316274)" id="Shape">
                    <path d="M28.5893417,0.179593388 L24.2946708,4.42546116 L32.8213166,12.8552132 L37.1159875,8.60934545 L28.5893417,0.179593388 L28.5893417,0.179593388 Z M22.8683386,5.83558512 L3.73040752,24.7560397 L12.2570533,33.1857917 L31.3949843,14.2653372 L22.8683386,5.83558512 L22.8683386,5.83558512 Z M2.42946708,26.2901306 L0,36.8738083 L10.7053292,34.4719488 L2.42946708,26.2901306 L2.42946708,26.2901306 Z"></path>
                </g>
            </g>
        </g>
    </svg>
  </button>
</template>

<script>
  export default {
    name: 'ButtonEditCollection'
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/app.scss';

  .button-edit-collection-component {
    @include btn-collection-rack();
  }

  #pencil {
    fill: $color-mp-blue;
  }
</style>
