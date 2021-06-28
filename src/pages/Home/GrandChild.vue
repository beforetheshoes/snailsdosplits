<template>
  <page>
    
    <page-header>
      <template #title>
        YNAB For Snails
      </template>
    </page-header>

    <page-body class="text-center">
        <q-btn 
          v-if="data.purchaserTransactionResponse === 'Successful'"
          class="q-ma-xl"  
          outline 
          rounded 
          icon="verified"
          color="positive" 
          label="Success" />
        <div v-if="store.state.ynab.token && store.state.purchasingBudget">
            <h5>Please verify transactions before posting</h5>
            <!-- <matching-verification></matching-verification> -->
            <purchaser-match-verification
                :date="date"
                :memo="memo"
            >
            </purchaser-match-verification>
            <purchaser-verification
                :date="date"
                :purchaserCategoryId="data.purchaserCategoryId"
                :subtransactions="data.purchaserSubtransactions"
                :memo="memo"
                :cleared="cleared"
            >
            </purchaser-verification>
            <splitter-verification
                :date="date"
                :splitterCategoryId="splitterCategoryId"
                :splitterSubtransactions="data.splitterSubtransactions"
                :memo="memo"
            >
            </splitter-verification>
        </div>

        <div>
            <q-btn
            v-if="store.state.ynab.token && store.state.purchaserAmount && data.purchaserTransactionResponse === null"
            class="q-my-md"
            padding="xs lg"
            color="primary"
            @click="createPurchaserTransaction()"
            label="Submit Purchaser Transaction"
            />
        </div>
        <div>
            <q-btn
            v-if="store.state.ynab.token && store.state.purchaserAmount && data.purchaserBalanceTransactionResponse === null"
            class="q-my-md"
            padding="xs lg"
            color="primary"
            @click="createPurchaserBalanceTransaction()"
            label="Submit Purchaser Balance Transaction"
            />
        </div>
        <div>
            <q-btn
            v-if="store.state.ynab.token && store.state.purchaserAmount && data.splitterTransactionResponse === null"
            class="q-my-md"
            padding="xs lg"
            color="primary"
            @click="createSplitterTransaction()"
            label="Submit Splitter Transaction"
            />
        </div>
        <div>
            <q-btn
            v-if="store.state.ynab.token && store.state.purchaserAmount"
            class="q-my-md"
            padding="xs lg"
            color="primary"
            to="/home/child"
            label="Back"
            />
        </div>
        <pre>{{ store.state.purchaserCategorySplits }}</pre>
        <pre>{{ store.state.splitterCategorySplits }}</pre>
    </page-body>
  </page>
</template>

<script>
import { reactive, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as ynab from 'ynab'
import PurchaserVerification from 'src/components/PurchaserVerification.vue'
import MatchingVerification from 'src/components/MatchingVerification.vue'
import PurchaserMatchVerification from 'src/components/PurchaserMatchVerification.vue'
import SplitterVerification from 'src/components/SplitterVerification.vue'

export default {
  components: { 
      PurchaserVerification, 
      //MatchingVerification, 
      PurchaserMatchVerification,
      SplitterVerification },
  name: 'GrandChild',
  setup() {   
    const data = reactive({
        purchaserSubtransactions: [],
        purchaserTransactionResponse: null,
        splitterSubtransactions: [],
        splitterTransactionResponse: null,
        purchaserCategoryId: null,
        purchaserBalanceTransactionResponse: null
    })

    const store = inject('store')

    const router = useRouter()

    onMounted(() => {
      if (!store.state.purchasingBudget || !store.state.ynab.token) {
        router.push('/home/')
      }

      if (store.state.splitterCategorySplits && store.state.purchaserCategorySplits) {
        getPurchaserSubtransactions()
        getSplitterSubtransactions()
      }
    })


    const splitterCategoryId = computed(() => {
        if (store.state.splitterCategorySplits.length > 1) {
            return null
        } else if (store.state.splitterCategorySplits.length === 1) {
            return store.state.splitterCategorySplits[0].id
        } else {
            return null
        }
    })

    const memo = computed(() => {
        if (store.state.transactionNotes === null) {
            return "No memo provided [YNAB For Snails]"
        } else {
            return store.state.transactionNotes + " [YNAB For Snails]"
        }
    })

    const date = computed(() => {
        if (store.state.transactionDate) {
            return store.state.transactionDate.replace(new RegExp('/', 'g'), '-')
        } else {
            return false
        }
    })

    const cleared = computed(() => {
        if (store.state.transactionCleared) {
            return "cleared"
        } else {
            return "uncleared"
        }
    })

    function getPurchaserSubtransactions() {
        if (store.state.purchaserCategorySplits.length >= 1) {
            for (let i = 0; i < store.state.purchaserCategorySplits.length; i++) {
                if (store.state.purchaserCategorySplits[i].amount > 0) {
                    data.purchaserSubtransactions.push({ 
                        amount: -(store.state.purchaserCategorySplits[i].amount * 1000),
                        category_id: store.state.purchaserCategorySplits[i].id,
                    })
                }
            }
            let splitterCategoryToFind = store.state.splittingBudget['name'] + " | YNABFS"
            let splitterCategory = store.state.allPurchaserCategories.find(o => o.name === splitterCategoryToFind)
            if (splitterCategory) {
                data.purchaserSubtransactions.push({
                    amount: -(store.state.splitterAmount * 1000),
                    category_id: splitterCategory.id
                })
            }
        } else {
            return false
        }
    }

    function getSplitterSubtransactions() {
        if (store.state.splitterCategorySplits.length > 1) {
            for (let i = 0; i < store.state.splitterCategorySplits.length; i++) {
                if (store.state.splitterCategorySplits[i].amount > 0) {
                    data.splitterSubtransactions.push({ 
                        amount: -(store.state.splitterCategorySplits[i].amount * 1000),
                        category_id: store.state.splitterCategorySplits[i].id,
                    })
                }
            }
            console.log(data.splitterSubtransactions)
        } else {
            return false
        }
    }

    const purchaserTransaction = computed(() => {
        if (
            store.state.transactionAccount.id &&
            store.state.transactionAmount &&
            store.state.transactionPayee
        ) {
            return {
                account_id: store.state.transactionAccount.id,
                date: date.value,
                amount: -(store.state.transactionAmount * 1000),
                payee_id: store.state.transactionPayee.id,
                payee_name: store.state.transactionPayee.name,
                category_id: data.purchaserCategoryId,
                memo: memo.value,
                cleared: cleared.value,
                subtransactions: data.purchaserSubtransactions
            }
        } else {
            return null
        }
    })

    function createPurchaserTransaction() {
        const transaction = purchaserTransaction.value
        console.log(transaction)
        store.state.api.transactions.createTransaction(store.state.purchasingBudget.id, { transaction }).then((res) => {
           data.purchaserTransactionResponse = "Successful"
        }).catch((err) => {
           store.state.error = err.error.detail
           data.purchaserTransactionResponse = "Failed"
        }).finally(() => {
           store.state.loading = false
        })
    }
    
    const purchaserBalanceTransaction = computed(() => {
        if (
            store.state.transactionAccount.id &&
            store.state.transactionAmount &&
            store.state.transactionPayee
        ) {
            return {
                account_id: store.state.splittersAccountInPurchasersBudget.id,
                date: date.value,
                amount: store.state.splitterAmount * 1000,
                payee_name: "YNABFS Split",
                category_id: store.state.splittersCategoryInPurchasersBudget.id,
                memo: memo.value,
                cleared: "cleared"
            }
        } else {
            return null
        }
    })

    function createPurchaserBalanceTransaction() {
        const transaction = purchaserBalanceTransaction.value
        console.log(transaction)
        store.state.api.transactions.createTransaction(store.state.purchasingBudget.id, { transaction }).then((res) => {
            data.purchaserBalanceTransactionResponse = "Successful"
        }).catch((err) => {
            store.state.error = err.error.detail
            data.purchaserBalanceTransactionResponse = "Failed"
        }).finally(() => {
            store.state.loading = false
        })
    }

    const splitterTransaction = computed(() => {
        if (
            store.state.transactionAccount.id &&
            store.state.transactionAmount &&
            store.state.transactionPayee
        ) {
            return {
                account_id: store.state.purchasersAccountInSplittersBudget.id,
                date: date.value,
                amount: -(store.state.splitterAmount * 1000),
                payee_name: store.state.transactionPayee.name,
                category_id: splitterCategoryId.value,
                memo: memo.value,
                cleared: "cleared",
                subtransactions: data.splitterSubtransactions
            }
        } else {
            return null
        }
    })

    function createSplitterTransaction() {
        const transaction = splitterTransaction.value
        console.log(transaction)
        store.state.api.transactions.createTransaction(store.state.splittingBudget.id, { transaction }).then((res) => {
           data.splitterTransactionResponse = "Successful"
        }).catch((err) => {
           store.state.error = err.error.detail
           data.splitterTransactionResponse = "Failed"
        }).finally(() => {
           store.state.loading = false
        })
    }

    return {
      data,
      store,
      date,
      memo,
      cleared,
      splitterCategoryId,
      getPurchaserSubtransactions,
      getSplitterSubtransactions,
      purchaserTransaction,
      purchaserBalanceTransaction,
      splitterTransaction,
      createPurchaserTransaction,
      createPurchaserBalanceTransaction,
      createSplitterTransaction
    }
  }
}
</script>
