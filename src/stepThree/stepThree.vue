<template>
  <md-list>
    <!-- <md-progress-bar v-if="started"
                     md-mode="determinate"
                     :md-value="progress"></md-progress-bar>
    Parsing '{{fileToParse.name}}'... -->
    <FileProgressListItem v-for="(item, index) in filesComputed"
                          :key="index"
                          :file="item"></FileProgressListItem>
  </md-list>
</template>

<script>
import CsvHandler from "./../CsvHandler";
import CsvDataHandler from "./CsvDataHandler";
import FileProgressListItem from "./FileProgressListItem.vue";

export default {
  name: "stepThree",
  components: { FileProgressListItem },
  props: [
    "files",
    "startParse",
    "encoding",
    "outputDeviceName",
    "decimalPatern",
    "datePatern",
    "subNetworkId",
    "contextId"
  ],
  data() {
    return {
      filesComputed: [],
      started: false
    };
  },
  methods: {
    async start() {
      const start = Date.now();
      this.started = true;
      this.filesComputed = this.files.map(e => {
        return {
          file: e.file,
          output: e.output,
          progress: 0,
          error: false
        };
      });
      for (let idx = 0; idx < this.files.length; idx++) {
        const csvDataHandler = new CsvDataHandler(
          this.encoding,
          this.decimalPatern,
          this.datePatern
        );
        const element = this.files[idx].file;
        const output = this.files[idx].output;
        const id = idx;
        let count = 0;
        // eslint-disable-next-line no-await-in-loop
        await this.CsvHandler.parse(element, this.encoding).then(
          () => {
            console.log("parse ended", Date.now() - start);
            return csvDataHandler
              .consumeDataParsed(this.subNetworkId, this.contextId, output)
              .then(
                () => {
                  console.log(
                    "created data from parse done.",
                    Date.now() - start
                  );
                },
                e => {
                  console.error(e);
                },
                progress => {
                  this.filesComputed[id].progress = progress * 100;
                }
              );
          },
          () => {},
          data => {
            csvDataHandler.onData(data[0], count);
            count += 1;
          }
        );
      }
      this.started = false;
    }
  },
  watch: {
    startParse(value) {
      if (value === true && this.started === false) {
        this.start();
      }
    }
  },
  mounted() {
    this.CsvHandler = new CsvHandler();
  }
};
</script>
