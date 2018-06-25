<style scoped>

</style>

<template>

    <div>

        <div class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document" :class="{
                'modal-lg': size === 'lg',
                'modal-sm': size === 'sm',
            }">
                <div class="modal-content">
                    
                    <div class="modal-header">
                        <h5 class="modal-title">{{ title }}</h5>
                        <button type="button " class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
                    <div class="modal-body">

                        <div v-show="finished" class="text-success text-center py-5">
                            <i class="fal fa-check-circle fa-5x"></i>
                            <div class="font-weight-bold mt-4 h3">C'est bien enregistré !</div>
                        </div>

                        <div v-show="!finished">
                            
                            <slot name="body"></slot>

                            <div class="alert alert-danger text-center mb-0 mt-3" v-if="errors">
                                {{ errors }}
                            </div>
                        </div>
                        
                    </div>

                    <!-- Modal Actions -->
                    <div class="modal-footer" v-if="showSave || showCancel">
                        <button type="button" 
                            class="btn btn-secondary" 
                            data-dismiss="modal" 
                            @click="cancel" 
                            v-if="showCancel">
                            {{ finished ? closeText : cancelText }} 
                        </button>

                        <button type="button" 
                            class="btn btn-primary" 
                            tabindex="1"
                            v-if="showSave && !finished"
                            @click="save"
                            :disabled="disabled || status === 'pending'">
                            <span v-show="status === 'pending'">
                                <i class="fa fa-spinner fa-spin"></i>
                            </span>
                            {{ saveText }} 
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
                finished: false,

                closeCallback: null,
                openCallback: null,
            }
        },

        props: {
            title: {
                type: String,
                default: '',
                required: true
            },
            promise: {
                required: false
            },
            errors: {
                required: false,
                default: null
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false
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
            closeText: {
                type: String,
                required: false,
                default: 'Close'
            },
            size: { // 'lg', 'sm'
                type: String,
                required: false,
                default: ''
            },
            showSave: {
                type: Boolean,
                required: false,
                default: true
            },
            showCancel: {
                type: Boolean,
                required: false,
                default: true
            }
        },

        mounted(){
            var self = this;
            this.dialog = $(this.$el).find('> .modal');
            this.dialog.on('shown.bs.modal', function (e) {
                $(this).find('input, select, .btn').first().focus();
                self.$emit('opened');
                if(self.openCallback){
                    self.openCallback();
                }
            });
            this.dialog.on('hidden.bs.modal', function (e) {
                self.$emit('closed');
                if(self.closeCallback){
                    self.closeCallback();
                }
            });
        },

        watch: {
            promise: {
                handler(promise){
                    if(promise){

                        this.status = 'pending';

                        // The catch() handler will be called only if there is no other catch() handler called before it.
                        // (apromise may have multiple then() but only one catch())
                        // To make sure it is called in this case, the first catch() handler should re-throw an error.
                        // Otherwise, we shouldn't rely the status' value being "success" or "error"

                        promise.then(r => {
                            this.status = 'success';
                            this.finished = true;
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
                if(callback){
                    this.openCallback = callback;
                }
                this.finished = false;
                this.status = null;
                this.dialog.modal('show');
            },

            close(callback){
                if(callback){
                    this.closeCallback = callback;
                }
                this.dialog.modal('hide');
            }
        }
    }
</script>
