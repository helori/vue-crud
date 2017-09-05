<style scoped>

</style>

<template>

    <div>

        <div class="modal fade"tabindex="-1" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    
                    <div class="modal-header">
                        <button type="button " class="close" data-dismiss="modal" aria-hidden="true" tabindex="-1">&times;</button>
                        <h4 class="modal-title">
                            {{ title }}
                        </h4>
                    </div>
                    
                    <div class="modal-body">

                        <slot name="body"></slot>

                        <div class="alert alert-danger" v-if="errors">
                            {{ errors }}
                        </div>
                        
                    </div>

                    <!-- Modal Actions -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal" tabindex="0">Cancel</button>

                        <button type="button" class="btn btn-danger" tabindex="1"
                            @click="save"
                            :disabled="status === 'loading' || status === 'success'">
                            <i class="fa fa-spinner fa-spin" v-if="status === 'loading'"></i> Save 
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
            status: {
                // Can be null, 'loading', success', 'error'
                required: true
            },
            errors: {
                required: false,
                default: null
            }
        },

        mounted(){
            this.dialog = $(this.$el).find('> .modal');
            this.dialog.on('shown.bs.modal', function (e) {
                $(this).find('input').first().focus();
            });
        },

        methods: {

            save() {
                
                this.$emit('save');

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
