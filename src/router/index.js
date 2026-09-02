import Backendlayout from "@/components/Backendlayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "@/components/AuthLayout.vue";
import FrontendLayou from "@/components/FrontendLayou.vue";
const backendRouter = [
  {
    path: "/back",
    redirect: "/back/dashboard",
    component: Backendlayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/Knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineRound",
        },
      },
      {
        path: "consultations",
        component: () => import("@/views/Consultations.vue"),
        meta: {
          title: "咨询记录",
          icon: "Message",
        },
      },
      {
        path: "emotional",
        component: () => import("@/views/Emotional.vue"),
        meta: {
          title: "情感日志",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: () => import("@/views/login.vue"),
        meta: {
          title: "登录",
        },
      },
      {
        path: "register",
        component: () => import("@/views/register.vue"),
        meta: {
          title: "注册",
        },
      },
    ],
  },
];
const frontendRouter = [
  {
    path: "/",
    component: FrontendLayou,
    children: [
      {
        path: "",
        component: () => import("@/views/Home.vue"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "consultation",
        component: () => import("@/views/Consultation.vue"),
        meta: {
          title: "AI咨询",
        },
      },
      {
        path: "emotion-diary",
        component: () => import("@/views/EmotionDiary.vue"),
        meta: {
          title: "情感日志",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/frontendKnowledge.vue"),
        meta: {
          title: "知识库",
        },
      }
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRouter, ...frontendRouter],
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //如果是后台用户
    if (userInfo.userType == 2) {
      if (to.path.startsWith("/back")) {
        next();
      } else {
        next("/back/dashboard");
      }
    } else if (userInfo.userType == 1) {
      TODO: 处理普通用户路由;
    }
  } else {
    if (to.path.startsWith("/back")) {
      //如果是后台路由，且没有token，重定向到登录页
      next("/auth/login");
    } else {
      //如果不是后台路由，且没有token，直接放行
      next();
    }
  }
});
export default router;
