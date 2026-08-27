<template>
  <div class="container">
    <div class="title">
        <div class="back-home">
        <el-icon>
            <Back />
        </el-icon>
            <span>返回首页</span>
    </div>
    <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
    </div>
    </div>
    <div class="form-container">
        <el-form
          :model="formData"
          :rules="rules"
          ref="ruleFormRef"
          label-position="top"
        >
        <el-form-item label="用户名或邮箱" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" size="large"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码" size="large" type="password" show-password></el-input>
        </el-form-item>
        <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">登录</el-button>
        
        </el-form>
        <div class="footer">
            <p>还没有账户？<router-link to="/auth/register">去注册</router-link></p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import { login } from "@/api/admin";
import { useRouter } from 'vue-router'
const router = useRouter()
const ruleFormRef = ref()
const formData = reactive({
    username: '',
    password: ''
})
const rules = reactive({
    username:[
        {required: true, message: '请输入用户名', trigger: 'blur'}
    ],
    password:[
        {required: true, message: '请输入密码', trigger: 'blur'}
    ]
})
const submitForm = async(formEl)=>{
    if(!formEl) return
    await formEl.validate(async (valid,fields)=>{
        if(valid){
           const data = await login(formData)
           if(!data.token){
                return console.error('登录失败')
           }
           localStorage.setItem('token',data.token)
           localStorage.setItem('userInfo',JSON.stringify(data.userInfo))
           //根据用户角色决定跳转路径
           if(data.userInfo.userType === 2){
                router.push('/back/dashboard')
           }else{
           }
        }
    })
}
</script>

<style lang="scss" scoped>
.container {
    width: 384px;
    .title{
        .back-home{
            margin-bottom: 50px;
        }
        .title-text{
            text-align: center;
            h2{
                font-size: 24px;
            font-weight: bold;
            color: #333;
            }
            p{
                font-size: 14px;
                color: #999;
            }
        }
    }
    .form-container{
        margin: 0 auto;
        .btn{
            margin-top: 40px;
            width: 100%;
        }
        .footer{
            text-align: center;
            margin-top: 20px;
            p{
                font-size: 14px;
                color: #999;
            }
        }
    }
}
</style>
