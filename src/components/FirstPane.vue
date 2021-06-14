<template>
  <div class="container">
    <h5>Transaction Setup</h5>

<q-input
  filled
  v-model="data.price"
  label="Enter amount of transaction:"
  mask="#.##"
  fill-mask="#"
  reverse-fill-mask
  input-class="text-right"
/>
<ul>
  <li v-for="(budget, index) in budgets" :key="index">{{ budget }}</li>
</ul>
  </div>
</template>

<script>
import { reactive } from 'vue'
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
  
    return {
      data
    }
  }
}
</script>