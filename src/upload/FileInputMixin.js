export default {

    data() {
        return {
            id: Math.floor(Math.random()*(9999-1000+1)+1000),
        };
    },
    
    props: {
        multiple: {
            type: Boolean,
            required: false,
            default: false
        },
        inputText: {
            type: String,
            required: false,
            default: 'Browse / Drop files'
        },
        showIcon: {
            type: Boolean,
            required: false,
            default: false
        },
        classes: {
            type: String,
            required: false,
            default: 'btn btn-primary'
        }
    },
    
    mounted() {

        // -------------------------------------------------------
        //  Init browse button
        // -------------------------------------------------------
        var self = this;

        $(this.$el).on('change', '.file-input', function(e){
            
            self.$emit('files-selected', {
                files: e.target.files, 
                multiple: self.multiple
            });

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
            
            self.$emit('files-selected', {
                files: e.originalEvent.dataTransfer.files, 
                multiple: self.multiple
            });
        });
    },
}
