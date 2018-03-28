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

                        <slot name="body"></slot>

                    </div>

                    <!-- Modal Actions -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closed">
                            {{ closeText }}
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
            closeText: {
                type: String,
                required: false,
                default: 'Close'
            },
            size: { // 'lg', 'sm'
                type: String,
                required: false,
                default: ''
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

        methods: {

            closed() {
                this.$emit('closed');
            },

            open(callback){
                if(callback){
                    this.openCallback = callback;
                }
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
