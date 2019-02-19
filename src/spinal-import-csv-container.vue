<!--
Copyright 2018 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="spinal-import-csv-container">
    <md-steppers md-vertical
                 :md-active-step.sync="active"
                 :md-dynamic-height="true">
      <md-step id="Upload"
               md-label="Upload the CSV File(s)">
        <stepOne @onFileSelect="onFileSelect"></stepOne>
      </md-step>
      <md-step id="Validation"
               md-label="File(s) Selection Validation">
        <stepTwo :files="files"
                 @removeFile="removeFile"
                 @updateNameFile="updateNameFile"
                 @done="onValidationDone"></stepTwo>

      </md-step>
      <md-step id="Parsing"
               md-label="Parsing..."
               :md-editable="false">
        <stepThree :files="files"
                   :outputDeviceName="outputDeviceName"
                   :decimalPatern="decimalPatern"
                   :encoding="encoding"
                   :datePatern="datePatern"
                   :subNetworkId="subNetworkId"
                   :contextId="contextId"
                   :startParse="startParse"></stepThree>
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
import stepOne from "./stepOne.vue";
import stepTwo from "./stepTwo.vue";
import stepThree from "./stepThree/stepThree.vue";
import unionBy from "lodash.unionby";

export default {
  name: "spinal-import-csv-container",
  components: {
    stepOne,
    stepTwo,
    stepThree
  },
  data() {
    return {
      active: "Upload",
      files: [],
      startParse: false,
      outputDeviceName: "",
      decimalPatern: "",
      datePatern: "",
      encoding: "",
      subNetworkId: "",
      contextId: ""
    };
  },
  methods: {
    onFileSelect(files) {
      this.active = "Validation";
      this.files = unionBy(this.files, files, "output");
    },
    removeFile(idx) {
      this.files.splice(idx, 1);
    },
    updateNameFile(file, name) {
      for (let idx = 0; idx < this.files.length; idx++) {
        const element = this.files[idx];
        if (file === element) file.output = name;
      }
    },
    onValidationDone(cfg) {
      this.outputDeviceName = cfg.outputDeviceName;
      this.decimalPatern = cfg.decimalPatern;
      this.datePatern = cfg.datePatern;
      this.encoding = cfg.encoding;

      this.startParse = true;
      this.active = "Parsing";
    },
    opened(opt) {
      this.subNetworkId = opt.selectedNode.id.get();
      this.contextId = opt.context.id.get();
    },
    removed() {},
    closed() {}
  }
};
</script>

<style>
.spinal-import-csv-container {
  height: 100%;
}
.spinal-import-csv-container,
.spinal-import-csv-container * {
  box-sizing: border-box;
}
.spinal-import-csv-container .md-content {
  background-color: rgba(66, 66, 66, 0.4);
}

.spinal-import-csv-container
  .md-steppers.md-vertical
  .md-stepper-content.md-active {
  padding-bottom: 0;
  padding-right: 12px;
}

.md-select-menu.md-menu-content-bottom-start.md-menu-content-small.md-menu-content {
  z-index: 99;
}
</style>
