<template>
       <div class="q-pa-md q-gutter-md">
                <q-list 
                    bordered 
                    padding 
                    class="rounded-borders text-left" 
                    style="max-width: 350px; margin: auto">
                    <q-item-label header>Purchaser Transaction</q-item-label>

                    <q-item>
                        <q-item-section>
                        <q-item-label lines="2">Account Name</q-item-label>
                        <q-item-label caption>{{ store.state.transactionAccount.name }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.transactionAccount.name" name="info" color="green" />
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
                        <q-item-label caption>${{ store.state.transactionAmount / 100 }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.transactionAmount" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>
                    <!-- <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Payee ID</q-item-label>
                        <q-item-label caption>{{ store.state.transactionPayee.id }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.transactionPayee.id" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item> -->
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Payee Name</q-item-label>
                        <q-item-label caption>{{ store.state.transactionPayee.name }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="store.state.transactionPayee.name" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>                                                            
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Category ID</q-item-label>
                        <q-item-label caption>{{ purchaserCategoryId }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="(purchaserCategoryId && subtransactions.length === 0) || 
                                      (!purchaserCategoryId && subtransactions.length !== 1)" 
                                name="info" 
                                color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>   
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Memo</q-item-label>
                        <q-item-label 
                            caption>{{ memo }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="memo" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>   
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Cleared</q-item-label>
                        <q-item-label caption>{{ cleared }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="cleared" name="info" color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>   
                    <q-item>
                        <q-item-section>
                        <q-item-label lines="1">Subtransactions</q-item-label>
                        <q-item-label caption v-for="transaction in subtransactions" :key="transaction.id">
                            <li>
                                ID: {{ transaction.category_id }}
                                Amount: ${{ (-transaction.amount / 1000) }}
                            </li>
                        </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                        <q-icon v-if="(purchaserCategoryId && subtransactions.length === 0) || 
                                      (!purchaserCategoryId && subtransactions.length !== 1)" 
                                name="info" 
                                color="green" />
                        <q-icon v-else name="info" />
                        </q-item-section>
                    </q-item>                                                               
                </q-list>
            </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: "PurchaserVerification",
  props: ['date', 'purchaserCategoryId', 'subtransactions', 'memo', 'cleared'],
  setup(props) {
    const store = inject('store')
    return { store };
  }
}
</script>