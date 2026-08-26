<template>
  <div class="content-container">
    <PageHead>
      <template #buttons>
        <el-button type="primary" size="default" @click="">新增知识文章</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch"></TableSearch>
  </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue';
const formItem = [
    {
        comp: 'input',
        prop: 'title',
        label: '文章标题',
        placeholder: '请输入文章标题'
    },
    {
        comp: 'select',
        prop: 'category',
        label: '分类',
        placeholder: '请选择分类',
        options: [
            {
                label: '心理健康',
                value: '1'
            },
            {
                label: '情绪管理',
                value: '2'
            }
        ]
    }
]
const handleSearch = (formData)=>{
  console.log(formData);
  
}
</script>

<style lang="scss" scoped>
</style>
