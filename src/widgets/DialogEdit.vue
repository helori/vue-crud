<style scoped>
.modal-dialog{
    max-width: 95%;
}
</style>

<template>

    <div>

        <div class="modal fade"tabindex="-1" role="dialog">
            <div class="modal-dialog" :style="'width: ' + width + 'px'">
                <div class="modal-content">
                    
                    <div class="modal-header">
                        <button type="button " class="close" data-dismiss="modal" aria-hidden="true" tabindex="-1">&times;</button>
                        <h4 class="modal-title">
                            {{ title }}
                        </h4>
                    </div>
                    
                    <div class="modal-body">

                        <slot name="body"></slot>

                        <div class="alert alert-danger text-center" v-if="errors">
                            {{ errors }}
                        </div>
                        
                    </div>

                    <!-- Modal Actions -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal" tabindex="0" @click="cancel">
                            {{ cancelText }}
                        </button>

                        <button type="button" class="btn btn-primary" tabindex="1"
                            @click="save"
                            :disabled="status === 'pending' || status === 'success'">
                            <i class="fa fa-spinner fa-spin" v-if="status === 'pending'"></i> {{ saveText }} 
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
                dialog: null,
                status: null,
            }
        },

        props: {
            title: {
                type: String,
                default: '',
                required: true
            },
            promise: {
                required: true
            },
            errors: {
                required: false,
                default: null
            },
            saveText: {
                type: String,
                required: false,
                default: 'Save'
            },
            cancelText: {
                type: String,
                required: false,
                default: 'Cancel'
            },
            width: {
                type: Number,
                required: false,
                default: 600
            }
        },

        mounted(){
            var self = this;
            this.dialog = $(this.$el).find('> .modal');
            this.dialog.on('shown.bs.modal', function (e) {
                $(this).find('input').first().focus();
                self.$emit('opened');
            });
            this.dialog.on('hidden.bs.modal', function (e) {
                self.$emit('closed');
            });
        },

        watch: {
            promise: {
                handler(promise){
                    if(promise){

                        this.status = 'pending';

                        promise.then(r => {
                            this.status = 'success';
                        }).catch(r => {
                            this.status = 'error';
                        });
                    }
                }
            }
        },

        methods: {

            save() {
                this.$emit('save');
            },

            cancel() {
                this.$emit('cancel');
            },

            open(callback){
                this.status = null;
                this.dialog.modal('show');
                if(callback){
                    callback();
                }
            },

            close(callback){
                this.dialog.modal('hide');
                if(callback){
                    callback();
                }
            }
        }
    }
</script>
