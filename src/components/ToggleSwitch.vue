<template>
  <div class="switch">
    <input id="cmn-toggle-4" name="cmn-toggle-4" class="cmn-toggle cmn-toggle-round-flat" type="checkbox">
    <label for="cmn-toggle-4"></label>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch'
}
</script>

<style lang="scss" scoped>
  $width: 60px;
  $height: 30px;
  $padding: 1px;
  $radius: 30px;
  $transition-timing: 0.4s;
  $smaller-radius: 26px;

  .cmn-toggle {
    position: absolute;
    margin-left: -9999px;
    visibility: hidden;
  }

  .cmn-toggle + label {
    display: block;
    position: relative;
    cursor: pointer;
  }

  input.cmn-toggle-round-flat + label {
    padding: $padding;
    width: $width;
    height: $height;
    background-color: #dddddd;
    -webkit-border-radius: $radius;
    -moz-border-radius: $radius;
    -ms-border-radius: $radius;
    -o-border-radius: $radius;
    border-radius: $radius;
    -webkit-transition: background $transition-timing;
    -moz-transition: background $transition-timing;
    -o-transition: background $transition-timing;
    transition: background $transition-timing;
  }

  input.cmn-toggle-round-flat + label:before, input.cmn-toggle-round-flat + label:after {
    display: block;
    position: absolute;
    content: "";
  }

  input.cmn-toggle-round-flat + label:before {
    top: $padding;
    left: $padding;
    bottom: $padding;
    right: $padding;
    background-color: #fff;
    -webkit-border-radius: $radius;
    -moz-border-radius: $radius;
    -ms-border-radius: $radius;
    -o-border-radius: $radius;
    border-radius: $radius;
    -webkit-transition: background $transition-timing;
    -moz-transition: background $transition-timing;
    -o-transition: background $transition-timing;
    transition: background $transition-timing;
  }

  input.cmn-toggle-round-flat + label:after {
    top: $padding * 2;
    left: $padding * 2;
    bottom: $padding * 2;
    width: $smaller-radius;
    background-color: #dddddd;
    -webkit-border-radius: $smaller-radius;
    -moz-border-radius: $smaller-radius;
    -ms-border-radius: $smaller-radius;
    -o-border-radius: $smaller-radius;
    border-radius: $smaller-radius;
    -webkit-transition: margin $transition-timing, background $transition-timing;
    -moz-transition: margin $transition-timing, background $transition-timing;
    -o-transition: margin $transition-timing, background $transition-timing;
    transition: margin $transition-timing, background $transition-timing;
  }

  input.cmn-toggle-round-flat:checked + label {
    background-color: #8ce196;
  }

  input.cmn-toggle-round-flat:checked + label:after {
    margin-left: $radius;
    background-color: #8ce196;
  }
</style>
