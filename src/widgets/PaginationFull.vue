<style scoped>

</style>

<template>

    <div class="pagination-full"
        :class="classes"
        v-if="pagination !== null && pagination.total > 0">
        <div class="row">

            <div class="col-sm">
                <div class="h3">
                    {{ (pagination.current_page - 1) * pagination.per_page + 1 }}
                    to {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} 
                    on {{ pagination.total }}
                </div>
            </div>

            <div class="col-sm">
                <pagination 
                    :pagination="pagination" 
                    @change="setPage($event)" 
                    classes="justify-content-end">
                </pagination>
            </div>

        </div>
    </div>

</template>

<script>

    import Pagination from './Pagination.vue'

    export default {
        props: {
            pagination: {
                required: true
            },
            classes: {
                type: String,
                required: false
            }
        },

        methods: {
            setPage(page){
                this.$emit('change', page);
            }
        }
    }
</script>
