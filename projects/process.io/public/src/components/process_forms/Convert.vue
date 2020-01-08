<style>

</style>
<template>
    <div>
        Convert To: <select v-on:change="onOutputTypeChange">
            <option value="integer">Integer</option>
            <option value="float">Float</option>
            <option value="hexadecimal">Hexadecimal</option>
            <option value="string">String</option>
        </select>
        <button @click="create">Add Process</button>
    </div>
</template>

<script>
import ConvertProcess from "../../js/processes/Convert";
export default {
    data: function () {
        return {
            output: "integer"
        }
    },
    methods: {
        onOutputTypeChange: function(e) {
            this.output = e.target.value;
        },
        create: function() {
            this.$emit("create", new ConvertProcess({output: this.output}))
        }
    }
}
</script>