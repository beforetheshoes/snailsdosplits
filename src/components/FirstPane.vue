<template>
  <div class="container">
    <h5>Transaction Setup</h5>

    <div class="row">
      <div class="col-md">
        <q-input
          class="q-pa-md float-md-start"
          filled
          v-model="data.price"
          label="Enter amount of transaction:"
          mask="#.##"
          fill-mask="#"
          reverse-fill-mask
          input-class="text-right"
          style="width: 100%"
        />
        <q-select
          class="q-pa-md float-md-end"
          filled
          v-model="store.state.purchasingBudget"
          option-value="id"
          option-label="name"
          stack-label
          input-debounce="0"
          label="Who made the purchase:"
          :options="store.state.budgets"
          style="width: 100%"
        />
      </div>
      <div class="col-md q-pa-md">
        <q-date
          v-model="store.state.transactionDate"
          today-btn
        />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, inject } from 'vue'

export default {
  props: ['budgets'],
  setup() {
    
    let data = reactive({
      moneyFormatForDirective: {
      decimal: '.',
      thousands: ',',
      prefix: '$ ',
      suffix: ' #',
      precision: 2,
      masked: false /* doesn't work with directive */
      },
      price: ''
    })
  
    const store = inject('store')

    const options = {}
    return {
      data,
      store
    }
  }
}
</script>