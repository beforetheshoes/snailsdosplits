<template>
  <div>
    <p class="text-center text-bold">Transaction Setup</p>
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
        :disabled="disabledIfNoBudgetSelected"
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
        :disabled="disabledIfNoBudgetSelected"
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
        v-model="store.state.transactionAmount"
        :options="{ currency: 'USD', autoDecimalDigits: true, valueRange: {min:0,max:undefined}, autoSign:true, exportValueAsInteger: true}"
        class="q-my-md"
      />
      <div class="q-gutter-sm text-center">
        <q-checkbox 
          left-label 
          v-model="store.state.transactionCleared" 
          label="Check this box if the transaction has already cleared" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, inject, computed, onMounted } from 'vue'
import CurrencyInput from './CurrencyInput.vue'
import CardBudgetChooser from './CardBudgetChooser.vue'

export default {
  components: { CurrencyInput, CardBudgetChooser },
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
      cardBudgetChooser: false
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

    function disabledIfNoBudgetSelected() {
      if (store.state.purchasingBudget.length < 1) {
        return true
      } else {
        return false
      }
    }

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
      disabledIfNoBudgetSelected,
      cardBudgetChooserLabel,
      dateOptionsFn
    }
  }
}
</script>