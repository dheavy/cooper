<template>
  <button class="button-collection-delete">
    <svg width="35px" height="40px" viewBox="426 243 35 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(426.000000, 243.000000)">
            <g id="delete">
                <path d="M12.8571429,0 L11.4285714,2.85714286 L2.85714286,2.85714286 C1.27428571,2.85714286 0,4.13142857 0,5.71428571 L0,8.57142857 L34.2857143,8.57142857 L34.2857143,5.71428571 C34.2857143,4.13142857 33.0114286,2.85714286 31.4285714,2.85714286 L22.8571429,2.85714286 L21.4285714,0 L12.8571429,0 Z M2.85714286,11.4285714 L5.35714286,37.1428571 C5.53142857,38.7114286 6.994,40 8.57142857,40 L25.7142857,40 C27.2923429,40 28.7542857,38.7113714 28.9285714,37.1428571 L31.4285714,11.4285714 L2.85714286,11.4285714 Z" id="Shape"></path>
            </g>
        </g>
    </svg>
  </button>
</template>

<script>
  export default {
    name: 'ButtonDeleteCollection'
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/app.scss';

  .button-collection-delete {
    @include btn-collection-rack();
  }

  #delete {
    fill: $color-mp-blue;
  }
</style>
