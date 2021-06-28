<template>
  <q-input
    ref="inputRef"
    v-model="value"
    outlined
    label="Amount"
    :error-message="errorMessage"
    :error="!!errorMessage"
    filled
    input-class="text-right"
  />
</template>

<script>
import useCurrencyInput from "vue-currency-input"
import { useField } from "vee-validate"

export default {
  name: "QCurrencyInput",
  props: {
    modelValue: Number,
    options: Object,
  },
  setup(props) {
    const { inputRef } = useCurrencyInput(props.options);
    const { errorMessage, value } = useField("amount", (value) => !!value);

    return { inputRef, errorMessage, value };
  },
};
</script>