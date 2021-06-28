<template>
       <div class="q-pa-md q-gutter-md">
                <q-list 
                    bordered 
                    padding 
                    class="rounded-borders text-left" 
                    style="max-width: 350px; margin: auto">
                    <q-item-label header>Matching Accounts and Categories</q-item-label>

                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Splitter's Account Name</q-item-label>
                        <q-item-label caption>{{ store.state.splittersAccountInPurchasersBudget.name }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.splittersAccountInPurchasersBudget.id" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Date</q-item-label>
                        <q-item-label caption>{{ date }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="date" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Amount</q-item-label>
                        <q-item-label caption>${{ store.state.splitterAmount }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.splitterAmount" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Category Name</q-item-label>
                        <q-item-label caption>{{ store.state.splittersCategoryInPurchasersBudget.name }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.splittersCategoryInPurchasersBudget" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Memo</q-item-label>
                        <q-item-label caption>{{ memo }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="memo" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: "PurchaserMatchVerification",
  props: ['date', 'memo'],
  setup(props) {
    const store = inject('store')
    return { store };
  }
}
</script>