<style scoped>
h3{
    margin: 0 0 5px 0;
    font-weight: 300;
    font-size: 20px;
    text-align: left;
}
input.file-input{
    position: absolute;
    left: -9999px;
}
input.file-input + label {
    display: block;
    margin: 5px 0 0 0;
    padding: 30px 6px;
    cursor: pointer;
    border: 1px dashed rgba(0, 0, 0, 0.6);
    text-align: center;
    font-weight: 400;
    background: rgba(0, 0, 0, 0.1);
}
input.file-input + label:hover,
input.file-input + label.disabled {
    background: #ff9070;
}
.document{
    margin: 5px 0 0 0;
    padding: 5px 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    text-align: center;
    background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%);
}
h4{
    margin: 0;
    font-size: 14px;
    font-weight: bold;
}
.filename{
    color: #888;
    font-style: italic;
    font-size: 12px;
}
.size, .mime{
    display: inline-block;
    margin: 2px 10px;
    font-size: 12px;
}
</style>

<template>
    <div class="panel panel-default">

        <div class="panel-body">

            <div class="row">
                <div class="col-sm-8">
                    <h3>{{ title }}</h3>
                </div>
                <div class="col-sm-4 text-right">
                    <button type="button" class="btn btn-default" @click="dowloadAll()">
                        <i class="fa fa-download"></i>
                    </button>
                </div>
            </div>

            <input type="file" multiple
                accept="image/jpeg,image/png,application/pdf,video/mp4,video/m4v"
                :id="'file-input-' + id" 
                :disabled="upload_state == 'uploading'"
                class="file-input">
            <label :for="'file-input-' + id" class="filedrop" :class="{'disabled': upload_state == 'uploading'}">
                Choisir / Déposer des fichiers...
            </label>

            <div class="progress-wrapper" v-if="upload_state == 'uploading'">
                <div class="progress-cell">
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" :style="'width:' + (100 * upload_progress / upload_total) + '%'">
                            <span class="sr-only">{{100 * upload_progress / upload_total}}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-warning btn-block" @click="cancel()" v-if="upload_state == 'uploading'">
                <i class="fa fa-close"></i> Annuler le chargement
            </button>

            <div v-if="upload_error" class="alert alert-danger">
                Erreur {{ upload_error.response.status }} : {{ upload_error.response.statusText }}
            </div>

            <div v-if="upload_state == 'done'" class="alert alert-success">
                <strong>Vos fichiers sont chargés !</strong>
            </div>

            <div v-for="item in documents" class="document">

                <h4>{{ item.title }}</h4>
                <!--div class="filename">{{ item.filename }}</div-->

                <!--input type="text"
                    class="form-control"
                    v-model="item.title"
                    @change="rename(item.id, item.title)"
                    placeholder="Titre du document..."-->

                <div class="infos">
                    <span class="mime">{{ item.mime }}</span>
                    <span class="size" v-if="item.size < 1000000">{{ item.size / 1000 | number(1) }} ko</span>
                    <span class="size" v-else>{{ item.size / 1000000 | number(1) }} Mo</span>
                </div>
                <div class="actions">
                    <a :href="apiUrl + '/document/open/' + item.id"
                        target="_blank"
                        class="btn btn-default btn-xs">
                        <i class="fa fa-eye"></i>
                    </a>
                    <a :href="apiUrl + '/document/download/' + item.id"
                        target="_blank"
                        class="btn btn-default btn-xs">
                        <i class="fa fa-download"></i>
                    </a>
                    <button type="button" 
                        @click="destroy(item.id)" 
                        class="btn btn-danger btn-xs" 
                        v-if="canDelete">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        data() {
            return {
                id: Math.floor(Math.random()*(9999-1000+1)+1000),
                loaded: false,
                documents: [],

                files: null,
                upload_source: null,
                upload_state: 'none',
                upload_progress: 0,
                upload_total: 0,
                upload_error: null,
            };
        },
        props: {
            apiUrl: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            collection: {
                type: String,
                required: false,
                default: ''  
            },
            editTitle: {
                type: Boolean,
                required: false,
                default: true,
            },
            canAdd: {
                type: Boolean,
                required: false,
                default: true
            },
            canDelete: {
                type: Boolean,
                required: false,
                default: true
            },
        },

        mounted() {

            if(!this.loaded){
                this.read();
            }

            // -------------------------------------------------------
            //  Init cancel token
            // -------------------------------------------------------
            var CancelToken = axios.CancelToken;
            this.upload_source = CancelToken.source();

            // -------------------------------------------------------
            //  Init browse button
            // -------------------------------------------------------
            var self = this;

            $(this.$el).on('change', '.file-input', function(e){
                self.files = e.target.files;
                self.upload();
            }).on('click', '.file-input', function(e){
                this.value = null;
            });

            // -------------------------------------------------------
            //  Prevent from openning file in browser on drop
            // -------------------------------------------------------
            window.addEventListener("dragover", function(e){
                e.preventDefault();
            }, false);

            window.addEventListener("drop", function(e){
                e.preventDefault();
            }, false);

            // -------------------------------------------------------
            //  Init drag and drop
            // -------------------------------------------------------
            $(this.$el).find('.filedrop').on('drop', function(e){
                e.preventDefault();
                e.stopPropagation();
                self.files = e.originalEvent.dataTransfer.files;
                self.upload();
            });
        },

        watch: {
            apiUrl: function(){
                this.read();
            }
        },

        methods: {

            trigger() {
                $(this.$el).find('.file-input').trigger('click');
            },

            read() {
                axios.get(this.apiUrl + '/document').then(response => {
                    this.documents = response.data;
                    this.loaded = true;
                });
            },

            upload: function()
            {
                var self = this;

                this.upload_state = 'uploading';
                this.upload_progress = 0;
                this.upload_total = 0;
                this.upload_error = null;

                var formData = new FormData();
                for(var i=0; i<this.files.length; ++i){
                    formData.append('file-' + i, this.files[i], this.files[i].name);
                }
                formData.append('collection', this.collection);

                var config = {
                    onUploadProgress: function(e) {
                        console.log('upload progress', e);
                        if (e.lengthComputable) {
                            self.upload_progress = e.loaded;
                            self.upload_total = e.total;
                        }
                    },
                    //cancelToken: this.upload_source
                };

                axios.post(this.apiUrl + '/document', formData, config).then(response => {
                    //console.log('upload success', response);
                    self.upload_state = 'done';
                    self.upload_request = null;
                    self.read();

                }).catch(response => {
                    //console.log('upload error', response);
                    self.upload_state = 'none';
                    self.upload_request = null;
                    self.upload_error = response;
                });
            },


            /*upload: function()
            {
                var formData = new FormData();
                formData.append('file', this.file, this.file.name);
                //formData.append('files', this.files, this.file.name);
                
                this.$http.post(this.apiUrl + '/document', formData, {
                    upload: {
                        onprogress: (e) => {
                            if (e.lengthComputable) {
                                this.file.loaded = e.loaded;
                                this.file.size = e.total;
                            }
                        }
                    }
                }).then(response => {
                    this.getItems();
                    this.file = null;
                    this.files = [];
                })
                .catch(response => {
                    console.log('upload error', response);
                });
            },*/

            cancel: function()
            {
                if(this.upload_source){
                    console.log('upload cancel');
                    this.upload_source.cancel();
                }else{
                    console.log('Cannot cancel', this.upload_source);
                }
            },

            destroy: function(id)
            {
                this.$http.delete(this.apiUrl + '/document/' + id).then(response => {
                    this.getItems();
                })
                .catch(response => {
                    console.log('upload error', response);
                });
            },

            rename: function(id, title)
            {
                this.$http.put(this.apiUrl + '/document/' + id, {title: title}).then(response => {
                    this.getItems();
                })
                .catch(response => {
                    console.log('upload error', response);
                });
            }
        }
    }
</script>
