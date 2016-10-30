<template>
  <button class="button-collection-visibility-component">
    <svg v-show="isPrivate" width="27px" height="40px" viewBox="340 239 27 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(340.000000, 239.000000)">
            <g id="lock-close" fill="#000000">
                <g>
                    <g>
                        <rect id="Rectangle-path" x="0" y="17.7777778" width="26.6666667" height="22.2222222"></rect>
                        <path d="M24.4444444,15.5555556 L20,15.5555556 L20,11.1111111 C20,7.43555556 17.0088889,4.44444444 13.3333333,4.44444444 C9.65777778,4.44444444 6.66666667,7.43555556 6.66666667,11.1111111 L6.66666667,15.5555556 L2.22222222,15.5555556 L2.22222222,11.1111111 C2.22222222,4.98444444 7.20666667,0 13.3333333,0 C19.46,0 24.4444444,4.98444444 24.4444444,11.1111111 L24.4444444,15.5555556 L24.4444444,15.5555556 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>


    <svg v-show="!isPrivate" width="43px" height="40px" viewBox="248 239 43 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(248.000000, 239.000000)">
            <g id="lock-open" fill="#000000">
                <g>
                    <g>
                        <rect id="Rectangle-path" x="0" y="17.7777778" width="26.6666667" height="22.2222222"></rect>
                        <path d="M42.2222222,15.5555556 L37.7777778,15.5555556 L37.7777778,11.1111111 C37.7777778,7.43555556 34.7866667,4.44444444 31.1111111,4.44444444 C27.4355556,4.44444444 24.4444444,7.43555556 24.4444444,11.1111111 L24.4444444,15.5555556 L20,15.5555556 L20,11.1111111 C20,4.98444444 24.9844444,0 31.1111111,0 C37.2377778,0 42.2222222,4.98444444 42.2222222,11.1111111 L42.2222222,15.5555556 L42.2222222,15.5555556 Z" id="Shape"></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>
  </button>
</template>

<script>
  export default {
    name: 'ButtonCollectionVisibility',

    props: ['isPrivate']
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/app.scss';

  .button-collection-visibility-component {
    @include btn-collection-rack();
  }

  #lock-open, #lock-close {
    fill: $color-mp-blue;
  }
</style>
