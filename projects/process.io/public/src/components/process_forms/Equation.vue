<style>

</style>
<template>
    <div>
        <label>
            Equation ($num for input) <input id="equation" type="text">
        </label>
        <button @click="create">Add Process</button>
    </div>
</template>

<script>
import Equation from "../../js/processes/Equation";
export default {
    data: function() {
        return {}
    },
    methods: {
        create: function() {
            var equation = this.$el.querySelector("#equation").value;
            this.$emit("create", new Equation({equation}))
        }
    }
}
</script>
