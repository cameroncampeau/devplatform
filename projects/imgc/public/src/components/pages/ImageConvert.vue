<template>
    <div>
        <h3><!-- Convert an Image !--></h3>
        <div>
            <form id="imageForm" @submit.prevent="submitImage" method="POST" enctype="multipart/form-data">
                <label>File <input id="file" type="file"></label>
                <select id="format">
                    <option value="png">PNG</option>
                    <option value="svg">SVG</option>
                    <option value="jpg">JPG</option>
                </select>
                <button>Submit</button>
            </form>
        </div>
        <img class="d-none" src="" alt="" id="imgPreview">
        <a href="" id="download" download>Download</a>
    </div>
</template>

<script>
export default {
    methods: {
        submitImage: function(e) {
            e.preventDefault();
            var format = "png";//this.$el.querySelector("#format").value;
            var formData = new FormData();
            formData.append("file", this.$el.querySelector("input#file").files[0])
            window.api.post("/image/convert/jpg", formData).then((res) => {
                res = JSON.parse(res);
                console.log(res);
                this.$el.querySelector("#imgPreview").src = "/image/" + res.filename;
                this.$el.querySelector("#download").href = "/image/" + res.filename;
            })
        }
    }    
}
</script>
    