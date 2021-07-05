<template>
    <q-dialog>
        <q-card class="my-card">
            <q-card-section>
                <div class="text-center">
                    <q-item-label class="text-subtitle2 text-weight-medium">Click on a transaction to split it.</q-item-label>
                    <q-item-label class="text-caption text-weight-light">Negative number denotes inflow.</q-item-label>
                </div>
            </q-card-section>

            <q-list separator padding bordered>
                <q-item 
                    v-for="transaction in store.state.unapprovedPurchaserTransactions" 
                    :key="transaction.id"
                    clickable
                    v-ripple
                    class="q-pa-md"
                    @click="setupUpdateTransaction(transaction)"
                    v-close-popup
                >
                    <q-item-section>
                        <q-item-label>{{ transaction.payee_name }}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                        <q-item-label caption class="q-mb-sm">{{ transaction.date }}</q-item-label>
                        <div class="text-primary">
                            <q-item-label>${{ -(transaction.amount / 1000) }}</q-item-label>
                        </div>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card>
    </q-dialog>
</template>

<script>
import { inject } from 'vue'

export default {
    setup() {
        const store = inject('store')
        
        function setupUpdateTransaction(transaction) {
            store.state.transactionDate = transaction.date.replace(new RegExp('-', 'g'), '/')
            store.state.transactionAmount = -(transaction.amount / 10)
            store.state.unapprovedUpdateTransactionId = transaction.id
            store.state.transactionPayee = {
                id: transaction.payee_id,
                name: transaction.payee_name
            }
            store.state.transactionNotes = transaction.memo
            store.state.transactionAccount = {
                id: transaction.account_id,
                name: transaction.account_name
            }
            if (transaction.cleared === "cleared") {
                store.state.transactionCleared = true
            } else {
                store.state.transactionCleared = false
            }
        }

        return {
            store,
            setupUpdateTransaction
        }
    }
}

</script>
