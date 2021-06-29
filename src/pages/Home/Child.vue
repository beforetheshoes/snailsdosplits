<template>
  <page>
    
    <page-header>
      <template #title>
        YNAB For Snails
      </template>
    </page-header>

    <page-body class="text-center">

      <q-btn 
        @click="data.cardTransactionSplit = true"
        style="width: 90%"
        class="q-my-md"
      >
        Click to split ${{ store.state.transactionAmount }}
      </q-btn>

      <q-dialog v-model="data.cardTransactionSplit" @hide="validateAndSave">
        <q-card class="my-card">
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                Total ${{ store.state.transactionAmount }}
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">
              How would you like to split this transaction?
            </div>
            <div class="text-caption text-bold">
              <div class="q-gutter-sm">
                <div class="row">
                  <div class="col-4"><q-radio v-model="data.splitRatio" val="25/75" label="25/75" /></div>
                  <div class="col-4"><q-radio v-model="data.splitRatio" val="50/50" label="50/50" /></div>
                  <div class="col-4"><q-radio v-model="data.splitRatio" val="75/25" label="75/25" /></div>
                </div>
                <div class="row">
                  <div class="col-4"><q-radio v-model="data.splitRatio" val="Other" label="Other" /></div>
                  <div class="col-8">
                    <currency-input v-if="data.splitRatio==='Other'"
                      v-model="data.otherPurchaseRatio"
                      :options="{ currency: 'USD', autoDecimalDigits: true }"
                    />
                  </div>
                </div>
              </div>
              <q-separator />
              <q-item>
                <q-item-section>{{ store.state.purchasingBudget['name'] }}</q-item-section>
                <q-item-section side>
                  <q-item-label caption>${{ purchaserRatio }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>{{ store.state.splittingBudget['name'] }}</q-item-section>
                <q-item-section side>
                  <q-item-label caption>${{ splitterRatio }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" label="Save" @click="validateAndSave" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="container" v-if="store.state.purchaserAmount >= 0 && store.state.splitterAmount >= 0">
        <q-chip 
          v-if="data.purchaserAmountRemaining < 0 || data.purchaserAmountRemaining > store.state.purchaserAmount"
          square 
          color="red" 
          text-color="white" 
          icon="error_outline" 
          label="CATEGORY AMOUNTS MUST ADD UP TO TOTAL PER BUDGET" 
          class="q-my-md"
        />
        <q-item v-if="store.state.purchasingBudget" class="q-mt-md" clickable v-ripple @click="data.cardPurchaserCategories = true">
          <div class="col-6 text-left">
            <span class="q-pl-lg text-bold">{{ store.state.purchasingBudget['name'] }}</span>
          </div>
          <div class="col-6 text-right">
            <q-badge v-if="store.state.purchaserAmount" class="q-mr-sm" align="middle" color="deep-purple-5">${{ store.state.purchaserAmount }}</q-badge>
          </div>
        </q-item>

        <q-dialog v-model="data.cardPurchaserCategories" @hide="validateAndSave">
          <q-card class="my-card">
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  Total ${{ store.state.purchaserAmount }}
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-subtitle2">
                How would you like to split this transaction?
              </div>

              <q-select 
                class="q-my-md float-md-end"
                filled
                v-model="store.state.purchaserCategorySplits"
                stack-label
                multiple
                use-chips
                input-debounce="0"
                label="Who was the payee:"
                :options="purchaserCategoryOptions"
                option-value="id"
                option-label="name"
                style="width: 100%"
                use-input
              />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Save" @click="validateAndSave" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <div v-if="store.state.purchaserCategorySplits.length > 0">
          <q-item clickable v-ripple v-for="category in store.state.purchaserCategorySplits" :key="category.id">
            <div class="col-8 text-left">
              <span class="q-pl-lg">{{ category.name }}</span>
            </div>
            <div class="col-4 text-right" v-if="store.state.purchaserCategorySplits.length > 1">
                <currency-input
                  v-model="category.amount"
                  dense
                  :options="{ currencyDisplay: 'hidden',
                              currency: 'USD', 
                              autoDecimalDigits: true, 
                              valueRange: { min: 0, max: store.state.purchaserAmount } 
                            }"
                  prefix="$"
                  @blur="calculateAmountRemaining()"
                  @focus="calculateAmountRemaining()"
                  @keyup.enter="calculateAmountRemaining()"
                />
            </div>
            <div class="col-4 text-right" v-else>
                <q-input
                  v-model="store.state.purchaserCategorySplits[0].amount"
                  input-class="text-right text-bold"
                  prefix="$"
                  dense
                  disable
                  readonly
                  filled
                />
            </div>
          </q-item>
          <div class="col">
            <p class="text-right q-mr-lg text-weight-thin">Amount remaining to assign: 
              <span 
                class="q-ml-md text-weight-regular"
                :class="data.purchaserAmountRemaining >= 0 ? 'text-black' : 'text-red'"
              >
                ${{ data.purchaserAmountRemaining }}
              </span>
            </p>
          </div>
        </div>

        <q-separator class="q-my-sm"></q-separator>
        <q-chip 
          v-if="data.splitterAmountRemaining < 0 || data.splitterAmountRemaining > store.state.splitterAmount"
          square 
          color="red" 
          text-color="white" 
          icon="error_outline" 
          label="CATEGORY AMOUNTS MUST ADD UP TO TOTAL PER BUDGET"
          class="q-my-md" 
        />
        <q-item v-if="store.state.splittingBudget" class="q-mb-md" clickable v-ripple @click="data.cardSplitterCategories = true">
          <div class="col-6 text-left">
            <span class="q-pl-lg text-bold">{{ store.state.splittingBudget['name'] }}</span>
          </div>
          <div class="col-6 text-right">
            <q-badge class="q-mr-sm" align="middle" color="deep-purple-5">${{ store.state.splitterAmount }}</q-badge>
          </div>
        </q-item>

        <q-dialog v-model="data.cardSplitterCategories" @hide="validateAndSave">
          <q-card class="my-card">
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  Total ${{ store.state.splitterAmount }}
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-subtitle2">
                How would you like to split this transaction?
              </div>

              <q-select 
                class="q-my-md float-md-end"
                filled
                v-model="store.state.splitterCategorySplits"
                stack-label
                multiple
                use-chips
                input-debounce="0"
                label="Who was the payee:"
                :options="splitterCategoryOptions"
                option-value="id"
                option-label="name"
                style="width: 100%"
                use-input
              />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Save" @click="validateAndSave" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <div v-if="store.state.splitterCategorySplits.length > 0">
          <q-item clickable v-ripple v-for="category in store.state.splitterCategorySplits" :key="category.id">
            <div class="col-8 text-left">
              <span class="q-pl-lg">{{ category.name }}</span>
            </div>
            <div class="col-4 text-right" v-if="store.state.splitterCategorySplits.length > 1">
                <currency-input
                  v-model="category.amount"
                  dense
                  prefix="$"
                  :options="{ currencyDisplay: 'hidden', 
                              currency: 'USD', 
                              autoDecimalDigits: true, 
                              valueRange: { min:0, max: store.state.splitterAmount } 
                            }"
                  @blur="calculateAmountRemaining()"
                  @focus="calculateAmountRemaining()"
                  @keyup.enter="calculateAmountRemaining()"
                />
            </div>
            <div class="col-4 text-right" v-else>
                <q-input
                  v-model="store.state.splitterAmount"
                  input-class="text-bold text-right"
                  prefix="$"
                  dense
                  disable
                  
                  filled
                  outlined
                />
            </div>
          </q-item>
          <div class="col">
            <p class="text-right q-mr-lg text-weight-thin">Amount remaining to assign: 
              <span 
                class="q-ml-md text-weight-regular"
                :class="data.splitterAmountRemaining >= 0 ? 'text-black' : 'text-red'"
              >
                ${{ data.splitterAmountRemaining }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <q-separator></q-separator>
      <p class="q-py-lg">Click on a budget above to choose categories</p>
      <div v-if="allowNextStep">
        <q-btn
          padding="xs lg"
          color="primary"
          to="/home/child/grandchild"
          @click="checkCategoriesinEachBudget()"
          label="Final Step"
        />
      </div>
    </page-body>
  </page>
</template>

<script>
import { reactive, onMounted, inject, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import CurrencyInput from '../../components/CurrencyInput.vue'

export default {
  name: 'Child',
  components: { CurrencyInput },
  setup() {   
    const data = reactive({
      cardTransactionSplit: false,
      cardBudgetChooser: false,
      splitRatio: '50/50',
      otherPurchaseRatio: 0,
      cardPurchaserCategories: false,
      cardSplitterCategories: false,
      splitterAmountRemaining: null,
      purchaserAmountRemaining: null
    })

    const store = inject('store')

    const router = useRouter()

    onMounted(() => {
      if (!store.state.purchasingBudget || !store.state.ynab.token) {
        router.push('/home/')
      }

      if (store.state.purchasingBudget && store.state.splittingBudget) {
        store.methods.getPurchaserCategories()
        store.methods.getSplitterCategories()
        store.methods.checkSplittersAccountInPurchasersBudget()
        store.methods.checkPurchasersAccountInSplittersBudget()
      }

      if (store.state.transactionAmount) {
        store.state.purchaserAmount = (Math.round(((store.state.transactionAmount * .5) + Number.EPSILON) * 100) / 100).toFixed(2)
        store.state.splitterAmount = (((store.state.transactionAmount * 100) - (store.state.purchaserAmount * 100)) / 100).toFixed(2)
        data.purchaserAmountRemaining = Number(store.state.purchaserAmount)
        data.splitterAmountRemaining = Number(store.state.splitterAmount)
        calculateAmountRemaining()
        validateAndSave()
      }

    })


    onBeforeUnmount(() => {
      checkCategoriesinEachBudget()
    })

    const purchaserRatio = computed(() => { 
      switch (data.splitRatio) {
        case '25/75':
          return (Math.round(((store.state.transactionAmount * .25) + Number.EPSILON) * 100) / 100).toFixed(2)
        case '50/50':
          return (Math.round(((store.state.transactionAmount * .5) + Number.EPSILON) * 100) / 100).toFixed(2)
        case '75/25':
          return (Math.round(((store.state.transactionAmount * .75) + Number.EPSILON) * 100) / 100).toFixed(2)
        case 'Other':
          return data.otherPurchaseRatio
        default:
          return (Math.round(((store.state.transactionAmount * .5) + Number.EPSILON) * 100) / 100).toFixed(2)
      }
    })

    const splitterRatio = computed(() => { 
      return (((store.state.transactionAmount * 100) - (purchaserRatio.value * 100)) / 100).toFixed(2)
    })

    function validateAndSave() {
      if (purchaserRatio.value <= store.state.transactionAmount && purchaserRatio.value >= 0 && purchaserRatio.value !== null) {
        store.state.purchaserAmount = Number(purchaserRatio.value)
        store.state.splitterAmount = Number(splitterRatio.value)
        if (store.state.purchaserCategorySplits.length === 1) {
          store.state.purchaserCategorySplits[0].amount = Number(store.state.purchaserAmount)
        }
        calculateAmountRemaining()
      } else {
        alert("You have entered unacceptable values and you know it.")
      }
    }

    const purchaserCategoryOptions = computed(() => {
      if (store.state.allPurchaserCategories.length > 0) {
        const result = []
        const map = new Map()
        for (const item of store.state.allPurchaserCategories) {
          if (!map.has(item.id)) {
            map.set(item.id, true)
            result.push({
              id: item.id,
              name: item.name,
              amount: null
            })
          }
        }      
        return result
      } else {
        return []
      }
    })

    const splitterCategoryOptions = computed(() => {
      if (store.state.allSplitterCategories.length > 0) {
        const result = []
        const map = new Map()
        for (const item of store.state.allSplitterCategories) {
          if (!map.has(item.id)) {
            map.set(item.id, true)
            result.push({
              id: item.id,
              name: item.name,
              amount: null
            })
          } 
        }      
        return result
      } else {
        return []
      }
    })

    function checkCategoriesinEachBudget() {
      if (purchaserCategoryOptions.value && splitterCategoryOptions.value) {
        if (store.state.purchasingBudget) {
          const search = store.state.purchasingBudget.name + ' | YNABFS'
          const splitYNABFS = splitterCategoryOptions.value.find(o => o.name === search)
            if (splitYNABFS) {
                store.state.purchasersCategoryInSplittersBudget = splitYNABFS
            } 
        }  
        if (store.state.splittingBudget) {
          const search = store.state.splittingBudget.name + ' | YNABFS'
          const purchaseYNABFS = purchaserCategoryOptions.value.find(o => o.name === search)
            if (purchaseYNABFS) {
                store.state.splittersCategoryInPurchasersBudget = purchaseYNABFS
            } 
        }  
      }
    }

    const allowNextStep = computed(() => {
      if (
          store.state.purchaserCategorySplits.length > 0 &&
          store.state.splitterCategorySplits.length > 0 &&
          store.state.transactionAmount > 0 &&
          data.purchaserAmountRemaining == 0 && 
          data.splitterAmountRemaining == 0
          ) {
        return true
      } else {
        return false
      }
    })

    function calculateAmountRemaining () {
      if (store.state.purchaserCategorySplits.length === 1) {
        data.purchaserAmountRemaining = 0
      } else if (store.state.purchaserCategorySplits.length > 1) {
        data.purchaserAmountRemaining = Number((((store.state.purchaserAmount * 100) - (store.purchaserCategoryTotal.value * 100)) / 100))
      } else {
        data.purchaserAmountRemaining = null
      }

      if (store.state.splitterCategorySplits.length === 1) {
        data.splitterAmountRemaining = 0
      } else if (store.state.splitterCategorySplits.length > 0) {
        data.splitterAmountRemaining = Number((((store.state.splitterAmount * 100) - (store.splitterCategoryTotal.value * 100)) / 100).toFixed(2))
      } else {
        data.splitterAmountRemaining = null
      }
    }

    return {
      data,
      store,
      purchaserRatio,
      splitterRatio,
      validateAndSave,
      purchaserCategoryOptions,
      splitterCategoryOptions,
      allowNextStep,
      calculateAmountRemaining,
      checkCategoriesinEachBudget
    }
  }
}
</script>
