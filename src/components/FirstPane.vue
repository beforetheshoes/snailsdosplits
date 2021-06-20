<template>
  <div class="q-pa-sm">
    <h5>Transaction Setup</h5>

    <div class="row">
      <div class="col-md">
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
          @blur="store.methods.getPayeesAndAccounts()"
        />
        <q-select
          class="q-pa-md float-md-end"
          filled
          v-model="store.state.transactionAccount"
          stack-label
          input-debounce="0"
          label="Which account was used for the purchase:"
          :options="data.accountOptions"
          option-value="id"
          option-label="name"
          style="width: 100%"
          @filter="filterFnAccounts"
          :disabled="disabledIfNoBudgetSelected"
        />
        <q-select
          class="q-pa-md float-md-end"
          filled
          v-model="store.state.transactionPayee"
          stack-label
          input-debounce="0"
          label="Who was the payee:"
          :options="data.payeeOptions"
          option-value="id"
          option-label="name"
          style="width: 100%"
          use-input
          @filter="filterFnOptions"
          :disabled="disabledIfNoBudgetSelected"
        />
        <q-input
          class="q-pa-md float-md-start"
          filled
          v-model="store.state.transactionAmount"
          label="Enter amount of transaction:"
          mask="#.##"
          fill-mask="#"
          prefix="$"
          reverse-fill-mask
          input-class="text-right"
          style="width: 100%"
        />
        <q-input 
          class="q-pa-md float-md-end" 
          filled 
          v-model="store.state.transactionNotes" 
          label="Description/Memo" 
          stack-label 
        />
      </div>
      <div class="col-md q-pa-md">
        <q-date
          v-model="store.state.transactionDate"
          today-btn
        />
      </div>
    </div>

    <p>Token {{ store.state.ynab.token }}</p>
    <p>Loading: {{ store.state.loading }}</p>
    <p>Error: {{ store.state.error }}</p>
    <p>Purchasing Budget: {{ store.state.purchasingBudget }}</p>
    <p>Transaction Date: {{ store.state.transactionDate }}</p>
    <p>Transaction Amount: {{ store.state.transactionAmount }}</p>
    <p>Transaction Payee: {{ store.state.transactionPayee }}</p>
    <p>Transaction Account: {{ store.state.transactionAccount }}</p>
    <p>Transaction Notes: {{ store.state.transactionNotes }}</p>
    <p>Budgets: {{ store.state.budgets }}</p>
    <p>Payees: {{ store.state.payees }}</p>
    <p>Accounts: {{ store.state.accounts }}</p>
  </div>
</template>

<script>
import { reactive, inject } from 'vue'

export default {
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
      price: '',
      payeeOptions: [''],
      accountOptions: [''],
    })
  
    const store = inject('store')

    function filterFnOptions (val, update) {
      if (store.state.purchasingBudget && store.state.payees.length === 0) {
        store.methods.getPayeesAndAccounts()
      } else if (store.state.payees.length > 0) {
        data.payeeOptions = store.state.payees
      } else {
        console.log("You need to select a budget before we can load payees.")
      }
      if (val === '') {
        update(() => {
          data.payeeOtions = store.state.payees
        })
        return
      }
      update(() => {  
        const needle = val.toLowerCase()
        data.payeeOptions = store.state.payees.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function filterFnAccounts (val, update) {
      if (store.state.purchasingBudget && store.state.accounts.length === 0) {
        store.methods.getPayeesAndAccounts()
      } else if (store.state.accounts.length > 0) {
        data.accountOptions = store.state.accounts
      } else {
        console.log("You need to select a budget before we can load accounts.")
      }
      if (val === '') {
        update(() => {
          data.accountOptions = store.state.accounts
        })
        return
      }
      update(() => {  
        const needle = val.toLowerCase()
        data.accountOptions = store.state.accounts.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function disabledIfNoBudgetSelected() {
      if (store.state.purchasingBudget.length < 1) {
        return true
      } else {
        return false
      }
    }

    return {
      data,
      store,
      filterFnOptions,
      filterFnAccounts,
      disabledIfNoBudgetSelected
    }
  }
}
</script>