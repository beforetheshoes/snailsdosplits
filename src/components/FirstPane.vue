<template>
  <div class="q-pa-md q-gutter-sm" v-if="store.state.purchasingBudget && store.state.unapprovedPurchaserTransactions.length > 0 && !store.state.unapprovedUpdateTransactionId">
    <q-banner dense rounded class="bg-accent text-h5 text-white col-auto">
      {{ store.state.purchasingBudget.name }}'s budget has unapproved transactions. Would you like to split one?
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="store.state.unapprovedPurchaserTransactions.length = 0" />
        <q-btn flat color="white" label="Select transaction" @click="data.cardUnapprovedTransaction = true"/>
      </template>
    </q-banner>

    <card-unapproved-transaction v-model="data.cardUnapprovedTransaction"></card-unapproved-transaction>
  </div>
  <div>
      <div class="q-pa-md q-gutter-md text-center">
        <q-badge 
          v-if="store.state.unapprovedUpdateTransactionId" 
          outline 
          multi-line
          color="primary" 
          label="You are updating an existing transaction"
          class="q-px-auto q-my-md text-center text-subtitle1 text-weight-bold"
        />
        <p v-else class="text-center text-bold">New Transaction Setup</p>
      </div>
    <div class="col">

    <q-btn 
      @click="data.cardBudgetChooser = true"
      style="width:100%"
      :label="cardBudgetChooserLabel"
    >
    </q-btn>
      
      <card-budget-chooser v-model="data.cardBudgetChooser"></card-budget-chooser>

      <q-select
        class="q-my-md float-md-end"
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
        :disabled="disabledIfConditions"
        :readonly="disabledIfConditions"
      />
      <q-select
        class="q-my-md float-md-end"
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
        :disabled="disabledIfConditions"
        :readonly="disabledIfConditions"
      />
      <q-input 
        class="q-my-md float-md-end" 
        filled 
        v-model="store.state.transactionNotes" 
        label="Description/Memo" 
        stack-label 
      />
      <q-input class="q-my-md" 
               filled 
               v-model="store.state.transactionDate" 
               mask="date" 
               :rules="['date', val => val <= store.todaysDate.value || 'Date cannot be in future']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date 
                v-model="store.state.transactionDate"
                :options="dateOptionsFn">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <currency-input
        v-if="!store.state.unapprovedUpdateTransactionId"
        v-model="store.state.transactionAmount"
        :options="{ currency: 'USD', autoDecimalDigits: true, valueRange: {min:0,max:undefined}, autoSign:true, exportValueAsInteger: true}"
        class="q-my-md"
      />
      <q-input
        v-else
        :model-value="'$' + store.state.transactionAmount / 100"
        disabled
        readonly
        filled
        class="text-weight-thin"
      ></q-input>
      <div class="q-gutter-sm text-center">
        <q-checkbox 
          left-label 
          v-model="store.state.transactionCleared" 
          label="Check this box if the transaction has already cleared" 
          :disable="disabledIfConditions"
        />
      </div>
      <div v-if="store.state.unapprovedUpdateTransactionId" class="text-center text-weight-bold">
        <q-separator class="q-my-md" />
          When updating a transaction, only the memo and date fields can be modified.
        <q-separator class="q-my-md" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, inject, computed, onMounted } from 'vue'
import CurrencyInput from './CurrencyInput.vue'
import CardBudgetChooser from './CardBudgetChooser.vue'
import CardUnapprovedTransaction from './CardUnapprovedTransaction.vue'

export default {
  inheritAttrs: false,
  components: { 
    CurrencyInput, 
    CardBudgetChooser,
    CardUnapprovedTransaction
  },
  setup() {
    
    let data = reactive({
      payeeOptions: [''],
      accountOptions: [''],
      cardBudgetChooser: false,
      cardUnapprovedTransaction: false
    })
  
    const store = inject('store')

    onMounted(() => {
      store.state.transactionDate = store.todaysDate.value
    })

    function filterFnOptions (val, update) {
      if (store.state.purchasingBudget && store.state.payees.length === 0) {
        store.methods.getPayeesAndAccounts()
      } else if (store.state.payees.length > 0) {
        data.payeeOptions = store.state.payees
      } else {
        console.log("You need to select a budget before we can load payees.")
      }
      const searchRegex = new RegExp(/Transfer :.*/, 'i')
      if (val === '') {
        update(() => {
          //let obj = store.state.payees.filter(function (payee) { return !searchRegex.test(payee.name) })
          let obj = store.state.payees.filter(v => (!searchRegex.test(v.name)))
          data.payeeOtions = obj
        })
      }
      update(() => {  
        const needle = val.toLowerCase()
        data.payeeOptions = store.state.payees.filter(v => (!searchRegex.test(v.name)) && (v.name.toLowerCase().indexOf(needle) > -1))
      })
    }

    function filterFnAccounts (val, update) {
      if (store.state.purchasingBudget && store.state.accounts.length === 0) {
        store.methods.getPayeesAndAccounts()
      } else if (store.state.accounts.length > 0) {
        const searchRegex = new RegExp(/.* [|] YNABFS/, 'g')
        let obj = store.state.accounts.filter(function (account) { return !searchRegex.test(account.name) })
        //data.accountOptions = store.state.accounts
        data.accountOptions = obj
      } else {
        console.log("You need to select a budget before we can load accounts.")
      }
      if (val === '') {
        update(() => {
        const searchRegex = new RegExp(/.* [|] YNABFS/, 'i')
        let obj = store.state.accounts.filter(function (account) { return !searchRegex.test(account.name) })
          //data.accountOptions = store.state.accounts
          data.accountOptions = obj
        })
        return
      }
      update(() => {  
        const needle = val.toLowerCase()
        //data.accountOptions = store.state.accounts.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
        data.accountOptions = obj.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }

    const disabledIfConditions = computed(() => {
      if (store.state.purchasingBudget) {
        if (store.state.purchasingBudget.length < 1 || store.state.unapprovedUpdateTransactionId) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })

    const cardBudgetChooserLabel = computed(() => {
      if (store.state.purchasingBudget && store.state.splittingBudget) {
        const purchBudget = store.state.purchasingBudget['name']
        const splitBudget = store.state.splittingBudget['name']
        return purchBudget + " split with " + splitBudget
      } else {
        return 'Choose Budgets'
      }
    })

    function dateOptionsFn(date) {
      return date <= store.todaysDate.value
    }

    return {
      data,
      store,
      filterFnOptions,
      filterFnAccounts,
      disabledIfConditions,
      cardBudgetChooserLabel,
      dateOptionsFn
    }
  }
}
</script>