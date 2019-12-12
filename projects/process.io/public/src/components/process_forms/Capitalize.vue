<style>

</style>
<template>
    <div>
        <label>
            First letter only <input type="checkbox" id="firstOnly">
        </label>
        <button @click="create">Add Process</button>
    </div>
</template>

<script>
import CapitalizeProcess from "../../js/processes/Capitalize";
export default {
    methods: {
        create: function() {
            this.$emit("create", new CapitalizeProcess({firstOnly: this.$el.querySelector("#firstOnly").checked}))
        }
    }
}
</script>