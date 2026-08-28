<template>
  <div class="content-container">
    <PageHead>
      <template #buttons>
        <el-button type="primary" size="default" @click="dialogVisible = true">新增知识文章</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch">
    </TableSearch>
      <el-table :data="tableData" style="margin-top: 25px;">
        <el-table-column  label="文章标题" min-width="200">
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <el-icon>
                <timer  />
                <span>{{scope.row.title}}</span>
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="分类" min-width="200">
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <el-icon>
                <folder  />
                <span>{{categoryMap[scope.row.categoryId]}}</span>
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="authorName"  label="作者" width="150" />
        <el-table-column prop="readCount"  label="阅读量" width="150" />
        <el-table-column prop="publishedAt"  label="发布时间" width="150" />
        <el-table-column  label="操作" width="240" fixed="right">
          <template #default="scope">
           <el-button type="primary" text @click="">编辑</el-button>
           <el-button v-if="scope.row.status == 0 || scope.row.status == 2" type="success" text @click="">发布</el-button>
           <el-button v-if="scope.row.status == 1" type="warning" text @click="">下线</el-button>
           <el-button text @click="" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
       style="margin-top: 25px;"
       :page-size="pagination.size"
        layout="prev, pager, next"
         :total="pagination.total" 
         @change="handleChange"
         />
       <ArticleDialog v-model:modelValue="dialogVisible" :categories="categories" />
  </div>
</template>

<script setup>
import { onMounted,reactive,ref } from "vue"
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue';
import { categoryTree,articlePage } from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";
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
//分页参数
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
})
const tableData = ref([])
const dialogVisible = ref(false)
const handleSearch = async(formData)=>{
  const params = {
    ...pagination,
    ...formData
  }
    const {records,total} = await articlePage(params)
    tableData.value = records
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
    //获取列表
    handleSearch()
})
const handleChange = (val)=>{
    pagination.currentPage = val
    handleSearch()
}
</script>

<style lang="scss" scoped>
</style>
