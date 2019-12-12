<style lang="scss" scoped>
    .data {
        width:30px;
        margin:5px;
        text-align:center;
    }
    .process {
        display: inline-block;
        border:1px solid black;
        margin:10px;
        padding:5px;
    }
</style>
<template>
    <div class="process">
        <h5>{{type}}</h5>
        <div v-if="data && data.length > 0">
            <input class="data" v-for="el in data" disabled v-bind:value="el">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: ""
        },
        process: {
            type: Object,
            default: () => {}
        },
        data: {
            type: Array,
            default: () => []
        }
    }
}
</script>