<template>
  <section class="footer-component">
    <footer class="small col-sm-4 offset-sm-4">
      <a href="#">About</a> • <a href="#">Legal notice</a> • <a href="#">Contact</a>
    </footer>
  </section>
</template>

<script>
  export default {
    name: 'FooterComponent'
  }
</script>

<style lang="scss" scoped>
  footer {
    text-align: center;
    color: white;

    a, a:visited, a:active, a:hover {
      text-decoration: none;
      color: white;

      margin: 0 1rem;
    }
  }
</style>
