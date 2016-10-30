<template>
  <section class="search-component">
    <input type="text" placeholder="search" class="search-input">
    <div class="misc">
      <svg width="17px" height="13px" viewBox="221 11 17 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="cta_filter" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(221.000000, 11.000000)">
              <rect id="Rectangle-2" fill="#DBE1FF" x="0" y="0" width="17" height="3" rx="1.5"></rect>
              <rect id="Rectangle-2-Copy" fill="#DBE1FF" x="0" y="5" width="17" height="3" rx="1.5"></rect>
              <rect id="Rectangle-2-Copy-2" fill="#DBE1FF" x="0" y="10" width="11" height="3" rx="1.5"></rect>
          </g>
      </svg>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'SearchInput'
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/definitions';

  .search-component {
    margin-top: 0;
    width: 250px;
    height: 34px;
    background-color: transparent;
    @include prefix('border-radius', 20px);
    @include border-color-light-lavender();
    border-style: solid;
    border-width: 1px;

    .search-input {
      position: absolute;
      background: transparent;
      border: none;
      margin-left: 15px;
      margin-top: 4px;
      width: 196px;
      outline: none;
    }

    .misc {
      width: 25px;
      height: 25px;
      display: table;
      position: relative;
      text-align: center;
      float: right;
      right: 6px;
      top: 3px;

      &:after {
        content: ' \2022';
        border-left-style: solid;
        border-left-width: 1px;
        border-color: #DBE1FF;
        position: absolute;
        text-indent: -99999rem;
        margin-left: -19px;
        margin-top: -28px;
        height: 32px;
      }

      svg {
        display: table-cell;
        vertical-align: middle;
        margin: 0 auto;
        height: 100%;
      }
    }
  }
</style>
