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
        Click to split ${{ store.state.transactionAmount / 100 }}
      </q-btn>
      <card-transaction-split v-model="data.cardTransactionSplit"
      ></card-transaction-split>

      <div class="container" v-if="store.state.purchaserAmount >= 0 && store.state.splitterAmount >= 0">
        <q-chip 
          v-if="data.purchaserAmountRemaining < 0 || data.purchaserAmountRemaining > store.state.purchaserAmount"
          square 
          color="red" 
          text-color="white" 
          icon="error_outline" 
          label="Split must add up to purchaser's share." 
          class="q-my-md"
        />
        <q-item 
          v-if="store.state.purchasingBudget" 
          class="q-mt-md" 
          clickable 
          v-ripple 
          @click="store.state.purchaserAmount > 0 ? data.cardPurchaserCategories = true : data.cardPurchaserCategories = false">
          <div class="col-6 text-left">
            <span class="q-pl-lg text-bold">{{ store.state.purchasingBudget['name'] }}</span>
          </div>
          <div class="col-6 text-right">
            <q-badge class="q-mr-sm" align="middle" color="deep-purple-5">
              ${{ store.state.purchaserAmount > 0 ? (store.state.purchaserAmount / 100).toFixed(2) : 0 }}
            </q-badge>
          </div>
        </q-item>

        <q-dialog v-model="data.cardPurchaserCategories" @hide="validateAndSave">
          <q-card class="my-card">
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  Total ${{ (store.state.purchaserAmount / 100).toFixed(2) }}
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
                label="Choose one or more categories:"
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
                  :options="{ currencyDisplay: 'symbol',
                              currency: 'USD', 
                              autoDecimalDigits: true, 
                              valueRange: { min: 0, max: store.state.purchaserAmount }, 
                              exportValueAsInteger: true
                            }"
                  @blur="calculateAmountRemaining()"
                  @focus="calculateAmountRemaining()"
                  @keyup.enter="calculateAmountRemaining()"
                />
            </div>
            <div class="col-4 text-right" v-else>
                <q-input
                  class="text-right text-black vertical-align!"
                  prefix="$"
                  dense
                  disable
                  readonly
                  filled
                  color="black"
                  :label="'$' + (store.state.purchaserAmount / 100).toFixed(2) "
                ></q-input>
            </div>
          </q-item>
          <div class="col">
            <p class="text-right q-mr-lg text-weight-thin">Amount remaining to assign: 
              <span 
                class="q-ml-md text-weight-regular"
                :class="data.purchaserAmountRemaining >= 0 ? 'text-black' : 'text-red'"
              >
                ${{ data.purchaserAmountRemaining / 100 }}
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
          label="Split must add up to splitter's share."
          class="q-my-md" 
        />
        <q-item 
          v-if="store.state.splittingBudget" 
          class="q-mb-md" 
          clickable 
          v-ripple 
          @click="store.state.splitterAmount > 0 ? data.cardSplitterCategories = true : data.cardSplitterCategories = false">
          <div class="col-6 text-left">
            <span class="q-pl-lg text-bold">{{ store.state.splittingBudget['name'] }}</span>
          </div>
          <div class="col-6 text-right">
            <q-badge class="q-mr-sm" align="middle" color="deep-purple-5">
              ${{ store.state.splitterAmount > 0 ? (store.state.splitterAmount / 100).toFixed(2) : 0 }}
            </q-badge>
          </div>
        </q-item>

        <q-dialog v-model="data.cardSplitterCategories" @hide="validateAndSave">
          <q-card class="my-card">
            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                  Total ${{ (store.state.splitterAmount / 100).toFixed(2) }}
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
                label="Choose one or more categories:"
                :options="splitterCategoryOptions"
                option-value="id"
                option-label="name"
                style="width: 100%"
                use-input
              />
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn v-close-popup flat color="primary" label="Save" />
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
                              valueRange: { min:0, max: store.state.splitterAmount },
                              exportValueAsInteger: true 
                            }"
                  @blur="calculateAmountRemaining()"
                  @focus="calculateAmountRemaining()"
                  @keyup.enter="calculateAmountRemaining()"
                />
            </div>
            <div class="col-4 text-right" v-else>
                <q-input
                  class="text-right text-black vertical-align!"
                  prefix="$"
                  dense
                  disable
                  readonly
                  filled
                  color="black"
                  :label="'$' + (store.state.splitterAmount / 100).toFixed(2) "
                ></q-input>
            </div>
          </q-item>
          <div class="col">
            <p class="text-right q-mr-lg text-weight-thin">Amount remaining to assign: 
              <span 
                class="q-ml-md text-weight-regular"
                :class="data.splitterAmountRemaining >= 0 ? 'text-black' : 'text-red'"
              >
                ${{ data.splitterAmountRemaining / 100 }}
              </span>
            </p>
          </div>
        </div>
      </div>
      <q-separator></q-separator>
      <p class="q-mt-lg q-pa-md text-bold">Click on a budget above to choose categories</p>
      <pre>{{ store.state.transactionAmount > 0 }}</pre>
      <pre>{{ data.purchaserAmountRemaining === 0 }}</pre>
      <pre>{{ data.splitterAmountRemaining === 0 }}</pre>
      <pre>{{ store.state.purchaserCategorySplits.length }}</pre>
      <pre>{{ store.state.splitterCategorySplits.length }}</pre>
      <div v-if="allowNextStep" class="q-mb-xl">
        <q-btn
          padding="xs lg"
          class="q-mb-xl"
          color="primary"
          @click="confirmCategorization"
          label="Final Step"
        />
      </div>
      <div v-else class="q-mb-xl"></div>
    </page-body>
  </page>
</template>

<script>
import { reactive, onMounted, inject, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CurrencyInput from '../../components/CurrencyInput.vue'
import CardTransactionSplit from 'src/components/CardTransactionSplit.vue'

export default {
  name: 'Child',
  components: { CurrencyInput, CardTransactionSplit },
  setup() {   
    const data = reactive({
      cardTransactionSplit: false,
      cardBudgetChooser: false,
      cardPurchaserCategories: false,
      cardSplitterCategories: false,
      splitterAmountRemaining: null,
      purchaserAmountRemaining: null
    })

    const $q = useQuasar()
    
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
        store.state.purchaserAmount = (Math.round((store.state.transactionAmount * .5) + Number.EPSILON) * 100) / 100
        store.state.splitterAmount = (((store.state.transactionAmount * 100) - (store.state.purchaserAmount * 100)) / 100)
        data.purchaserAmountRemaining = Number(store.state.purchaserAmount)
        data.splitterAmountRemaining = Number(store.state.splitterAmount)
        calculateAmountRemaining()
        validateAndSave()
      }

    })

    onBeforeUnmount(() => {
      checkCategoriesinEachBudget()
    })



    const purchaserCategoryOptions = computed(() => {
      if (store.state.allPurchaserCategories.length >= 0) {
        const result = []
        const map = new Map()
        const searchRegex = new RegExp(/.* [|] YNABFS/, 'i')
        for (const item of store.state.allPurchaserCategories) {
          if (!searchRegex.test(item.name)) {
            if (!map.has(item.id)) {
              map.set(item.id, true)
              result.push({
                id: item.id,
                name: item.name,
                amount: null
              })
            }
          }
        }      
        return result
      } else {
        return []
      }
    })

    const splitterCategoryOptions = computed(() => {
      if (store.state.allSplitterCategories.length >= 0) {
        const result = []
        const map = new Map()
        const searchRegex = new RegExp(/.* [|] YNABFS/, 'i')
        for (const item of store.state.allSplitterCategories) {
          if (!searchRegex.test(item.name)) {
            if (!map.has(item.id)) {
              map.set(item.id, true)
              result.push({
                id: item.id,
                name: item.name,
                amount: null
              })
            }
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
          const splitYNABFS = store.state.allSplitterCategories.find(o => o.name === search)
            if (splitYNABFS) {
                store.state.purchasersCategoryInSplittersBudget = splitYNABFS
            } 
        }  
        if (store.state.splittingBudget) {
          const search = store.state.splittingBudget.name + ' | YNABFS'
          const purchaseYNABFS = store.state.allPurchaserCategories.find(o => o.name === search)
            if (purchaseYNABFS) {
                store.state.splittersCategoryInPurchasersBudget = purchaseYNABFS
            } 
        }  
      }
    }

    function confirmCategorization () {
      if (store.state.purchaserCategorySplits.length === 0 || store.state.splitterCategorySplits.length === 0) {
        $q.dialog({
          title: 'Confirm',
          message: 'Are you sure you would like to leave transactions uncategorized?',
          cancel: true,
          persistent: true
          }).onOk(() => {
            checkCategoriesinEachBudget()
            router.push('/home/child/grandchild')
          }).onCancel(() => {
           console.log('>>>> Cancel')
          }).onDismiss(() => {
           console.log('I am triggered on both OK and Cancel')
          })
      } else {
          checkCategoriesinEachBudget()
          router.push('/home/child/grandchild')
      }
    }

    const allowNextStep = computed(() => {
      if (
          //(store.state.purchaserAmount === 0 || store.state.purchaserCategorySplits.length > 0) &&
          //(store.state.splitterAmount === 0 || store.state.splitterCategorySplits.length > 0) &&
          store.state.transactionAmount > 0 &&
          data.purchaserAmountRemaining === 0 && 
          data.splitterAmountRemaining === 0
          ) {
        return true
      } else {
        return false
      }
    })

    function calculateAmountRemaining () {
      if (store.state.purchaserCategorySplits.length> 1) {
        data.purchaserAmountRemaining = Number(((store.state.purchaserAmount * 100) - (store.purchaserCategoryTotal.value * 100)) / 100)
      } else if (
        store.state.purchaserCategorySplits.length === 0 ||
        store.state.purchaserCategorySplits.length === 1 ||
        store.state.purchaserAmount === 0
        ) {
        data.purchaserAmountRemaining = 0
      } else {
        data.purchaserAmountRemaining = null
      }


      if (store.state.splitterCategorySplits.length > 1) {
        data.splitterAmountRemaining = Number(((store.state.splitterAmount * 100) - (store.splitterCategoryTotal.value * 100)) / 100)
      } else if (
          store.state.splitterCategorySplits.length === 0 ||
          store.state.splitterCategorySplits.length === 1 ||
          store.state.purchaserAmount === 0
        ) {
        data.splitterAmountRemaining = 0
      } else {
        data.splitterAmountRemaining = null
      }
    }

    function validateAndSave () {
        if (store.state.purchaserCategorySplits.length === 1) {
          store.state.purchaserCategorySplits[0].amount = Number(store.state.purchaserAmount)
        } 
        calculateAmountRemaining()
    }

    return {
      data,
      store,
      purchaserCategoryOptions,
      splitterCategoryOptions,
      allowNextStep,
      validateAndSave,
      calculateAmountRemaining,
      checkCategoriesinEachBudget,
      confirmCategorization
    }
  }
}
</script>
