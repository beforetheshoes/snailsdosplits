<template>
      <q-dialog @hide="validateAndSaveCard">
        <q-card class="my-card">
            <q-card-section>
            <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">
                Total ${{ store.state.transactionAmount / 100 }}
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
                        <div class="col"><q-radio v-model="data.splitRatio" val="0/100" label="Splitter owes purchaser 100%" /></div>
                    </div>
                    <div class="row">
                        <div class="col"><q-radio v-model="data.splitRatio" val="50/50" label="Split 50/50" /></div>
                    </div>
                    <div class="row">
                        <div class="col"><q-radio v-model="data.splitRatio" val="specifyPurchaserShare" label="Specify Purchaser's Share" /></div>
                    </div>
                    <div class="row" v-if="data.splitRatio==='specifyPurchaserShare'">
                        <div class="col">
                        <currency-input
                            v-model="data.purchaserPurchaseRatio"
                            :options="{ currency: 'USD', autoDecimalDigits: true, exportValueAsInteger: true }"
                        />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col"><q-radio v-model="data.splitRatio" val="specifySplitterShare" label="Specify Splitter's Share" /></div>
                    </div>
                    <div class="row">
                        <div class="col" v-if="data.splitRatio==='specifySplitterShare'">
                        <currency-input 
                            v-model="data.splitterPurchaseRatio"
                            :options="{ currency: 'USD', autoDecimalDigits: true, exportValueAsInteger: true }"
                        />
                        </div>
                    </div>
                </div>
            

                <q-separator />
                
                <q-item>
                    <q-item-section>{{ store.state.purchasingBudget['name'] }}</q-item-section>
                    <q-item-section side>
                        <q-item-label caption>${{ purchaserRatio / 100 }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>{{ store.state.splittingBudget['name'] }}</q-item-section>
                    <q-item-section side>
                        <q-item-label caption>${{ splitterRatio / 100 }}</q-item-label>
                    </q-item-section>
                </q-item>

            </div>
            </q-card-section>
            <q-separator />
                <p class="q-mt-sm text-center text-caption">Note: Splitter's share cannot be zero.</p>
            <q-separator />
            <q-card-actions align="right">
            <q-btn v-close-popup flat color="primary" label="Save" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { inject, reactive, computed } from 'vue'
import CurrencyInput from '../components/CurrencyInput.vue'

export default {
    components: { CurrencyInput },
    setup() {
        const data = reactive({
            splitRatio: '50/50',
            purchaserPurchaseRatio: 0,
            splitterPurchaseRatio: 0
        })
        const store = inject('store')

    const purchaserRatio = computed(() => { 
      switch (data.splitRatio) {
        case '0/100':
          return 0
        case '50/50':
          return (Math.round((store.state.transactionAmount * .5) + Number.EPSILON) * 10) / 10
        case 'specifyPurchaserShare':
          return data.purchaserPurchaseRatio
        case 'specifySplitterShare':
          return store.state.transactionAmount - data.splitterPurchaseRatio
        default:
          return (Math.round((store.state.transactionAmount * .5) + Number.EPSILON) * 10) / 10
      }
    })

    const splitterRatio = computed(() => { 
      return (((store.state.transactionAmount * 100) - (purchaserRatio.value * 100)) / 100)
    })

    function validateAndSaveCard() {
      if (
          purchaserRatio.value <= store.state.transactionAmount && 
          purchaserRatio.value >= 0 && 
          purchaserRatio.value !== null &&
          splitterRatio.value > 0
         ) {
        store.state.purchaserAmount = Number(purchaserRatio.value)
        store.state.splitterAmount = Number(splitterRatio.value)
        store.state.purchaserCategorySplits.length = 0
        store.state.splitterCategorySplits.length = 0
      } else {
        alert("You have entered unacceptable values and you know it.")
      }
    }

        return {
            data,
            store,
            purchaserRatio,
            splitterRatio,
            validateAndSaveCard
        }
    }
}
</script>
