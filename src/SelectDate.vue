<template>
  <md-field md-dense>
    <label for="Encoding">Date</label>
    <md-select v-model="selection"
               name="Encoding"
               md-dense>
      <md-option v-for="datePatern in datePaterns"
                 :key="datePatern"
                 :value="datePatern">{{datePatern}}</md-option>
    </md-select>
  </md-field>
</template>

<script>
import { datePaterns } from "./datePatern.js";
export default {
  name: "SelectEncoding",
  props: ["value"],
  data() {
    return {
      datePaterns
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
