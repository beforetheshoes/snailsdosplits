<template>
  <div class="container">
    <h5>Transactions</h5>
    <div class="container">
        <div class="row g-3 align-items-center my-5">
            <div class="col-auto">
                <label for="selectedAccount" class="col-form-label q-pa-md">Which account would you like to check?</label>
            </div>
            <div class="col-auto">
                <input type="text" class="form-control" id="selectedAccount" v-model="selectedAccount">
            </div>
        </div>
        <div class="row">
            <q-option-group
                v-model="separator"
                inline
                class="q-mb-md"
                :options="separatorOptions"
            />
        </div>
    </div>
    <div class="q-pa-md">
        <q-markup-table :separator="separator" flat bordered wrap-cells>
            <thead>
                <tr>
                    <th class="text-left">Account</th>
                    <th class="text-right">Date</th>
                    <th class="text-right">Payee</th>
                    <th class="text-right">Category</th>
                    <th class="text-right">Memo</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in filteredAccounts" v-bind:key="transaction.id">
                    <td class="text-left">{{transaction.account_name}}</td>
                    <td class="text-right">{{transaction.date}}</td>
                    <td class="text-right">{{transaction.payee_name}}</td>
                    <td class="text-right">{{transaction.category_name}}</td>
                    <td class="text-right">{{transaction.memo}}</td>
                    <td class="text-right">{{convertMilliUnitsToCurrencyAmount(transaction.amount).toFixed(2)}}</td>
                </tr>
            </tbody>
        </q-markup-table>
    </div>
  </div>
</template>

<script>
// Import utils from YNAB
import {utils} from 'ynab'
export default {
  data: function() {
    return {
      selectedAccount: '',
      separator: 'vertical',
      separatorOptions: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Cell', value: 'cell' },
        { label: 'None', value: 'none' }
      ]
    };
  },
  props: ['transactions'],
  methods: {
    // Now we can make this method available to our template
    // So we can format this milliunits in the correct currency format
    convertMilliUnitsToCurrencyAmount: utils.convertMilliUnitsToCurrencyAmount
  },
  computed: {
    filteredAccounts() {
      var vm = this;
      var account = this.selectedAccount;

      if (account == '') {
        return vm.transactions.sort((b,a) => new Date(a.date) - new Date(b.date));
      } else {
        return vm.transactions
          .filter(function(transaction) {
            var transaction_account = transaction.account_name.toLowerCase();
            return transaction_account.indexOf(account.toLowerCase()) >= 0;
          })
          .sort((b,a) => new Date(a.date) - new Date(b.date));
      }
    }
  }
}
</script>
