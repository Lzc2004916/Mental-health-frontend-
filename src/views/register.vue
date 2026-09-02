<template>
  <div class="container">
    <div class="title">
    <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请输入您的账户信息</p>
    </div>
    </div>
    <div class="form-container">
      <el-form>
        
      </el-form>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>
