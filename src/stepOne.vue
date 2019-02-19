<template>
  <md-field>
    <label>Upload the CSV File(s).</label>
    <md-file multiple
             @md-change="onFileSelectChange" />
  </md-field>
</template>

<script>
export default {
  name: "stepOne",
  data() {
    return {};
  },
  methods: {
    onFileSelectChange(files) {
      const res = [];
      for (let idx = 0; idx < files.length; idx++) {
        res.push({
          output: files[idx].name,
          file: files[idx]
        });
      }

      this.$emit("onFileSelect", res);
    }
  }
};
</script>
