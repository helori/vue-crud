export default {
    data(){
        return {
            readyToLoad: true,
            uniqId: Math.random().toString(36).substring(7) + '_',
            item: {},
            errors: this.errorsOrg
        };
    },

    props: {
        itemOrg: {
            required: true
        },
        errorsOrg: {
            required: true
        }
    },

    mounted(){
        if(this.readyToLoad){
            this.setItem(this.itemOrg);
        }
    },

    watch: {
        itemOrg: {
            handler: function (item) {
                if(this.readyToLoad){
                    this.setItem(item);
                }
            },
            deep: true
        },
        errorsOrg: {
            handler: function () {
                this.errors = _.clone(this.errorsOrg);
                console.log(this.errors.errors, this.getError('title'));
            },
            deep: true
        }
    },

    methods: {
        setItem(item){
            //console.log('setItem', this.itemOrg);
            this.item = _.clone(this.itemOrg);
            this.afterRead();
        },

        updated() {
            this.$emit('change', this.item);
            this.afterUpdate();
        },

        hasErrors(){
            return ! _.isEmpty(this.errors);
        },

        getError(field){
            if(this.errors && this.errors.errors && this.errors.errors[field]){
                return this.errors.errors[field][0];
            }
            return null;
        },

        getGlobalError(){
            if(this.errors && !this.errors.errors){
                return this.errors.message;
            }
            return null;
        },

        /*refreshFromProps(){
            this.item = _.clone(this.itemOrg);
            this.errors = _.clone(this.errorsOrg);
        },*/

        // To be overloaded
        afterRead(){},
        afterUpdate(){}
    }
};
