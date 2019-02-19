<template>
  <div class="spinal-import-csv-container-step-two">
    <md-list class="md-dense">
      <md-list-item class="my-hover"
                    v-for="(file, idx) in fileList"
                    :key="idx">
        <input
               class="md-list-item-text input-name"
               v-model="file.output" />
        <md-button @click="openPreview(file)"
                   v-tooltip="'preview'"
                   class="md-icon-button md-dense md-primary">
          <md-icon class="">pageview</md-icon>
        </md-button>
        <md-button @click="removeitem(idx)"
                   v-tooltip="'Remove File'"
                   class="md-icon-button md-dense md-accent">
          <md-icon class="">cancel</md-icon>
        </md-button>
      </md-list-item>
      <div class="md-layout">
        <SelectEncoding class="md-layout-item"
                        v-model="encoding"></SelectEncoding>
        <SelectDecimal class="md-layout-item"
                       v-model="decimalPatern"></SelectDecimal>
      </div>
      <md-button :disabled="fileList.length === 0"
                 @click="validate"
                 :encoding="encoding"
                 :decimalPatern="decimalPatern"
                 class="md-primary md-raised md-dense">
        Start Parse !<md-icon class="md-warn">assignment_turned_in</md-icon>
      </md-button>

    </md-list>
    <PreviewCSV :isOpen="openDialogPreview"
                v-model="encoding"
                :decimalPatern="decimalPatern"
                @onDecimalPaternChange="onDecimalPaternChange"
                :file="previewFile"
                :datePatern="datePatern"
                @onDatePaternChange="onDatePaternChange"
                @closeDialog="onClosePreview"></PreviewCSV>

    <!-- <edit-name-dialog :open="openEditConfirmDialog"
    @onCloseDialog="editConfirmName"></edit-name-dialog> -->
  </div>
</template>

<script>
import SelectEncoding from "./SelectEncoding.vue";
import SelectDecimal from "./SelectDecimal.vue";
import PreviewCSV from "./PreviewCSV.vue";
import { datePaterns } from "./datePatern.js";
// import editNameDialog from "./editNameDialog.vue";
export default {
  name: "stepTwo",
  props: ["files"],
  components: { SelectEncoding, SelectDecimal, PreviewCSV },
  data() {
    return {
      decimalPatern: "comma",
      currentFiles: [],
      openDialogPreview: false,
      encoding: "UTF-8",
      datePatern: datePaterns[0],
      previewFile: undefined,
      openEditConfirmDialog: false
    };
  },
  computed: {
    fileList: {
      get() {
        if (this.files instanceof FileList) {
          const res = [];
          for (let idx = 0; idx < this.files.length; idx++) {
            const element = this.files[idx];
            res.push(element);
          }
          return res;
        }
        return this.files;
      }
    }
  },
  methods: {
    editName(file) {
      file.edit = true;
      console.log(file);

      // this.openEditConfirmDialog = true;
      // this.__file = file;
    },
    // editConfirmName(name) {
    //   this.openEditConfirmDialog = false;
    //   this.$emit("updateNameFile", this.__file, name);
    // },
    removeitem(idx) {
      this.$emit("removeFile", idx);
    },
    validate() {
      this.$emit("done", {
        decimalPatern: this.decimalPatern,
        datePatern: this.datePatern,
        encoding: this.encoding
      });
    },
    openPreview(file) {
      this.previewFile = file.file;
      this.openDialogPreview = true;
    },
    onClosePreview() {
      this.previewFile = undefined;
      this.openDialogPreview = false;
    },
    onDecimalPaternChange(value) {
      this.decimalPatern = value;
    },
    onDatePaternChange(value) {
      this.datePatern = value;
    }
  }
};
</script>

<style>
.my-hover:hover {
  background-color: #365bab;
}

.spinal-import-csv-container-step-two
  .md-list
  > .md-list-item
  > .md-list-item-container {
  height: 30px;
}
.spinal-import-csv-container-step-two
  .md-list
  > .md-list-item
  > .md-list-item-container
  > .md-list-item-content {
  min-height: 30px;
}

.spinal-import-csv-container-step-two
  .md-list
  > .md-list-item
  > .md-list-item-container
  > .md-list-item-content
  > span.md-list-item-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.spinal-import-csv-container-step-two
  > .md-list
  > .md-list-item
  .md-button.md-icon-button {
  margin: 0;
}
.spinal-import-csv-container-step-two
  > .md-list
  > .md-list-item
  input.input-name {
  background-color: transparent;
  border: 0;
  color: white;
}

.spinal-import-csv-container-step-two
  > .md-list
  > .md-list-item
  input.input-name::-moz-selection { /* Code for Firefox */
  color: white;
  background: red;
}
.spinal-import-csv-container-step-two
  > .md-list
  > .md-list-item
  input.input-name::selection {
  color: white;
  background: red;
}

</style>
