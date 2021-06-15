<template>
    <div class="container">

      <!-- Display a loading message if loading -->
      <h1 v-if="store.state.loading" class="display-4">Loading...</h1>

      <!-- Display an error if we got one -->
      <div v-if="store.state.error">
        <h1 class="display-4">Oops!</h1>
        <p class="lead">{{store.state.error}}</p>
        <button class="btn btn-primary" @click="resetToken">Try Again &gt;</button>
      </div>

      <!-- Otherwise show our app contents -->
      <div v-else>

        <!-- If we dont have a token ask the user to authorize with YNAB -->
        <form v-if="!store.state.ynab.token">
          <h1 class="display-4">Congrats!</h1>
          <p class="lead">You have successfully started a new YNAB API Application!</p>
          <ul>
            <li>Please go to your <a href="https://app.youneedabudget.com/settings/developer" target="_blank" rel="noopener noreferrer">YNAB Developer Settings</a> and create a new OAuth Application.</li>
            <li>Copy your client ID and redirect URI into <em>src/config.json</em>.</li>
            <li>Then build your amazing app!</li>
          </ul>
          <p>If you have any questions please reach out to us at <strong>api@youneedabudget.com</strong>.</p>
          <p>&nbsp;</p>

          <div class="form-group">
            <h2>Hello!</h2>
            <p class="lead">If you would like to use data App, please authorize with YNAB!</p>
            <button @click="authorizeWithYNAB" class="btn btn-primary">Authorize data App With YNAB &gt;</button>
          </div>
        </form>

        <!-- Otherwise if we have a token, show the budget select -->
        <Budgets v-else-if="!data.budgetId" :budgets="store.state.budgets" :selectBudget="selectBudget" />

        <!-- If a budget has been selected, display transactions from that budget -->
        <div v-else>
          <Transactions :transactions="data.transactions" />
          <button class="btn btn-info" @click="budgetId = null">&lt; Select Another Budget</button>
        </div>

      </div>
    </div>
</template>

<script>
import { defineComponent, reactive, onMounted, inject } from 'vue'
import * as ynab from 'ynab'

import Budgets from '../components/Budgets.vue'
import Transactions from '../components/Transactions.vue'
import Categories from '../components/Categories.vue'




export default defineComponent({
  name: 'PageIndex',
  components: { Budgets, Transactions },
  setup() {
    let data = reactive({
        budgetId: null,
        transactions: []
      })
    
    const store = inject('store')

    onMounted(() => {
      store.state.ynab.token = findYNABToken()
      if (store.state.ynab.token) {
        store.state.api = new ynab.api(store.state.ynab.token)
      
        if (!data.budgetId) {
          store.methods.getBudgets()
        } else {
          selectBudget(data.budgetId)
        }
      }
    })


    // data selects a budget and gets all the transactions in that budget
    function selectBudget(id) {
      store.state.loading = true
      store.state.error = null
      data.budgetId = id
      data.transactions = []
      store.state.api.transactions.getTransactions(id).then((res) => {
        data.transactions = res.data.transactions
      }).catch((err) => {
        store.state.error = err.error.detail
      }).finally(() => {
        store.state.loading = false
      })
    }

    // data builds a URI to get an access token from YNAB
    // https://api.youneedabudget.com/#outh-applications
    function authorizeWithYNAB(e) {
      e.preventDefault()
      const uri = `https://app.youneedabudget.com/oauth/authorize?client_id=${store.state.ynab.clientId}&redirect_uri=${store.state.ynab.redirectUri}&response_type=token`
      location.replace(uri)
    }

    // Method to find a YNAB token
    // First it looks in the location.hash and then sessionStorage
    function findYNABToken() {
      let token = null
      const search = window.location.hash.substring(2).replace(/&/g, '","').replace(/=/g,'":"')
      if (search && search !== '') {
        console.log(search)
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
    }

    // Clear the token and start authorization over
    function resetToken() {
      sessionStorage.removeItem('ynab_access_token')
      store.state.ynab.token = null
      store.state.error = null
    }

    return {
      data,
      selectBudget,
      authorizeWithYNAB,
      findYNABToken,
      resetToken,
      store
    }
  }
})
</script>
