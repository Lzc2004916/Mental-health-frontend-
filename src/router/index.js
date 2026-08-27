import Backendlayout from '@/components/Backendlayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/components/AuthLayout.vue'
const backendRouter = [
    {
        path:"/back",
        component:Backendlayout,
        children: [
            {
                path:"dashboard",
                component:()=>import('@/views/Dashboard.vue'),
                meta:{
                    title:'数据分析',
                    icon:'PieChart'
                }
            },
            {
                path: 'knowledge',
                component:()=>import('@/views/Knowledge.vue'),
                meta:{
                    title:'知识文章',
                    icon:'ChatLineRound'
                }
            },
            {
                path: 'consultations',
                component:()=>import('@/views/Consultations.vue'),
                meta:{
                    title:'咨询记录',
                    icon:'Message'
                }
            },
            {
                path: 'emotional',
                component:()=>import('@/views/Emotional.vue'),
                meta:{
                    title:'情感日志',
                    icon:'User'
                }
            }
        ]
    },
    {
        path: "/auth",
        component:AuthLayout,
        children: [
            {
                path: 'login',
                component:()=>import('@/views/login.vue'),
                meta:{
                    title:'登录',
                }
            },
            {
                path: 'register',
                component:()=>import('@/views/register.vue'),
                meta:{
                    title:'注册',
                }
            }
        ],
   
    }
]
const router = createRouter({
    history:createWebHistory(),
    routes:backendRouter
})

export default router;