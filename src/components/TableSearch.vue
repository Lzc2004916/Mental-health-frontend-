<template>
  <el-form ref="ruleFormRef" :model="formData">
    <el-row>
  <template v-for="item in props.formItem" :key="item.props">
    <el-col v-bind="{xs:24, sm:12, md:8, lg:6, xl:6, xxl:6}">
      <el-form-item :label="item.label" :prop="item.prop">
                <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
                   <template v-if="item.comp === 'select'">
                  <el-option label="全部" value=""></el-option>
                  <el-option 
                  v-for="value in item.options"
                   :key="value.value"
                    :label="value.label" 
                    :value="value.value">
                  </el-option>
                </template>
                </component>
            </el-form-item>
    </el-col>
    </template>
    </el-row>
   <el-row>
    <el-button type="primary" size="default" @click="handleSearch">查询</el-button>
    <el-button size="default" @click="handleReset(ruleFormRef)">重置</el-button>
   </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from "vue"
const props = defineProps({
    formItem: {
        type: Array,
        default: ()=>[]
    }
})
const emit = defineEmits(['search'])
const isComp = (comp)=>{
    return{
      input: 'el-input',
      select: 'el-select'
    }[comp]
}
const ruleFormRef = ref()
const formData = reactive({})

const handleSearch = ()=>{
  emit('search', formData)
}
const handleReset = (ruleFormRef)=>{
    if(!ruleFormRef)return
    if(ruleFormRef){
        ruleFormRef.resetFields()
        emit('search', formData)
    }
}
</script>

<style lang="scss" scoped>
</style>
