<template>
  <el-form>
    <template v-for="item in formItem" :key="item.props">
            <el-form-item :label="item.label" prop="item.prop">
                
            </el-form-item>
    </template>
  </el-form>
</template>

<script setup>
const props = defineProps({
    formItem: {
        type: Array,
        default: ()=>[]
    }
})
</script>

<style lang="scss" scoped>
</style>
