<template>
    <nav aria-label="Page navigation" 
        v-show="pagination.total > pagination.per_page" v-if="pagination !== null">
        <ul class="pagination" :class="classes">
            <li class="page-item disabled" v-if="pagination.current_page == 1">
                <a class="page-link" href="#">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" v-else>
                <a class="page-link" href="#" @click="$event.stopPropagation(); setPage(pagination.current_page - 1)" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" @click="$event.stopPropagation(); setPage(1)" v-if="pagination.current_page >= 4">1</a>
            </li>
            <li class="page-item disabled" v-if="pagination.current_page >= 5">
                <a class="page-link" href="#" @click="$event.stopPropagation();">...</a>
            </li>
            <li class="page-item" v-for="p in pagination.last_page" 
                :class="{'active': p === pagination.current_page}"
                v-if="p >= pagination.current_page - 2 && p <= pagination.current_page + 2">
                <a class="page-link" href="#" @click="$event.stopPropagation(); setPage(p)" v-if="p !== pagination.current_page">{{ p }}</a>
                <a class="page-link" href="#" v-else>{{ p }}</a>
            </li>
            <li class="page-item disabled" v-if="pagination.current_page <= pagination.last_page - 4">
                <a class="page-link" href="#">...</a>
            </li>
            <li class="page-item">
                <a class="page-link" href="#" @click="$event.stopPropagation(); setPage(pagination.last_page)" v-if="pagination.current_page <= pagination.last_page - 3">{{ pagination.last_page }}</a>
            </li>
            <li class="page-item disabled" v-if="pagination.current_page == pagination.last_page">
                <a class="page-link" href="#">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
            <li class="page-item" v-else>
                <a class="page-link" href="#" @click="$event.stopPropagation(); setPage(pagination.current_page + 1)" aria-label="Next">
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
                required: true
            },
            classes: {
                type: String,
                required: false,
                default: ''
            }
        },

        methods: {
            setPage(page){
                this.$emit('change', page);
            }
        }
    }
</script>
