<style scoped>
a, .btn{
    vertical-align: top;
}
img{
    width: 100px;
    margin-right: 5px;
}
.file-input-wrapper{
    display: inline-block;
    position: relative;
    vertical-align: top;
}
label{
    display: block;
}
input{
    position: absolute;
    left: -9999px;
}
</style>

<template>
    <div class="document-uploader">
        
        <img :src="'/' + dataValue.filepath" 
            :alt="dataValue.title" 
            v-if="dataValue.mime && dataValue.mime.indexOf('image') !== -1">

        <div class="file-input-wrapper" 
            v-if="!dataValue.filepath && (!file || !file.loaded)" 
            @click="trigger()">
            <label class="btn btn-default">
                <i class="fa fa-folder-open"></i>
            </label>
            <input type="file"
                accept="image/jpeg,image/png,application/pdf"
                class="form-control file-input">
        </div>
        <div class="progress" v-if="file && file.loaded">
            <div class="progress-bar" 
                role="progressbar" 
                :style="'width: ' + (file ? 100 * file.loaded / file.size : 0) + '%'">
                    <span class="sr-only">{{ file ? 100 * file.loaded / file.size : 0 }}% Complete</span>
            </div>
        </div>
        <a :download="dataValue.filename"
            :href="'/' + dataValue.filepath"
            v-if="dataValue.filepath"
            class="btn btn-default">
            <i class="fa fa-download"></i>
        </a>
        <button class="btn btn-danger"
            v-if="dataValue.filepath"
            @click="destroy()">
            <i class="fa fa-trash"></i>
        </button>
    </div>

</template>

<script>
    import inputMixin from '../mixins/InputMixin.js'
    export default {
        mixins: [inputMixin],
        
        data() {
            return {
                file: null,
                dataValue: {}
            };
        },
        props: {
            apiUrl: {
                type: String,
                required: true
            }
        },

        mounted() {
            var self = this;
            $(this.$el).on('change', '.file-input', function(e){
                self.file = e.target.files[0];
                self.upload();
                self.value = null;
            }).on('click', '.file-input', function(e){
                this.value = null;
            });
        },

        methods: {

            trigger() {
                $(this.$el).find('.file-input').trigger('click');
            },

            // -------------------------------------------------------
            //  Upload
            // -------------------------------------------------------
            upload()
            {
                var formData = new FormData();
                formData.append('file', this.file, this.file.name);
                formData.append('name', this.name);

                axios.post(this.apiUrl + '/file', formData, {
                    upload: {
                        onprogress: (e) => {
                            if (e.lengthComputable) {
                                this.file.loaded = e.loaded;
                                this.file.size = e.total;
                            }
                        }
                    }
                }).then(response => {
                    this.updateValue(response.data);
                    this.file = null;
                }).catch(response => {
                    console.log('upload error', response);
                });
            },

            destroy()
            {
                console.log('destroy', this.name);
                axios.delete(this.apiUrl + '/file/' + this.name).then(response => {
                    this.updateValue([]);
                }).catch(response => {
                    console.log('upload error', response);
                });
            }
        }
    }
</script>
