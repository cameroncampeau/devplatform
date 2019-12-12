<style lang="scss">

</style>
<template>
    <div class="p-3 shadow">
        <select v-on:change="onProcessChange" name="" id="">
            <option value="capitalize">Captitalize</option>
            <option value="equation">Equation</option>
            <option value="convert">Convert</option>
            <option value="stringlength">String Length</option>
        </select>
        <div v-if="process" id="processForm">
            <div v-if="process=='capitalize'" id="capitalizeForm">
                <capitalize-form v-on:create="addProcess('capitalize', $event)"></capitalize-form>
            </div>
            <div v-if="process=='equation'" id="equationForm">
                <equation-form v-on:create="addProcess('equation', $event)"></equation-form>
            </div>
            <div v-if="process=='stringlength'" id="stringLengthForm">
                <string-length-form v-on:create="addProcess('stringlength', $event)"></string-length-form>
            </div>
            <div v-if="process=='convert'" id="convertForm">
                <convert-form v-on:create="addProcess('convert', $event)"></convert-form>
            </div>
        </div>
    </div>
</template>

<script>
import CapitalizeForm from "../process_forms/Capitalize.vue";
import EquationForm from "../process_forms/Equation.vue";
import StringLengthForm from "../process_forms/StringLength.vue";
import ConvertForm from "../process_forms/Convert.vue";

export default {
    components: {
        CapitalizeForm,
        EquationForm,
        StringLengthForm,
        ConvertForm
    },
    data: function() {
        return {
            process: "capitalize"
        }
    },
    methods: {
        onProcessChange: function(e) {
            this.process = e.target.value;
        },
        addProcess: function(type, process) {
            this.$emit("addProcess", {type, process})
        }
    }
}
</script>