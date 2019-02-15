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
  <!-- eslint-disable vue/require-v-for-key -->
  <!-- eslint-disable vue/valid-v-for -->
  <md-dialog class="preview-csv"
             :md-active.sync="isOpenComputed"
             :md-close-on-esc=true
             :md-click-outside-to-close=true
             :md-closed=onClose>
    <md-dialog-title>Preview: {{fileName}}</md-dialog-title>
    <md-dialog-content class="md-scrollbar">
      <div class="md-layout">
        <SelectEncoding class="md-layout-item"
                        v-model="encodingComputed"></SelectEncoding>
        <SelectDecimal class="md-layout-item"
                       v-model="decimalPaternComputed"></SelectDecimal>
        <SelectDate class="md-layout-item"
                    v-model="datePaternComputed"></SelectDate>
      </div>
      <md-table class="md-scrollbar">
        <md-table-row v-for="row in fileData">
          <md-table-cell v-for="col in row">{{col}}</md-table-cell>
        </md-table-row>
      </md-table>
      <div v-if="fileData.length > 0">Number of collums displayed
        <input type="number"
               class="input-data-col-nbr"
               v-model="dataColNbr"> / {{totalDataColNbr}}</div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog">Close</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import SelectEncoding from "./SelectEncoding.vue";
import SelectDecimal from "./SelectDecimal.vue";
import SelectDate from "./SelectDate.vue";
import CsvHandler from "./CsvHandler.js";
import { parseDate } from "./datePatern.js";
import debounce from "lodash.debounce";
export default {
  name: "chartOptionDialog",
  data() {
    return {
      fileData: [],
      totalDataColNbr: 0,
      dataColNbr: 15,
      fileName: ""
    };
  },
  components: { SelectEncoding, SelectDecimal, SelectDate },
  props: ["isOpen", "value", "decimalPatern", "file", "datePatern"],
  computed: {
    isOpenComputed: {
      get() {
        return this.isOpen;
      },
      set(value) {
        if (value === false) {
          this.onClose();
        }
      }
    },
    encodingComputed: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
        this.fileData = [];
      }
    },
    decimalPaternComputed: {
      get() {
        return this.decimalPatern;
      },
      set(value) {
        this.$emit("onDecimalPaternChange", value);
        this.fileData = [];
      }
    },
    datePaternComputed: {
      get() {
        return this.datePatern;
      },
      set(value) {
        this.$emit("onDatePaternChange", value);
        this.fileData = [];
      }
    }
  },
  watch: {
    dataColNbr() {
      this.debouncedPreview();
    },
    value() {
      this.debouncedPreview();
    },
    decimalPatern() {
      this.debouncedPreview();
    },
    datePatern() {
      this.debouncedPreview();
    },
    isOpen() {
      this.debouncedPreview();
    }
  },
  methods: {
    createPreview() {
      if (
        (this.fileData.length === 0 ||
          this.fileData.length !== this.dataColNbr) &&
        this.isOpen === true &&
        this.file !== undefined
      ) {
        this.fileName = this.file.name;
        this.CsvHandler.getPreview(this.file, this.value).then(data => {
          const lighthenData = data.map(el => el.slice(0, this.dataColNbr));
          const dataRow = lighthenData[3];
          lighthenData[0].unshift("Parsed Date");
          lighthenData[1].unshift("");
          lighthenData[2].unshift("");
          lighthenData[3].unshift(
            parseDate(`${dataRow[0]} ${dataRow[1]}`, this.datePatern)
          );

          for (let idx = 3; idx < dataRow.length; idx++) {
            let element;
            if (this.decimalPatern === "comma") {
              element = parseFloat(dataRow[idx].replace(",", "."));
            } else {
              element = parseFloat(dataRow[idx]);
            }
            dataRow[idx] = Number.isNaN(element) ? dataRow[idx] : element;
          }
          this.totalDataColNbr = data[0].length;
          this.fileData = lighthenData;
        });
      }
    },
    closeDialog() {
      this.isOpenComputed = false;
    },
    onClose() {
      this.$emit("closeDialog");
    }
  },
  mounted() {
    this.CsvHandler = new CsvHandler();
    this.debouncedPreview = debounce(this.createPreview.bind(this), 1000);
  }
};
</script>

<style>
.preview-csv-container {
  padding: 0 10px;
}

.preview-csv-container-border {
  border: 1px solid #a6a6a7;
}
.preview-csv-postion-header {
  margin: unset;
}
.md-dialog.preview-csv > .md-dialog-container {
  max-height: 80vh;
}
.preview-csv .md-scrollbar::-webkit-scrollbar {
  background-color: #121212;
}
.preview-csv .md-scrollbar::-webkit-scrollbar-thumb {
  background-color: #737374;
}
.preview-csv .input-data-col-nbr {
  background-color: #666666;
  color: white;
  text-align: center;
  width: 7em;
}
</style>
