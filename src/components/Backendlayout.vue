<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar></Sidebar>
      <el-container direction="vertical">
        <Navbar></Navbar>
        <el-main>
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>
<style lang="scss" scoped>
.backend-layout{
    --header-height: 64px; /* 只改这一处，Navbar 与 Sidebar.brand 同步对齐 */
    height: 100vh;
    height: 100dvh; /* 兼容移动端 */
    .el-header{
        height: var(--header-height) !important;
    }
    .main-container{
        height: 100%;
        :deep(.el-main){
            overflow-y: auto;
            padding: 16px;
            background: #f5f7fa;
        }
        .content-container{
            padding: 20px;
            background-color: #ffffff;
            min-height: calc(100% - var(--header-height));
        }
    }
}
</style>
