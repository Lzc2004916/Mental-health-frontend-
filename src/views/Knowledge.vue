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
import { onMounted,reactive,ref } from "vue"
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue';
import { categoryTree,articlePage } from "@/api/admin";
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
        placeholder: '请选择分类'
    },
    {
        comp: 'select',
        prop: 'status',
        label: '状态',
        placeholder: '请选择状态',
        options: [
            {
                label: '草稿',
                value: '0'
            },
            {
                label: '已发布',
                value: '1'
            },
            {
                label: '已下线',
                value: '2'
            }
        ]
    }
]
const handleSearch = (formData)=>{
  console.log(formData);
  
}
const categoryMap = reactive({})
const categories = ref([])
onMounted(async()=>{
    const data = await categoryTree()
   categories.value = data.map(item =>{
      categoryMap[item.id] = item.categoryName
      return {
        label: item.categoryName,
        value: item.id
      }
    })
    formItem[1].options = categories.value
})
</script>

<style lang="scss" scoped>
</style>
