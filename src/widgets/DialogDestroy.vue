<style scoped>

</style>

<template>

    <div>

        <div class="modal fade modal-destroy"tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    
                    <div class="modal-header">
                        <button type="button " class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">
                            {{ title }}
                        </h4>
                    </div>
                    
                    <div class="modal-body">

                        <p v-html="message"></p>

                        <div class="alert alert-danger" v-if="errors">
                            {{ errors.message }}
                        </div>

                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>

                        <button type="button" class="btn btn-danger" 
                            @click="destroy"
                            :disabled="status === 'loading' || status === 'success'">
                            <i class="fa fa-spinner fa-spin" v-if="status === 'loading'"></i> Yes, delete !
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>

<script>

    export default {

        data(){
            return{
                dialog: null
            }
        },

        props: {
            title: {
                type: String,
                default: '',
                required: true
            },
            message: {
                type: String,
                default: '',
                required: true
            },
            status: {
                // Can be null, 'loading', success', 'error'
                required: true
            },
            errors: {
                required: false
            }
        },

        mounted(){
            this.dialog = $(this.$el).find('.modal-destroy');
        },

        methods: {

            destroy() {
                
                this.$emit('destroy');

            },

            open(){
                this.dialog.modal('show');
            },

            close(){
                this.dialog.modal('hide');
            }
        }
    }
</script>
