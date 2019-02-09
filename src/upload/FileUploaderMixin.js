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

        upload(url, files, data)
        {
            let self = this;
            let formData = new FormData();

            // Set data in the form.
            // Data can contain "collection", documentId", as well as additionnal values.
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    formData.append(key, data[key]);
                }
            }

            // Set the files in the request
            for(let i=0; i<files.length; ++i){
                formData.append('file-' + i, files[i], files[i].name);
            }

            formData.append('multiple', (files.length > 1));

            var config = {
                method: 'post',
                url: url,
                name: 'Uploading files',
                data: formData,
                //cancelToken: this.upload_source
                onUploadProgress: function(e) {
                    //console.log('upload progress', e);
                    if (e.lengthComputable) {
                        self.upload_progress = e.loaded;
                        self.upload_total = e.total;
                    }
                },
            };

            self.$emit('upload-started');

            this.upload_state = 'uploading';
            this.upload_progress = 0;
            this.upload_total = 0;
            this.upload_error = null;

            return this.upload_promise = axios.request(config).then(r => {

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
                throw r;

            });
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
