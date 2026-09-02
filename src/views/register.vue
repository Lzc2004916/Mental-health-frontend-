<template>
  <div class="container">
    <div class="title">
    <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请输入您的账户信息</p>
    </div>
    </div>
    <div class="form-container">
      <el-form
      :model="formdata"
      :rules="rules"
      ref="ruleFormRef"
      label-position="top"
      >
      <el-form-item label="用户名"  prop="username">
        <el-input v-model="formdata.username" placeholder="请输入用户名" size="large" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formdata.email" placeholder="请输入邮箱" size="large" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formdata.nickname" placeholder="请输入昵称" size="large" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formdata.phone" placeholder="请输入手机号" size="large" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formdata.password" placeholder="请输入密码" size="large" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="formdata.confirmPassword" placeholder="请输入确认密码" size="large" type="password" show-password />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formdata.gender" size="large">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button class="btn" type="primary" size="large" @click="submitForm(ruleFormRef)">创建用户</el-button>
      </el-form>
       <div class="footer">
            <p>已经有账户？<router-link to="/auth/login">去登录</router-link></p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue"
const formdata = reactive({
    username: '',
    email: '',
    nickname: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: ''
})
const ruleFormRef = ref()
const rules = reactive({
  username:[
    {required: true, message: '请输入用户名', trigger: 'blur'}
  ],
  email:[
    {required: true, message: '请输入邮箱', trigger: 'blur'}
  ],
  nickname:[
    {required: true, message: '请输入昵称', trigger: 'blur'}
  ],
  phone:[
    {required: true, message: '请输入手机号', trigger: 'blur'}
  ],
  password:[
    {required: true, message: '请输入密码', trigger: 'blur'}
  ],
  confirmPassword:[
    {required: true, message: '请输入确认密码', trigger: 'blur'}
  ],
})
const submitForm = (ruleFormRef)=>{
  if(!ruleFormRef) return
}
</script>

<style lang="scss" scoped>
.container {
    width: 384px;
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 24px;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
            }
            p {
                font-size: 14px;
                color: #999;
            }
        }
    }
    .form-container {
        margin: 0 auto;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            p {
                font-size: 14px;
                color: #999;
            }
        }
    }
}
</style>
