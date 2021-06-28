<h3><b>Scenario:</b></h3>

Two people with different bank accounts and different budgets in YNAB (but using the same YNAB account) split purchases. These purchases need to be entered into both budgets and you need to be able to audit the purchase history in case the numbers don't match up (which they always should). Previously, every shared purchase required the purchaser to enter the original purchase into their YNAB budget, then move money from one category to another in the other person's budget, and then enter the transaction into Splitwise as an intermediary of sorts, for reference in case of discrepancies.


<h3><b>Requirements:</b></h3>

1. Both people must be using the same account with separate budgets for each
2. Both budgets must have an un-linked cash account and a category with the other person's budget name + " | YNABFS". Example:
    - My name is Ryan and that's the name of my budget. 
    - My partner must have a cash account named "Ryan | YNABFS" and a category named "Ryan | YNABFS"
    - If my budget was called "Ryan Budget", the cash account and category would have to be named "Ryan Budget | YNABFS"
    - In my budget, I have a cash account and a category with her budget name + " | YNABFS"


<h3><b>Transactions:</b></h3>

Once this is set up, you can use the app. When you complete a transaction in the app, it will create three transactions:

1. The main transaction: 
    - If I buy groceries from the store, the main transaction is the payment I made to the store. 
    - The payee will be the store and the outflow will be the full outflow. This should look just like it would if the transaction automatically synced to YNAB once the payment cleared.
    - The transaction's categories are automatically split up between the categories you selected for your own budget, and the share that you specify for the other person's budget.
    - The other person's share is categorized as the category you initially created (i.e. "[budget name] | YNABFS")
2. The balancing transaction: 
    - This transaction zeroes out the category balance that was just created on the purchaser's budget by creating an inflow transaction for the other person's share of the purchase. 
    - That inflow is put into the cash account you created initially with the other person's budget name + "| YNABFS". 
    - The reasoning behind this is that categories are hard to audit and they don't persist between months. Some may consider it bad practice to have an account in YNAB with a positive balance of money that you don't actually have. That's understandable but I'm doing it anyway.
3. The other share's transaction:
    - This is the transaction on the other person's budget for their share of the purchase. It is an outflow transaction, using whichever categories were specified for their share.


<h3><b>Settling Up:</b></h3>

When it's time to settle up, the person who owes money will be the person who has a negative balance in their account named after the other person's budget. When the payment is made:

- The person who is settling up will change the settling up YNAB transaction to be a transfer from whichever account they paid with to the cash account with the other person's budget name. This is not a separate transaction from the payment itself. Let's say you Venmo the other person from your checking account. When the transaction shows up in YNAB, you would change the Payee from "Venmo" to "Transfer from: [budget name] | YNABFS". Because it's a transfer, you won't need to categorize it. This is because you already categorized each purchase as they were made.
- The person receiving the money will do the same. When the inflow transaction shows up in the receiving account, you will change the Payee to "Transfer from: [budget name] | YNABFS". This will zero out the balance on that account and you will be settled up.


<h3><b>Build information:</b></h3>

# ynabquasar (ynabquasar)

A Quasar Framework app

## Install the dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://v2.quasar.dev/quasar-cli/quasar-conf-js).
