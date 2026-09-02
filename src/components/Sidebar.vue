<template>
  <el-aside :width="isCollapse ? '64px' : '264px'" class="sidebar-aside">
      <el-menu
        :collapse-transition="false"
        default-active="2"
        class="menu-style"
        :collapse="isCollapse"
      >
      <div class="brand">
        <el-image class="brand-image" :src="iconUrl" alt="logo /"></el-image>
        <transition name="brand-fade">
          <div class="info-card" v-show="!isCollapse">
            <h1 class="brand-title">心理健康AI助手</h1>
            <p class="brand-subtitle">管理后台</p>
          </div>
        </transition>
      </div>
        <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon"></component></el-icon>
          <span>{{item.meta.title}}</span>
        </el-menu-item>
      </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import {useRouter} from 'vue-router'
import { useAdminStore } from '@/stores/admin'
const router = useRouter()
const iconUrl = new URL("@/assets/images/机器人.png", import.meta.url).href
const isCollapse = computed(()=>useAdminStore().isCollapse)
const selectMenu = (key) => {
    const currentRoute = router.options.routes[0];
    router.push(`${currentRoute.path}/${key.index}`)
}
</script>

<style lang="scss" scoped>
.sidebar-aside {
  transition: width 0.3s ease;
  overflow: hidden;
}
.brand-fade-enter-active,
.brand-fade-leave-active {
  transition: opacity 0.25s ease;
}
.brand-fade-enter-from,
.brand-fade-leave-to {
  opacity: 0;
}
.menu-style{
    height: 100%;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: aliceblue;
  border-bottom: 1px solid #b3b3b375;
  height: var(--header-height, 64px);
  flex-shrink: 0;
  box-sizing: border-box;
}
.brand-image {
  width: 50px;
  height: 50px;
  margin-bottom: 12px;
}
.brand-title {
  font-size: 20px;
  font-weight: bold;
}
.brand-subtitle {
  font-size: 16px;
  font-weight: normal;
  color: #666;
}
.info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  white-space: nowrap; /* 过渡期间文字不换行、不变形 */
}
.brand-title {
  font-size: 24px;
  font-weight: bold;
}
.brand-subtitle {
  font-size: 16px;
  font-weight: normal;
}
</style>
