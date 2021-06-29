import ynabconfig from '../../ynabconfig.json'

import { reactive, computed } from 'vue'
import { store } from 'quasar/wrappers'

const state = reactive({
    ynab: {
        //clientId: ynabconfig.clientId,
        //redirectUri: ynabconfig.redirectUri,
        clientId: process.env.CLIENT_ID,
        redirectUri: process.env.REDIRECT_URI,
        token: null,
        api: null,
    },
    budgets: [],
    payees: [],
    accounts: [],
    splittersAccounts: [],
    transactions: [],
    loading: false,
    error: null,
    purchasingBudget: null,
    splittingBudget: null,
    transactionDate: null,
    transactionAmount: null,
    purchaserAmount: null,
    splitterAmount: null,
    transactionPayee: null,
    transactionAccount: null,
    transactionNotes: null,
    transactionCleared: false,
    allPurchaserCategories: [],
    allSplitterCategories: [],
    purchaserCategorySplits: [],
    splitterCategorySplits: [],
    splittersAccountInPurchasersBudget: null,
    purchasersAccountInSplittersBudget: null,
    splittersCategoryInPurchasersBudget: null,
    purchasersCategoryInSplittersBudget: null
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

    getSplittersAccounts() {
        state.api.accounts.getAccounts(state.splittingBudget.id).then((res) => {
            state.splittersAccounts = res.data.accounts
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
            this.getSplittersAccounts()
        } else {
            console.log("You need to select a budget before you see the payees.")
        }
    },

    checkSplittersAccountInPurchasersBudget() {
        if (state.splittingBudget.name) {
            const search = state.splittingBudget.name + ' | YNABFS'
            const splitYNABFS = state.accounts.find(o => o.name === search)
            if (splitYNABFS) {
                state.splittersAccountInPurchasersBudget = splitYNABFS
            } 
        } 
    },

    checkPurchasersAccountInSplittersBudget() {
        if (state.purchasingBudget.name) {
            const search = state.purchasingBudget.name + ' | YNABFS'
            const splitYNABFS = state.splittersAccounts.find(o => o.name === search)
            if (splitYNABFS) {
                state.purchasersAccountInSplittersBudget = splitYNABFS
            } 
        } 
    },

    getPurchaserCategories() {
        state.api.categories.getCategories(state.purchasingBudget.id).then((res) => {
            const categoryGroups = res.data.category_groups
            Object.entries(categoryGroups).forEach(categoryGroupEntry => {
                const[categoryGroupKey, categoryGroupValue] = categoryGroupEntry;
                if (categoryGroupValue.name !== 'Internal Master Category' && 
                    categoryGroupValue.name !== 'Credit Card Payments' &&
                    categoryGroupValue.name !== 'Hidden Categories') {
                    Object.entries(categoryGroupValue["categories"]).forEach(eachCategory => {
                        const[eachCategoryKey, eachCategoryValue] = eachCategory
                        if (eachCategoryValue["hidden"] === false && eachCategoryValue["deleted"] === false) {
                            state.allPurchaserCategories.push(eachCategoryValue)
                        }
                    })
                }
            })
        }).catch((err) => {
            state.error = err.error.detail
        }).finally(() => {
            state.loading = false
        })
    },
    
    getSplitterCategories() {
        state.api.categories.getCategories(state.splittingBudget.id).then((res) => {
            const categoryGroups = res.data.category_groups
            Object.entries(categoryGroups).forEach(categoryGroupEntry => {
                const[categoryGroupKey, categoryGroupValue] = categoryGroupEntry;
                if (categoryGroupValue.name !== 'Internal Master Category' && 
                    categoryGroupValue.name !== 'Credit Card Payments' &&
                    categoryGroupValue.name !== 'Hidden Categories') {
                    Object.entries(categoryGroupValue["categories"]).forEach(eachCategory => {
                        const[eachCategoryKey, eachCategoryValue] = eachCategory
                        if (eachCategoryValue["hidden"] === false && eachCategoryValue["deleted"] === false) {
                            state.allSplitterCategories.push(eachCategoryValue)
                        }
                    })
                }
            })
        }).catch((err) => {
            state.error = err.error.detail
        }).finally(() => {
            state.loading = false
        })
    },

    // Method to find a YNAB token
    // First it looks in the location.hash and then sessionStorage
    findYNABToken() {
        let token = null
        const search = window.location.hash.substring(2).replace(/&/g, '","').replace(/=/g,'":"')
        if (search && search !== '' && 
            search != 'home' && 
            search != 'home/child' &&
            search != 'home/' &&
            search != 'home/child/grandchild'
        ) {
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

const todaysDate = computed (() => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = yyyy + '/' + mm + '/' + dd
    return today
  })

  const purchaserCategoryTotal = computed(() => {
    if (state.purchaserCategorySplits.length > 0) {
      const toReturn = state.purchaserCategorySplits.reduce(function(prev, cur) {
        return prev + cur.amount
      }, 0)
      return toReturn
    } else {
      return null
    }
  })

  const splitterCategoryTotal = computed(() => {
    if (state.splitterCategorySplits.length > 0) {
      const toReturn = state.splitterCategorySplits.reduce(function(prev, cur) {
        return prev + cur.amount
      }, 0)
      return toReturn
    } else {
      return null
    }
  })

export default {
    state,
    methods,
    todaysDate,
    purchaserCategoryTotal,
    splitterCategoryTotal
}