<template>
  <page>
    
    <page-header>
      <template #title>
        Snails Do Splits!
      </template>
    </page-header>

    <page-body class="text-center">
        <q-btn 
          v-if="data.purchaserTransactionResponse === 'Successful' && 
                data.purchaserBalanceTransactionResponse === 'Successful' && 
                data.splitterTransactionResponse === 'Successful'"
          class="q-mt-xl q-mb-md"  
          outline 
          rounded 
          icon="verified"
          color="positive" 
          label="Success" />
        <q-btn 
          v-if="data.purchaserTransactionResponse === 'Failed' || 
                data.purchaserBalanceTransactionResponse === 'Failed' || 
                data.splitterTransactionResponse === 'Failed'"
          class="q-mt-xl q-mb-md"  
          outline 
          rounded 
          icon="error"
          color="negative" 
          label="Transaction Failed" />
        <div v-if="data.purchaserTransactionResponse === 'Failed' || 
                data.purchaserBalanceTransactionResponse === 'Failed' || 
                data.splitterTransactionResponse === 'Failed'"
        >
            <p v-if="data.purchaserTransactionResponse === 'Failed'">
                {{ data.purchaserTransactionErrorDetail }}
            </p>
            <p v-if="data.purchaserBalanceTransactionResponse === 'Failed'">
                {{ data.purchaserBalanceTransactionErrorDetail }}
            </p>
            <p v-if="data.splitterTransactionResponse === 'Failed'">
                {{ data.splitterTransactionErrorDetail }}
            </p>
        </div>
        <div v-if="store.state.ynab.token && 
                   store.state.purchasingBudget &&
                   data.purchaserTransactionResponse === null && 
                   data.purchaserBalanceTransactionResponse === null && 
                   data.splitterTransactionResponse === null"
        >
            <h5>Please verify transactions before posting</h5>
            <q-btn
                v-if="data.finalValidationPassed"
                class="q-mb-lg"
                color="primary"
                @click="submitAllTransactions()"
                label="Submit Transactions"
            />
            <div>
                <p class="text-weight-light q-mx-sm">All status icons should be green before submitting transactions.</p>
                <p class="text-weight-thin q-mx-sm">Category IDs will be blank if there are any subtransactions.</p>
            </div>
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
            v-if="store.state.ynab.token && 
                  store.state.purchaserAmount >= 0 &&
                  data.purchaserTransactionResponse === null && 
                  data.purchaserBalanceTransactionResponse === null && 
                  data.splitterTransactionResponse === null"
            class="q-mt-md q-mb-xl"
            color="primary"
            to="/home/child"
            label="Back"
            />
            <q-btn
            v-else
            class="q-mt-md q-mb-xl"
            color="primary"
            to="/home"
            label="Add another transaction"
            @click="store.methods.startOver()"
            />
        </div>
    </page-body>
  </page>
</template>

<script>
import { reactive, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PurchaserVerification from 'src/components/PurchaserVerification.vue'
import PurchaserMatchVerification from 'src/components/PurchaserMatchVerification.vue'
import SplitterVerification from 'src/components/SplitterVerification.vue'

export default {
  components: { 
      PurchaserVerification,
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
        purchaserBalanceTransactionResponse: null,
        finalValidationPassed: false,
        purchaserTransactionErrorDetail: null,
        purchaserBalanceTransactionErrorDetail: null,
        splitterTransactionErrorDetail: null
    })

    const store = inject('store')

    const router = useRouter()

    onMounted(() => {
        if (!store.state.purchasingBudget || !store.state.ynab.token) {
            router.push('/home/')
        } else {
            getPurchaserSubtransactions()
            
            if (store.state.splitterCategorySplits.length > 0) {
                getSplitterSubtransactions()
            }
                       
            finalValidation()
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
            return "No memo provided [Snails Do Splits!]"
        } else {
            return store.state.transactionNotes + " [Snails Do Splits!]"
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
        let splitterCategoryToFind = store.state?.splittingBudget['name'] + " | SDS"
        let splitterCategory = store.state?.allPurchaserCategories.find(o => o.name === splitterCategoryToFind)

        // If categories have been chosen for the purchasing budget, make the subtransactions
        // equal to the categories that were assigned more than $0 and the splitting budget's category
        if (store.state.purchaserCategorySplits.length >= 1) {
            for (let i = 0; i < store.state.purchaserCategorySplits.length; i++) {
                if (Math.abs(store.state.purchaserCategorySplits[i].amount) > 0) {
                    data.purchaserSubtransactions.push({ 
                        amount: -(store.state.purchaserCategorySplits[i].amount * 10),
                        category_id: store.state.purchaserCategorySplits[i].id,
                    })
                }
            }
            if (splitterCategory) {
                data.purchaserSubtransactions.push({
                    amount: -(store.state.splitterAmount * 10),
                    category_id: splitterCategory.id
                })
            }
        // If no categories where chosen for the purchasing budget:
        } else if (store.state.purchaserCategorySplits.length === 0) {
            if (splitterCategory) {
                // If it's because the purchaser doesn't owe anything,
                // just make the Category ID equal to the splitting budget's category
                if (store.state.purchaserAmount === 0) {
                    data.purchaserCategoryId = splitterCategory.id
                // If it's because the purchaser does owe a share but it hasn't been categorized,
                // Make the subtransactions equal to the uncategorized portion of the purchaser's share
                // and the splitting budget's category
                } else {
                    data.purchaserSubtransactions.push(
                    {
                        amount: -(store.state.purchaserAmount * 10),
                        category_id: null
                    },
                    {
                        amount: -(store.state.splitterAmount * 10),
                        category_id: splitterCategory.id
                    }
                )
                }
            }
        } else {
            return false
        }
    }

    function getSplitterSubtransactions() {
        if (store.state.splitterCategorySplits.length > 1) {
            for (let i = 0; i < store.state.splitterCategorySplits.length; i++) {
                if (Math.abs(store.state.splitterCategorySplits[i].amount) > 0) {
                    data.splitterSubtransactions.push({ 
                        amount: -(store.state.splitterCategorySplits[i].amount * 10),
                        category_id: store.state.splitterCategorySplits[i].id,
                    })
                }
            }
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
                amount: -(store.state.transactionAmount * 10),
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

    function createPurchaserNewTransaction() {
        const transaction = purchaserTransaction.value
        store.state.api.transactions.createTransaction(store.state.purchasingBudget.id, { transaction }).then((res) => {
           data.purchaserTransactionResponse = "Successful"
        }).catch((err) => {
           store.state.error = err.error.detail
           data.purchaserTransactionResponse = "Failed"
           data.purchaserTransactionErrorDetail = err.error.detail
        }).finally(() => {
           store.state.loading = false
        })
    }
    
    function createPurchaserUpdateTransaction() {
        const transaction = purchaserTransaction.value
        store.state.api.transactions.updateTransaction(store.state.purchasingBudget.id, store.state.unapprovedUpdateTransactionId, { transaction }).then((res) => {
           data.purchaserTransactionResponse = "Successful"
        }).catch((err) => {
           store.state.error = err.error.detail
           data.purchaserTransactionResponse = "Failed"
           data.purchaserTransactionErrorDetail = err.error.detail
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
                amount: store.state.splitterAmount * 10,
                payee_name: "SDS Split",
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
        store.state.api.transactions.createTransaction(store.state.purchasingBudget.id, { transaction }).then((res) => {
            data.purchaserBalanceTransactionResponse = "Successful"
        }).catch((err) => {
            store.state.error = err.error.detail
            data.purchaserBalanceTransactionResponse = "Failed"
            data.purchaserBalanceTransactionErrorDetail = err.error.detail
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
                amount: -(store.state.splitterAmount * 10),
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
        store.state.api.transactions.createTransaction(store.state.splittingBudget.id, { transaction }).then((res) => {
           data.splitterTransactionResponse = "Successful"
        }).catch((err) => {
           store.state.error = err.error.detail
           data.splitterTransactionResponse = "Failed"
           data.splitterTransactionErrorDetail = err.error.detail
        }).finally(() => {
           store.state.loading = false
        })
    }

    function finalValidation() {
        if (
                store.state.transactionAccount.id &&
                store.state.transactionAmount &&
                //store.state.transactionPayee.id &&
                store.state.transactionPayee.name &&
                memo.value &&
                cleared.value &&
                date.value &&
                (
                    (data.purchaserCategoryId === null && data.purchaserSubtransactions.length !== 1) || 
                    (store.state.purchaserAmount === 0 && store.state.splitterAmount === store.state.transactionAmount && data.purchaserSubtransactions.length === 0)
                ) &&
                store.state.purchasersAccountInSplittersBudget.id &&
                (
                    (splitterCategoryId.value === null && data.splitterSubtransactions.length !== 1) || 
                    (splitterCategoryId.value && data.splitterSubtransactions.length === 0)
                ) &&
                store.state.splitterAmount &&
                store.state.splittersCategoryInPurchasersBudget.id &&
                store.state.splittersAccountInPurchasersBudget.id
        ){
            data.finalValidationPassed = true
        } else {
            data.finalValidationPassed = false
        }
    }

    function submitAllTransactions() {
        if (data.finalValidationPassed) {
            if (store.state.unapprovedUpdateTransactionId) {
                createPurchaserUpdateTransaction()
            } else {
                createPurchaserNewTransaction()
            }
            createPurchaserBalanceTransaction()
            createSplitterTransaction()
        } else {
            alert("Final validation failed. No transactions have been attempted. Please verify transactions before posting.")
        }
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
      createPurchaserNewTransaction,
      createPurchaserUpdateTransaction,
      createPurchaserBalanceTransaction,
      createSplitterTransaction,
      finalValidation,
      submitAllTransactions
    }
  }
}
</script>
