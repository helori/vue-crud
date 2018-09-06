<style scoped>

</style>

<template>

    <div class="pagination-full">
        <div class="row">

            <div class="col-sm">
                <div class="h3">
                    <span v-if="pagination && pagination.total > 0">
                        {{ (pagination.current_page - 1) * pagination.per_page + 1 }}
                        à {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} 
                        sur {{ pagination.total }}
                    </span>
                    <span v-else-if="!pagination || pagination.total === 0">
                        Aucun résultat
                    </span>
                    <span v-else>
                        Chargement...
                    </span>
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
                type: Object,
                required: true
            }
        },

        methods: {
            setPage(page){
                this.$emit('change', page);
            }
        }
    }
</script>
