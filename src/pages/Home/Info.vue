<template>
  <page>
    
    <page-header>
      <template #title>
        YNAB For Snails
      </template>
    </page-header>

    <page-body>
      <div class="q-pa-sm q-mb-xl">
        <h5>Scenario:</h5>
        <p>
          Two people with different bank accounts and different budgets in YNAB (but using the same YNAB account) split purchases. 
          These purchases need to be entered into both budgets and you need to be able to audit the purchase history in case the 
          numbers don't match up (which they always should). Previously, every shared purchase required the purchaser to enter the 
          original purchase into their YNAB budget, then move money from one category to another in the other person's budget, and 
          then enter the transaction into Splitwise as an intermediary of sorts, for reference in case of discrepancies.
        </p>

        <h5>Requirements:</h5>
        <ol>
          <li>Both people must be using the same account with separate budgets for each</li>
          <li>Both budgets must have an un-linked cash account and a category with the other person's budget name + " | YNABFS". Example:</li>
          <ul>
            <li>My name is Ryan and that's the name of my budget.</li>
            <li>My partner must have a cash account named "Ryan | YNABFS" and a category named "Ryan | YNABFS"</li>
            <li>If my budget was called "Ryan Budget", the cash account and category would have to be named "Ryan Budget | YNABFS"</li>
            <li>In my budget, I have a cash account and a category with her budget name + " | YNABFS"</li>
          </ul>
        </ol>

        <h5>Transactions:</h5>
        <p>
          Once this is set up, you can use the app. When you complete a transaction in the app, it will create three transactions:
        </p>
        <ol>
          <li>The main transaction:</li>
          <ul>
            <li>If I buy groceries from the store, the main transaction is the payment I made to the store.</li>
            <li>The payee will be the store and the outflow will be the full outflow. This should look just like it would if the transaction 
            automatically synced to YNAB once the payment cleared.</li>
            <li>The transaction's categories are automatically split up between the categories you selected for your own budget, and the 
            share that you specify for the other person's budget.</li>
            <li>The other person's share is categorized as the category you initially created (i.e. "[budget name] | YNABFS")</li>
          </ul>
          <li>The balancing transaction:</li>
          <ul>
            <li>This transaction zeroes out the category balance that was just created on the purchaser's budget by creating an inflow 
            transaction for the other person's share of the purchase.</li>
            <li>That inflow is put into the cash account you created initially with the other person's budget name + "| YNABFS".</li>
            <li>The reasoning behind this is that categories are hard to audit and they don't persist between months. Some may consider it 
            bad practice to have an account in YNAB with a positive balance of money that you don't actually have. That's understandable 
            but I'm doing it anyway.</li>
          </ul>
          <li>The other share's transaction:</li>
          <ul>
            <li>This is the transaction on the other person's budget for their share of the purchase. It is an outflow transaction, using 
            whichever categories were specified for their share.</li>
          </ul>
        </ol>
    
        <h5>Settling Up:</h5>
        <p>
          When it's time to settle up, the person who owes money will be the person who has a negative balance in their account named 
          after the other person's budget. When the payment is made:
        </p>
        <ul>
          <li>The person who is settling up will change the settling up YNAB transaction to be a transfer from whichever account they 
          paid with to the cash account with the other person's budget name. This is not a separate transaction from the payment 
          itself. Let's say you Venmo the other person from your checking account. When the transaction shows up in YNAB, you would 
          change the Payee from "Venmo" to "Transfer from: [budget name] | YNABFS". Because it's a transfer, you won't need to categorize 
          it. This is because you already categorized each purchase as they were made.</li>
          <li>The person receiving the money will do the same. When the inflow transaction shows up in the receiving account, you will change 
          the Payee to "Transfer from: [budget name] | YNABFS". This will zero out the balance on that account and you will be settled up.</li>
        </ul>
      </div>
    </page-body>
  </page>
</template>


