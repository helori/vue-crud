<style scoped>
.message{
    margin: 0 0 15px 0;
}
.alert{
    margin: 15px 0 0 0;
}
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

                        <p class="message" v-html="message" v-if="message"></p>

                        <slot name="body"></slot>

                        <input-wrapper-horizontal 
                            v-if="checkerTitle"
                            name="destroy-checker"
                            :label="checkerTitle">
                            <div slot="input">
                                <input-text
                                    v-model="checker"
                                    name="destroy-checker">
                                </input-text>
                            </div>
                        </input-wrapper-horizontal>

                        <div class="alert alert-danger text-center" v-if="errors">
                            {{ errors.message }}
                        </div>

                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{ cancelText }} </button>

                        <button type="button" class="btn btn-danger" 
                            @click="destroy"
                            :disabled="disabled || status === 'pending' || status === 'success'">
                            <i class="fa fa-spinner fa-spin" v-if="status === 'pending'"></i> {{ destroyText }} 
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
                checker: null,
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
                required: false
            },
            promise: {
                required: true
            },
            errors: {
                required: false
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false
            },
            checkerTitle: {
                type: String,
                required: false,
                default: null
            },
            destroyText: {
                type: String,
                required: false,
                default: 'Delete'
            },
            cancelText: {
                type: String,
                required: false,
                default: 'Cancel'
            },
        },

        mounted(){
            var self = this;
            this.dialog = $(this.$el).find('> .modal-destroy');
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

            destroy() {
                this.$emit('destroy');
            },

            open(){
                this.status = null;
                this.dialog.modal('show');
            },

            close(){
                this.dialog.modal('hide');
            }
        }
    }
</script>
