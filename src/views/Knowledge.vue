<template>
  <div class="content-container">
    <PageHead>
      <template #buttons>
        <el-button type="primary" size="default" @click="handleEdit(null)">新增知识文章</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch">
    </TableSearch>
      <el-table :data="tableData" style="margin-top: 25px;">
        <el-table-column  label="文章标题" min-width="200">
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <el-icon>
                <document  />
              </el-icon>
                <span>{{scope.row.title}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  label="分类" min-width="200">
          <template #default="scope">
            <div style="display: flex;align-items: center;">
              <el-icon>
                <collection  />
              </el-icon>
              <span>{{categoryMap[scope.row.categoryId]}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="authorName"  label="作者" width="150" />
        <el-table-column prop="readCount"  label="阅读量" width="150" />
        <el-table-column prop="updatedAt"  label="发布时间" width="150" />
        <el-table-column  label="操作" width="240" fixed="right">
          <template #default="scope">
           <el-button type="primary" text @click="handleEdit(scope.row)">编辑</el-button>
           <el-button @click="handlePublish(scope.row)" v-if="scope.row.status == 0 || scope.row.status == 2" type="success" text >发布</el-button>
           <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status == 1" type="warning" text >下线</el-button>
           <el-button text @click="handleDelete(scope.row)" type="danger">删除</el-button>
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
       <ArticleDialog v-model:modelValue="dialogVisible" :article = "currentArticle" :categories="categories" @success="handleSuccess" />
  </div>
</template>

<script setup>
import { onMounted,reactive,ref } from "vue"
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue';
import { categoryTree,articlePage, getArticleDetail,changeArtocleStatus,deleteArticle } from "@/api/admin";
import ArticleDialog from "@/components/ArticleDialog.vue";
import { ElMessageBox,ElMessage } from "element-plus";
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
    pagination.total = total
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
const handleSuccess = ()=>{
    dialogVisible.value = false
    handleSearch()
}
const currentArticle = ref(null)
const handleEdit = async (row)=>{
  if (!row?.id) {
  currentArticle.value = null
  dialogVisible.value = true
  }else{
  const data = await getArticleDetail(row.id)
  currentArticle.value = data
  dialogVisible.value = true
  }
}
const handlePublish = (row)=>{
  ElMessageBox.confirm(`确认发布文章${row.title}吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 发布文章
    changeArtocleStatus(row.id,{status:1}).then(res=>{
        ElMessage.success('发布成功')
        handleSearch()
    })
  })
}
const handleUnpublish = (row)=>{
  ElMessageBox.confirm(`确认下线文章${row.title}吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 下线文章
    changeArtocleStatus(row.id,{status:2}).then(res=>{
        ElMessage.info('下线成功')
        handleSearch()
    })
  })
}
const handleDelete = (row)=>{
  ElMessageBox.confirm(`确认删除文章${row.title}吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 删除文章
    deleteArticle(row.id).then(res=>{
        ElMessage.success('删除成功')
        handleSearch()
    })
  })
}
</script>

<style lang="scss" scoped>
</style>
