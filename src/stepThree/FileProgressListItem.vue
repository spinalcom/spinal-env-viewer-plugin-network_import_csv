<template>
  <md-list-item>
    <div>
      {{state}}
    </div>
    <div class="fileProgress-bar-container">
      <md-progress-bar md-mode="determinate"
                       :class="{'md-accent': this.file.error}"
                       :md-value="this.file.progress"></md-progress-bar>
    </div>

  </md-list-item>
</template>

<script>
export default {
  name: "FileProgressListItem",
  props: ["file"],
  computed: {
    state() {
      if (this.file.error) {
        return `File '${this.file.file.name}' Error...`;
      }
      if (this.file.progress === 0) {
        return `File '${this.file.file.name}' Waiting...`;
      }
      if (this.file.progress === 100) {
        return `File '${this.file.file.name}' Done...`;
      }
      return `File '${this.file.file.name}' Importing...`;
    }
  }
};
</script>

<style>
.fileProgress-bar-container {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>
