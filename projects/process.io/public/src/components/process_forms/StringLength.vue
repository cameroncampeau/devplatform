<style>

</style>
<template>
    <div>
        <button @click="create">Add Process</button>
    </div>
</template>

<script>
import StringLength from "../../js/processes/StringLength";
export default {
    data: function() {
        return {}
    },
    methods: {
        create: function() {
            this.$emit("create", new StringLength({}))
        }
    }
}
</script>
