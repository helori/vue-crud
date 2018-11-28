<style>
</style>

<template>
    <div class="alert alert-danger" :class="classes" v-if="errors">
        <div v-if="errors.errors">
            <div v-for="(errors, field) in errors.errors">
                <div v-for="error in errors">
                    <i class="fal fa-arrow-circle-right"></i>
                    {{ error }}
                </div>
            </div>
        </div>
        <div v-else>
            {{ errors.message }}
        </div>
    </div>
</template>

<script>

	export default {

    	props: {
            errors: {
                required: true
            },
            classes: {
                type: String,
                required: false
            }
        }
    }
</script>
