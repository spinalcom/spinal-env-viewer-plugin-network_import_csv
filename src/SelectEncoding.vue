<template>
  <md-field md-dense>
    <label for="Encoding">Encoding</label>
    <md-select v-model="selection"
               name="Encoding"
               md-dense>
      <md-optgroup v-for="encodingGroup in encodingGroups"
                   :key="encodingGroup.heading"
                   :label="encodingGroup.heading">
        <md-option v-for="encodingObj in encodingGroup.encodings"
                   :key="encodingObj.name"
                   :value="encodingObj.name">{{encodingObj.name}}</md-option>
      </md-optgroup>
    </md-select>
  </md-field>
</template>

<script>
import encodingGroups from "../encoding.json";
export default {
  name: "SelectEncoding",
  props: ["value"],
  data() {
    return {
      encodingGroups
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
