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
    payees: [],
    accounts: [],
    transactions: [],
    loading: false,
    error: null,
    purchasingBudget: null,
    transactionDate: null,
    transactionAmount: null,
    transactionPayee: null,
    transactionAccount: null,
    transactionNotes: null
})

const methods = {
    getBudgets() {
        state.loading = true
        state.error = null
        state.api.budgets.getBudgets().then((res) => {
          state.budgets = res.data.budgets
        }).catch((err) => {
          state.error = err.error.detail
          console.log("Error " + err)
        }).finally(() => {
          state.loading = false
        })
    },
    
    getPayees() {
        state.api.payees.getPayees(state.purchasingBudget.id).then((res) => {
            state.payees = res.data.payees 
        }).catch((err) => {
            state.error = err.error.detail
        }).finally(() => {
            state.loading = false
        })
    },

    getAccounts() {
        state.api.accounts.getAccounts(state.purchasingBudget.id).then((res) => {
            state.accounts = res.data.accounts
        }).catch((err) => {
            state.error = err.error.detail
        }).finally(() => {
            state.loading = false
        })
    },
    
    getPayeesAndAccounts() {
        state.loading = true
        state.error = null
        state.transactionPayee = null
        state.transactionAccount = null     
        if (state.purchasingBudget) {
            this.getPayees()
            this.getAccounts()
        } else {
            console.log("You need to select a budget before you see the payees.")
        }
    },

    // Method to find a YNAB token
    // First it looks in the location.hash and then sessionStorage
    findYNABToken() {
        let token = null
        const search = window.location.hash.substring(2).replace(/&/g, '","').replace(/=/g,'":"')
        if (search && search !== '' && search != 'home' && search != 'home/child') {
          // Try to get access_token from the hash returned by OAuth
           const params = JSON.parse('{"' + search + '"}', function(key, value) {
             return key === '' ? value : decodeURIComponent(value)
           })
           token = params.access_token
           sessionStorage.setItem('ynab_access_token', token)
           window.location.hash = ''
        } else {
          // Otherwise try sessionStorage
          token = sessionStorage.getItem('ynab_access_token')
        }
        return token
    },
  
    // Clear the token and start authorization over
    resetToken() {
        sessionStorage.removeItem('ynab_access_token')
        state.ynab.token = null
        state.error = null
    },

    // data builds a URI to get an access token from YNAB
    // https://api.youneedabudget.com/#outh-applications
    authorizeWithYNAB(e) {
        e.preventDefault()
        const uri = `https://app.youneedabudget.com/oauth/authorize?client_id=${state.ynab.clientId}&redirect_uri=${state.ynab.redirectUri}&response_type=token`
        location.replace(uri)
    }
}

export default {
    state,
    methods
}