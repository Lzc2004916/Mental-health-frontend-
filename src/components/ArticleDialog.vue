<template>
  <el-dialog
    title="文章详情"
    v-model="dialogVisible"
    width="50%"
  >
  <el-form ref="ruleFormRef" :model="formData" :rules="rules">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入文章标题" :maxlength="200" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="所属分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择分类">
        <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="文章摘要" prop="summary">
      <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" :maxlength="1000" show-word-limit :rows="4"></el-input>
    </el-form-item>
     <el-form-item label="标签(非必填)" prop="tags">
      <el-select v-model="formData.tagArray" placeholder="请输入文章标签(可选)" multiple filterable allow-create style="width: 100%;">
        <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" ></el-option>
      </el-select>
    </el-form-item>
     <el-form-item label="封面图片">
     <div class="cover-upload">
        <el-upload
        action=""
        class="#"
        :before-upload="beforeUpload"
        :http-request="handleUploadRequest"
        :show-file-list="false"
        accept="image/*"
        >
        <div v-if="!imgUrl" class="cover-placeholder">
            <p>点击上传封面</p>
        </div>
        <img v-else :src="imgUrl" class="cover-image" alt="封面图片">
        </el-upload>
        <div v-if="imgUrl" class="cover-remo" @click="removeCover">
            <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
        </div>
     </div>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <RichTextEditor 
      v-model="formData.content"
      placeholder = "请输入文章内容，支持富文本格式"
      maxCharCount="5000"
      @Change="handelContentChange"
      @created="handleEditorCreated"
      min-height="400px"
      ></RichTextEditor>
    </el-form-item>
  </el-form>
  </el-dialog>
</template>

<script setup>
import { computed,reactive,ref } from "vue"
import { ElMessage } from 'element-plus'
import { uploadFile } from "@/api/admin";
import {fileBaseUrl} from "@/config/index.js"
import RichTextEditor from "@/components/RichTextEditor.vue"
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: ()=>[]
    }
})
const emit = defineEmits(['update:modelValue'])
const dialogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": "",
    "id": ""
})
const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择分类', trigger: 'change' }
    ],
    summary: [
        { max: 1000, message: '文章摘要最多1000个字符', trigger: 'blur' }
    ],
})
const commonTags = [
'情绪管理', '焦虑', '抑郁', '压力', '睡眠',
'冥想', '正念', '放松', '心理健康', '自我成长',
'人际关系', '工作压力', '学习方法', '生活技巧'
]
const imgUrl = ref('')
const beforeUpload = (file)=>{
    if(!file.type.startsWith('image/')){
        ElMessage.error('请上传图片文件')
        return false
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if(!isLt5M){
        ElMessage.error('图片大小不能超过5MB')
        return false
    }
    return true
}
const handleUploadRequest = async({file})=>{
    const businessId = crypto.randomUUID()
    const fileRes = await uploadFile(file,{
        businessId: businessId,
    })
    imgUrl.value = `${fileBaseUrl}${fileRes.filePath}`
    formData.coverImage = fileRes.filePath
}
const handleRemove = ()=>{
    imgUrl.value = ''
    formData.coverImage = ''
}
const handelContentChange = ()=>{
    
}
const handleEditorCreated = (editor)=>{
}
</script>

<style lang="scss" scoped>
.cover-placeholder{
    width: 200px;
height: 120px;
display:flex;
flex-direction: column;
align-items: center;
justify-content: center;
color:#8b949e;
background:#f6f8fa;
}
.cover-image{
   width: 200px;
height: 120px;
display: block;
}
</style>
