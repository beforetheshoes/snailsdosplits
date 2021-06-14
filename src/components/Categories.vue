<template>
  <div class="container">
    <h5>Categories</h5>
    <table class="table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Visibility</th>
        <th>Activity</th>
        <th>Balance</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in categories" v-bind:key="category.id">
        <td>{{category.name}}</td>
        <td>{{category.hidden}}</td>
        <td>{{category.activity}}</td>
        <td>{{category.balance}}</td>
      </tr>
    </tbody>
    </table>
  </div>
</template>

<script>

export default {
  props: ['categories']
}
</script>