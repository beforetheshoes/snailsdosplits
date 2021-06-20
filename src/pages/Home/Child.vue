<template>
  <page>
    
    <page-header>
      <template #title>
        YNAB For Snails
      </template>
    </page-header>

    <page-body>
      <h3>Splitting Budget</h3>
      <h3>Splitting Categories For Both People</h3>
      <h3>Splitting Percentages</h3>
    
    </page-body>

  </page>
</template>

<script>
import { onMounted, inject } from 'vue'
import * as ynab from 'ynab'


export default {
  name: 'Child',
  setup() {   
    const store = inject('store')

    onMounted(() => {
      if (!store.state.ynab.token) {
        store.state.ynab.token = store.methods.findYNABToken()
      }

      if (store.state.ynab.token) {
        store.state.api = new ynab.api(store.state.ynab.token)
      
        if (store.state.budgets.length < 1) {
          store.methods.getBudgets()
        } 
      }
    })

    return {
      store
    }
  }
}
</script>
