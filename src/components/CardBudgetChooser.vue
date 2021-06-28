<template>
    <q-dialog @hide="store.methods.getPayeesAndAccounts()">
        <q-card class="my-card" style="width: 300px">
          <q-card-section>
            <q-select
              class="q-my-md float-md-end"
              filled
              v-model="store.state.purchasingBudget"
              option-value="id"
              option-label="name"
              stack-label
              input-debounce="0"
              label="Purchasing budget:"
              :options="store.state.budgets"
              style="width: 100%"
            />
            <q-select
              class="q-my-md float-md-end"
              filled
              v-model="store.state.splittingBudget"
              option-value="id"
              option-label="name"
              stack-label
              input-debounce="0"
              label="Splitting budget:"
              :options="store.state.budgets"
              style="width: 100%"
            />
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn 
              v-close-popup 
              flat 
              color="primary" 
              label="Save" 
              @click="store.methods.getPayeesAndAccounts()"
              />
          </q-card-actions>
        </q-card>
     </q-dialog>
</template>

<script>
import { inject } from 'vue'
export default {
    setup() {
        const store = inject('store')

        return {
            store
        }
    }
}
</script>