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
  <div>
    <md-dialog :md-active.sync="showDialog"
               @md-closed="closeDialog">
      <md-dialog-title>{{title}}</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>{{labelName}}</label>
          <md-input v-model="inputNameValue"></md-input>
        </md-field>
        <md-field>
          <label>{{labelType}}</label>
          <md-input v-model="inputTypeValue"></md-input>
        </md-field>

      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="closeDialog">Close</md-button>
        <md-button class="md-primary"
        :disabled="inputNameValue.length === 0 && inputTypeValue.length === 0"
                   @click="confim">Confirm</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
export default {
  name: "confim-dialog-create-network",
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      title: "Create BMS Network",
      labelName: "Name of the BMS network.",
      inputNameValue: "",
      labelType: "Type of the BMS network.",
      inputTypeValue: ""
    };
  },
  methods: {
    confim() {
      if (typeof this.confimFunc !== "undefined") {
        this.confimFunc(this.context.id.get(), this.inputNameValue, this.inputTypeValue);
      }
      this.closeDialog();
    },
    opened(option) {
      this.context = option.context;
      this.confimFunc = option.func;
    },

    removed() {
      this.showDialog = false;
    },
    closeDialog() {
      if (typeof this.onFinised === "function") {
        this.onFinised();
      }
    }
  }
};
</script>
