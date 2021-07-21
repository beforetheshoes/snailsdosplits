<template>
  <page>
    
    <page-header>
      <template #title>
        Snails Do Splits!
      </template>
    </page-header>

    <page-body>
      <div class="q-pa-lg">
        <!-- Display a loading message if loading -->
        <h1 v-if="store.state.loading" class="display-4">Loading...</h1>

        <!-- Display an error if we got one -->
        <div v-if="store.state.error">
          <h1 class="display-4">Oops!</h1>
          <p class="lead">{{store.state.error}}</p>
          <button class="btn btn-primary" @click="store.methods.resetToken">Try Again &gt;</button>
        </div>

        <!-- Otherwise show our app contents -->
        <div v-else>

          <!-- If we dont have a token ask the user to authorize with YNAB -->
          <form v-if="!store.state.ynab.token">
            <div class="form-group text-center">
              <h2>Hello!</h2>
              <p class="lead q-pb-xl">Before we begin, please authorize with YNAB!</p>
              <q-btn 
                @click="store.methods.authorizeWithYNAB" 
                padding="xs lg"
                color="primary"
                label="Authorize with YNAB"
              />
            </div>
          </form>

          <FirstPane v-else :budgets="store.state.budgets"></FirstPane>        
          <div v-if="store.state.ynab.token" class="row">
            <div class="column items-center q-pa-xl" style="width: 100%">
              <div class="row">
                <div class="col">
                  <q-btn
                    padding="xs lg"
                    color="primary"
                    :disable="nextStepButtonDisabled()"
                    to="/home/child"
                    label="Next Step"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <q-btn
                    class="q-mt-xl q-mb-xl"
                    color="primary"
                    to="/home"
                    label="Start Over"
                    @click="store.methods.startOver()"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </page-body>

  </page>
</template>

<script>
import { onMounted, inject } from 'vue'
import * as ynab from 'ynab'
import FirstPane from '../../components/FirstPane.vue'

export default {
  name: 'Home',
  components: { FirstPane },
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

    function nextStepButtonDisabled() {
      if (store.state.transactionAccount && 
          store.state.transactionPayee &&
          store.state.transactionAmount &&
          store.state.transactionDate &&
          store.state.transactionDate <= store.todaysDate.value
      ) {
        return false
      } else {
        return true
      }
    }

    return {
      store,
      nextStepButtonDisabled
    }
  }
}
</script>
