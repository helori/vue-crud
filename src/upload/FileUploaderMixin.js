export default {
    data() {
        return {
            upload_url: null,
            upload_promise: null,
            
            upload_source: null,
            upload_state: 'none',
            upload_progress: 0,
            upload_total: 0,
            upload_error: null,
        };
    },

    mounted() {

        // -------------------------------------------------------
        //  Init cancel token
        // -------------------------------------------------------
        var CancelToken = axios.CancelToken;
        this.upload_source = CancelToken.source();
    },
    
    methods: {

        upload(config)
        {
            let files = config.files;
            let multiple = config.multiple;
            let collection = config.collection ? config.collection : null;
            let documentId = config.documentId ? config.documentId : null;
            let upload_url = config.upload_url ? config.upload_url : this.upload_url;

            let self = this;

            this.upload_state = 'uploading';
            this.upload_progress = 0;
            this.upload_total = 0;
            this.upload_error = null;

            let formData = new FormData();

            if(multiple){
                
                for(var i=0; i<files.length; ++i){
                    formData.append('file-' + i, files[i], files[i].name);
                }

            }else{

                //formData.append('documentId', this.documentId);
                formData.append('file-0', files[0], files[0].name);
            }

            formData.append('multiple', multiple);

            if(collection !== null){
                formData.append('collection', collection);
            }

            if(documentId !== null){
                formData.append('documentId', documentId);
            }

            var request_config = {
                
                method: 'post',
                url: upload_url,
                name: 'Uploading files',
                data: formData,
                onUploadProgress: function(e) {
                    //console.log('upload progress', e);
                    if (e.lengthComputable) {
                        self.upload_progress = e.loaded;
                        self.upload_total = e.total;
                    }
                },
                //cancelToken: this.upload_source
            };

            self.$emit('upload-started');

            this.upload_promise = axios.request(request_config).then(r => {

                self.$emit('upload-success', r);
                self.$emit('upload-ended', r);
                self.upload_state = 'done';
                self.upload_request = null;

            }).catch(r => {

                self.$emit('upload-error', {data: r});
                self.$emit('upload-ended', r);
                self.upload_state = 'none';
                self.upload_request = null;
                self.upload_error = r.response ? r.response.data : r.data;

            });

            return this.upload_promise;
        },

        cancel()
        {
            if(this.upload_source){

                this.$emit('upload-cancel', {});
                this.upload_source.cancel();
                
            }else{
                console.log('Cannot cancel', this.upload_source);
            }
        },
    }
}