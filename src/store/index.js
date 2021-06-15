import ynabconfig from '../../ynabconfig.json'

import { reactive } from 'vue'

const state = reactive({
    ynab: {
        clientId: ynabconfig.clientId,
        redirectUri: ynabconfig.redirectUri,
        token: null,
        api: null,
    },
    budgets: [],
    loading: false,
    error: null,
    purchasingBudget:null,
    matchingBudget: null,
    transactionDate: null
})

const methods = {
    getBudgets() {
        state.loading = true
        state.error = null
        state.api.budgets.getBudgets().then((res) => {
          console.log(res)
          state.budgets = res.data.budgets
        }).catch((err) => {
          state.error = err.error.detail
          console.log("Error " + err)
        }).finally(() => {
          state.loading = false
        })
      }
}

export default {
    state,
    methods
}