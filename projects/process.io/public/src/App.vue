<template>
  <div id="app">
    <textarea v-on:change="setData" id="input"></textarea>
    <general-process-form v-on:addProcess="addProcess"></general-process-form>
    <general-process v-for="process in processes" v-bind="process"></general-process>
    <button @click="runProcessor">Run Processor</button>
    <div v-if="output" id="output">
      {{output}}
    </div>
  </div>
</template>

<script>
import Processor from "./js/Processor";
import GeneralProcessForm from "./components/process_forms/general.vue"
import GeneralProcess from "./components/processes/default.vue"

export default {
  name: "app",
  components: {GeneralProcessForm,GeneralProcess},
  data: function() {
    return {
      processor: new Processor([]),
      output: null,
      processes: []
    }
  },
  methods:  {
    addProcess: function (args){
      var type = args.type,
        process = args.process;
      this.processor.addProcess(process)
      this.processes.push(args);
    },
    runProcessor: function() {
      this.output = "";
      this.output = (this.processor.run()).toString()
      var processHistory = this.processor.getProcessHistory();
      this.processes.forEach((p,i) => {
        if (processHistory.length > i + 1) {
          this.$set(this.processes[i], "data", processHistory[i+1] )
        }
      })
    },
    setData: function() {
      this.processor.setData(this.$el.querySelector("#input").value.split(","))
    }
  },
  mounted: () => {
    window.Processor = Processor;
  }
};
</script>
