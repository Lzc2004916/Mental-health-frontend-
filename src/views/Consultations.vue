<template>
  <div>
    <PageHead title="咨询记录" />
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="会话id" width="100">
        <template #default="scope">
          <el-avatar :size="48">
            {{ scope.row.userNickname }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column  label="情绪日志">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column label="消息数" prop="messageCount" width="100" />
      <el-table-column prop="lastMessageTime" label="时间" width="100" />
       <el-table-column  label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" text @click="viewSeesionDetail(scope.row)">详情</el-button>
                 </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px;"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="prev, pager, next"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref,onMounted, reactive } from "vue"
import PageHead from "@/components/PageHead.vue"
import { getConsultationPage } from "@/api/admin";
const tableData = ref([])
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0,
})
const handleSearch = async()=>{
  console.log(pagination);
    const res = await getConsultationPage(pagination)
    const { records,total } = res
        tableData.value = records
        pagination.total = total
}

const handleChange = (page)=>{
  pagination.currentPage = page
    handleSearch()
}
const viewSeesionDetail = (row) => {
    console.log(row)
}
onMounted(()=>{
    handleSearch()
})
</script>

<style lang="scss" scoped>
</style>
