<style scoped>
nav{
    margin: 0 0 15px 0;
} 
.pagination{
    margin: 0;
}
</style>

<template>
    <nav aria-label="Page navigation" v-show="pagination.total > pagination.per_page">
        <ul class="pagination">
            <li v-if="pagination.current_page == 1" class="disabled">
                <span>
                    <span aria-hidden="true">&laquo;</span>
                </span>
            </li>
            <li v-else>
                <a @click="setPage(pagination.current_page - 1)" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li>
                <a @click="setPage(1)" v-if="pagination.current_page >= 4">1</a>
            </li>
            <li class="disabled" v-if="pagination.current_page >= 5">
                <span>...</span>
            </li>
            <li v-for="p in pagination.last_page" 
                :class="{'active': p === pagination.current_page}"
                v-if="p >= pagination.current_page - 2 && p <= pagination.current_page + 2">
                <a @click="setPage(p)" v-if="p !== pagination.current_page">{{ p }}</a>
                <span v-else>{{ p }}</span>
            </li>
            <li class="disabled" v-if="pagination.current_page <= pagination.last_page - 4">
                <span>...</span>
            </li>
            <li>
                <a @click="setPage(pagination.last_page)" v-if="pagination.current_page <= pagination.last_page - 3">{{ pagination.last_page }}</a>
            </li>
            <li v-if="pagination.current_page == pagination.last_page" class="disabled">
                <span>
                    <span aria-hidden="true">&raquo;</span>
                </span>
            </li>
            <li v-else>
                <a @click="setPage(pagination.current_page + 1)" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
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
