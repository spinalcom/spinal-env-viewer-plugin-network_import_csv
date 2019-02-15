<template>
  <md-field md-dense>
    <label for="food">Decimal Patern</label>
    <md-select v-model="selection"
               name="Encoding"
               md-dense>
      <md-option v-for="decimalPatern in decimalPaterns"
                 :key="decimalPatern.value"
                 :value="decimalPatern.value">{{decimalPatern.label}}</md-option>
    </md-select>
  </md-field>
</template>

<script>
export default {
  name: "SelectDecinal",
  props: ["value"],
  data() {
    return {
      decimalPaterns: [
        { label: "1000.00", value: "dot" },
        { label: "1000,00", value: "comma" }
      ]
    };
  },
  computed: {
    selection: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>
