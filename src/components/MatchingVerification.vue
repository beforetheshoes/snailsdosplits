<template>
       <div class="q-pa-md q-gutter-md">
                <q-list 
                    bordered 
                    padding 
                    class="rounded-borders text-left" 
                    style="max-width: 350px; margin: auto">
                    <q-item-label header>Matching Accounts and Categories</q-item-label>

                    <q-item clickable @click="store.methods.checkPurchasersAccountInSplittersBudget()">
                        <q-item-section>
                        <q-item-label lines="1">Purchaser's Account in Splitter's Budget</q-item-label>
                        <q-item-label caption>{{ store.state.purchasersAccountInSplittersBudget }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.purchasersAccountInSplittersBudget" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <q-item clickable @click="store.methods.checkSplittersAccountInPurchasersBudget()">
                        <q-item-section>
                        <q-item-label lines="1">Splitter's Account In Purchaser's Budget</q-item-label>
                        <q-item-label caption>{{ store.state.splittersAccountInPurchasersBudget }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.splittersAccountInPurchasersBudget " name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <q-item clickable @click="store.methods.checkPurchasersCategoryInSplittersBudget()">
                        <q-item-section>
                        <q-item-label lines="1">Purchaser's Category in Splitter's Budget</q-item-label>
                        <q-item-label caption>{{ store.state.purchasersCategoryInSplittersBudget }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.purchasersCategoryInSplittersBudget" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <q-item clickable @click="store.methods.checkSplittersCategoryInPurchasersBudget()">
                        <q-item-section>
                        <q-item-label lines="1">Splitter's Category in Purchaser's Budget</q-item-label>
                        <q-item-label caption>{{ store.state.splittersCategoryInPurchasersBudget }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.splittersCategoryInPurchasersBudget" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: "MatchingVerification",
  setup(props) {
    const store = inject('store')
    return { store };
  }
}
</script>