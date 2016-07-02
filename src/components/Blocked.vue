<template>
  <section class="blocked row">
    <div v-if="$loadingRouteData">Loading</div>

    <div class="row">
      <div v-else class="col-sm-6">
        <table class="table">
          <thead>
            <th>Users</th>
            <th></th>
          </thead>
          <tbody>
            <tr>
              <td>Hello</td>
              <td>World</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="col-sm-6">
        <h6>Collections</h6>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Blocked'
}
</script>
