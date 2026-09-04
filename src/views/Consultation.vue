<template>
  <div class="consultation">
    <!-- 左侧栏：AI助手信息 / 情绪花园 / 会话列表 -->
    <aside class="sidebar">
      <!-- 1. AI助手信息 -->
      <section class="card ai-info">
        <div class="ai-avatar">
          <img :src="robotImg" alt="AI助手" />
        </div>
        <div class="ai-meta">
          <h3>宁渡AI助手</h3>
          <p class="online"><span class="dot"></span>在线服务中</p>
        </div>
      </section>

      <!-- 2. 情绪花园（内容全保留） -->
      <section class="card emotion-garden">
        <h4 class="card-title">情绪花园</h4>

        <div class="emotion-main">
          <div class="emotion-circle" :class="{ negative: currentEmotion.isNegative }">
            <span class="emotion-name">{{ currentEmotion.primaryEmotion }}</span>
            <span class="emotion-score">{{ currentEmotion.emotionScore }}</span>
          </div>
          <div class="emotion-status">
            <p class="status-line">
              <span class="status-label">今天感觉</span>
              <span class="status-emotion">{{ currentEmotion.isNegative ? '需要关注' : '很不错' }}</span>
            </p>
            <p class="intensity-line">
              <span class="intensity-dots">
                <span v-for="dot in 3" :key="dot" class="dot"
                  :class="{ active: getIntensityClass(currentEmotion.emotionScore) >= dot }"></span>
              </span>
              <span class="intensity-text">{{ getEiskText(currentEmotion.riskLevel) }}</span>
            </p>
          </div>
        </div>

        <!-- 小建议 -->
        <div class="suggestion" v-if="currentEmotion.suggestion">
          <span class="suggestion-icon">❤</span>
          <div class="suggestion-body">
            <span class="suggestion-label">给你的小建议</span>
            <p class="suggestion-text">{{ currentEmotion.suggestion }}</p>
          </div>
        </div>

        <!-- 治愈小行动 -->
        <div class="actions" v-if="currentEmotion.improvementSuggestions.length > 0">
          <h5 class="block-title">治愈小行动</h5>
          <ul class="action-list">
            <li v-for="action in currentEmotion.improvementSuggestions" :key="action">
              <span class="action-icon">👉</span>
              <span class="action-text">{{ action }}</span>
            </li>
          </ul>
        </div>

        <!-- 风险提示 -->
        <div class="risk" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
          <h5 class="block-title">⚠️ 风险提示</h5>
          <p class="risk-text">{{ currentEmotion.riskDescription }}</p>
        </div>
      </section>

      <!-- 3. 会话列表 -->
      <section class="card session-history">
        <h4 class="card-title">会话列表</h4>
        <ul class="session-list">
          <li v-for="session in sessionList" :key="session.id" class="session-item"
            @click="handleSessionClick(session)">
            <div class="session-row">
              <span class="session-title">{{ session.sessionTitle }}</span>
              <span class="session-time">{{ session.startedAt }}</span>
            </div>
            <div class="session-preview">{{ session.lastMessageContent }}</div>
            <button class="session-delete" @click.stop="handleDeleteSession(session.id)" title="删除会话">×</button>
          </li>
        </ul>
      </section>
    </aside>

    <!-- 右侧聊天窗口 -->
    <main class="chat">
      <header class="chat-header">
        <div class="chat-info">
          <h2>宁渡AI助手</h2>
          <p>您贴心的AI心理助手</p>
        </div>
        <button class="new-session" @click="createNewFrontendSession">＋ 新会话</button>
      </header>

      <div class="chat-messages">
        <!-- 欢迎消息 -->
        <div class="msg ai" v-if="messages.length === 0">
          <div class="avatar"><img :src="robotImg" alt="AI" /></div>
          <div class="bubble">
            <p>欢迎来到宁渡AI助手，我是您的心理助手，我可以帮助您管理您的情绪和压力。</p>
            <span class="time">刚刚</span>
          </div>
        </div>

        <!-- 消息流 -->
        <div v-else class="msg" v-for="item in messages" :key="item.id"
          :class="item.senderType === 1 ? 'user' : 'ai'">
          <div class="avatar">
            <img :src="item.senderType === 1 ? userImg : robotImg" alt="头像" />
          </div>
          <div class="bubble">
            <!-- AI 正在思考 -->
            <div class="typing" v-if="item.senderType === 2 && isAiTyping && !item.content">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
            <!-- AI 错误提示 -->
            <div class="error" v-else-if="item.isError">{{ item.content }}</div>
            <!-- AI 正常回复 -->
            <MarkdownRenderer v-else-if="item.senderType === 2 && !item.isError" :content="item.content"
              :isAiMessage="true" />
            <!-- 用户输入 -->
            <p v-else-if="item.content" v-html="formatMessageContent(item.content)"></p>
            <span class="time">{{ item.senderType === 2 && isAiTyping ? '正在思考中...' : item.createdAt }}</span>
          </div>
        </div>
      </div>

      <footer class="chat-input">
        <div class="input-box">
          <textarea v-model="userMessage" :disabled="isAiTyping" placeholder="请输入您的问题"
            rows="3" @keydown="handleKeyDown"></textarea>
          <div class="input-meta">
            <span>Enter 发送 · Shift+Enter 换行</span>
            <span>{{ userMessage.length }}/500</span>
          </div>
        </div>
        <button class="send-btn" @click="sendMessage"
          :disabled="!userMessage.trim() || !userMessage.length > 500 || isAiTyping">→</button>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { startSession, getSessionList, deleteSession, getSessionDetail,getSeeionEmotion } from "@/api/frontend.js"
import { ElMessage, ElMessageBox } from "element-plus"
import MarkdownRenderer from "@/components/MarkdownRenderer.vue"
import { fetchEventSource } from '@microsoft/fetch-event-source';

const robotImg = new URL('@/assets/images/robot-fill.png', import.meta.url).href
const likeImg = new URL('@/assets/images/like.png', import.meta.url).href
const userImg = new URL('@/assets/images/users.png', import.meta.url).href

const userMessage = ref("")
const isAiTyping = ref(false)
const currentSession = ref(null)
const sessionList = ref([])
const messages = ref([])

// 新建会话
const createNewFrontendSession = () => {
  const newSession = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新会话'
  }
  currentSession.value = newSession
  messages.value = []
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const sendMessage = () => {
  if (!userMessage.value.trim()) return
  if (isAiTyping.value) {
    ElMessage.error('AI助手正在输入中，请稍后。')
    return
  }
  const content = userMessage.value.trim()
  userMessage.value = ''
  messages.value.push({
    id: Date.now(),
    senderType: 1,
    content,
    createdAt: new Date().toLocaleString()
  })
  if (currentSession.value.status === 'TEMP') {
    startNewSession(content)
  } else {
    startAIResponse(currentSession.value.sessionId, content)
  }
}

const startNewSession = async (content) => {
  const sessionParams = { initialMessage: content }
  sessionParams.sessionTitle = currentSession.value.status === 'TEMP'
    ? `宁渡AI助手 - ${new Date().toLocaleString()}`
    : currentSession.value.sessionTitle

  const res = await startSession(sessionParams)
  const sessionData = {
    sessionId: res.sessionId,
    status: res.status,
    sessionTitle: sessionParams.sessionTitle
  }
  if (currentSession.value && currentSession.value.status === 'TEMP') {
    Object.assign(currentSession.value, sessionData)
  } else {
    currentSession.value = sessionData
  }
  getSessionPage()
  startAIResponse(sessionData.sessionId, content)
}

const ctrl = new AbortController()
const startAIResponse = async (sessionId, content) => {
  if (isAiTyping.value) return
  isAiTyping.value = true
  messages.value.push({
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    senderType: 2,
    content: '',
    createdAt: new Date().toLocaleString()
  })
  const aiMessage = messages.value[messages.value.length - 1]
  fetchEventSource("/api/psychological-chat/stream", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('token'),
      'Accept': 'text/event-stream'
    },
    body: JSON.stringify({ sessionId: sessionId, userMessage: content }),
    signal: ctrl.signal,
    onopen: (res) => {
      if (res.headers.get('Content-Type') !== 'text/event-stream') {
        ElMessage.error('服务器返回的不是流式数据')
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim()
      if (!raw) return
      if (event.event === 'done') {
        isAiTyping.value = false
        ctrl.abort()
        loadSessionEmotion(currentSession.value.sessionId)
        return
      }
      let payload
      try {
        payload = JSON.parse(raw)
      } catch (error) {
        return
      }
      if (String(payload.code) === '200' && payload.data?.content) {
        aiMessage.content += payload.data.content
      } else {
        handleError(payload.message || 'AI回复失败')
      }
    },
    onerror: (err) => {
      handleError(err || 'AI回复失败')
      ctrl.abort()
      throw err
    },
    onclose: () => {
      loadSessionEmotion(currentSession.value.sessionId)
    }
  })
}

const handleError = (error)=>{
  const aiMessage = messages.value[messages.value.length - 1]
  if (aiMessage && aiMessage.sendderType === 2) {
    aiMessage.content = 'AI回复失败,请重试'
  }
  isAiTyping.value = false
  ElMessage.error(error)
}

const getSessionPage = async () => {
  const res = await getSessionList({ pageNum: 1, pageSize: 10 })
  sessionList.value = res.records
}

const handleSessionClick = async (session) => {
  const res = await getSessionDetail(session.id)
  messages.value = res
  loadSessionEmotion(session.id)
  currentSession.value = {
    sessionId: "session_" + session.id,
    status: 'ACTIVE',
    sessionTitle: session.sessionTitle
  }
}

const handleDeleteSession = async (sessionId) => {
  ElMessageBox.confirm('确认删除该会话吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteSession(sessionId)
    getSessionPage()
    ElMessage.success('删除成功')
  })
}

const formatMessageContent = (content) => content.replace(/\n/g, '<br>')

// 情绪花园
const currentEmotion = ref({
  primaryEmotion: '中性',
  emotionScore: 50,
  isNegative: false,
  intensityLevel: 0,
  suggestion: '保持积极心态，适当调整情绪',
  improvementSuggestions: []
})

const loadSessionEmotion = async (sessionId) => {
  const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`
  const res = await getSeeionEmotion(id)
  currentEmotion.value = res
}

const getIntensityClass = (score) => {
  if (score >= 61) return 3
  if (score >= 31) return 2
  return 1
}

const getEiskText = (level) => {
  switch (level) {
    case 0: return '正常'
    case 1: return '关注'
    case 2: return '预警'
    case 3: return '危机'
    default: return '正常'
  }
}

onMounted(() => {
  createNewFrontendSession()
  getSessionPage()
})
</script>

<style lang="scss" scoped>
.consultation {
  --primary: #0f6e56;
  --primary-weak: #1d9e75;
  --primary-bg: #e1f5ee;
  --primary-hover-bg: #f0faf6;
  --text-1: #1f2937;
  --text-2: #4b5563;
  --text-3: #9ca3af;
  --border: #e5e7eb;
  --warn: #b45309;
  --warn-bg: #fef3c7;
  --radius: 12px;
  display: flex;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
}

.card {
  background: #fff;
  border: 0.5px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;

  .card-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-1);
    margin: 0 0 12px;
  }

  .block-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-2);
    margin: 14px 0 8px;
  }
}

/* ============ 左侧栏 ============ */
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

/* 1. AI助手信息 */
.ai-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  .ai-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--primary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img { width: 26px; height: 26px; }
  }

  .ai-meta {
    h3 { font-size: 15px; font-weight: 500; color: var(--text-1); margin: 0 0 4px; }

    .online {
      font-size: 12px;
      color: var(--text-2);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary-weak);
      }
    }
  }
}

/* 2. 情绪花园 */
.emotion-garden {
  flex-shrink: 1;
  min-height: 0;
  overflow-y: auto;

  .emotion-main {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 14px;
    border-bottom: 0.5px solid var(--border);
  }

  .emotion-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--primary-bg);
    color: var(--primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.negative {
      background: var(--warn-bg);
      color: var(--warn);
    }

    .emotion-name { font-size: 14px; font-weight: 500; line-height: 1.2; }
    .emotion-score { font-size: 12px; opacity: 0.85; }
  }

  .emotion-status {
    flex: 1;
    font-size: 13px;

    .status-line {
      margin: 0 0 10px;

      .status-label { color: var(--text-3); margin-right: 6px; }
      .status-emotion { color: var(--text-1); font-weight: 500; }
    }

    .intensity-line {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;

      .intensity-dots { display: flex; gap: 4px; }

      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #e5e7eb;

        &.active { background: var(--primary); }
      }

      .intensity-text { font-size: 12px; color: var(--text-3); }
    }
  }

  .suggestion {
    display: flex;
    gap: 8px;
    margin-top: 14px;

    .suggestion-icon { font-size: 15px; flex-shrink: 0; }

    .suggestion-body {
      .suggestion-label { font-size: 13px; font-weight: 500; color: var(--text-2); }
      .suggestion-text { font-size: 13px; color: var(--text-2); margin: 4px 0 0; line-height: 1.6; }
    }
  }

  .actions .action-list {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
      display: flex;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 0.5px solid var(--border);
      font-size: 13px;
      color: var(--text-2);

      &:last-child { border-bottom: none; }

      .action-icon { flex-shrink: 0; }
      .action-text { line-height: 1.5; }
    }
  }

  .risk {
    background: var(--warn-bg);
    border-radius: 8px;
    padding: 12px;
    margin-top: 14px;

    .block-title { margin: 0 0 6px; color: var(--warn); }
    .risk-text { margin: 0; font-size: 13px; color: var(--warn); line-height: 1.6; }
  }
}

/* 3. 会话列表 */
.session-history {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .session-list {
    margin: 0;
    padding: 0;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .session-item {
    position: relative;
    list-style: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    border-bottom: 0.5px solid var(--border);

    &:hover { background: var(--primary-hover-bg); }

    .session-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .session-title {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 190px;
      }

      .session-time { font-size: 11px; color: var(--text-3); flex-shrink: 0; }
    }

    .session-preview {
      font-size: 12px;
      color: var(--text-3);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .session-delete {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border: none;
      background: #f3f4f6;
      color: var(--text-3);
      border-radius: 6px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s;

      &:hover { color: #dc2626; }
    }

    &:hover .session-delete { opacity: 1; }
  }
}

/* ============ 右侧聊天 ============ */
.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 0.5px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  min-width: 0;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 0.5px solid var(--border);
  flex-shrink: 0;

  .chat-info {
    h2 { font-size: 16px; font-weight: 500; color: var(--text-1); margin: 0 0 2px; }
    p { font-size: 12px; color: var(--text-3); margin: 0; }
  }

  .new-session {
    border: 0.5px solid var(--primary);
    color: var(--primary);
    background: transparent;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;

    &:hover { background: var(--primary-hover-bg); }
  }
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fafbfa;
}

.msg {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--primary-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img { width: 17px; height: 17px; }
  }

  .bubble {
    max-width: 72%;
    font-size: 14px;
    line-height: 1.6;
    padding: 10px 14px;
    border-radius: 10px;

    .time {
      display: block;
      font-size: 11px;
      color: var(--text-3);
      margin-top: 4px;
    }
  }

  &.ai .bubble { background: #fff; border: 0.5px solid var(--border); color: var(--text-1); }

  &.user {
    flex-direction: row-reverse;

    .avatar { background: #e5e7eb; }

    .bubble { background: var(--primary); color: #fff; text-align: left; }
  }
}

.typing {
  display: flex;
  gap: 4px;
  padding: 4px 0;

  .typing-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #cbd5e1;
    animation: blink 1.2s infinite;

    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}

.error {
  color: #dc2626;
  background: #fef2f2;
  border: 0.5px solid #fecaca;
  border-radius: 8px;
  padding: 10px 12px;
}

.chat-input {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  padding: 14px 20px;
  border-top: 0.5px solid var(--border);
  flex-shrink: 0;

  .input-box { flex: 1; }

  textarea {
    width: 100%;
    border: 0.5px solid var(--border);
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    outline: none;
    font-family: inherit;
    color: var(--text-1);

    &:focus { border-color: var(--primary); }

    &:disabled { background: #f9fafb; }
  }

  .input-meta {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-3);
    margin-top: 6px;
  }

  .send-btn {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 10px;
    background: var(--primary);
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    flex-shrink: 0;

    &:hover:not(:disabled) { background: var(--primary-weak); }

    &:disabled { background: #d1d5db; cursor: not-allowed; }
  }
}

/* 移动端：收起左侧栏 */
@media (max-width: 900px) {
  .consultation {
    flex-direction: column;
    height: auto;
  }

  .sidebar { width: 100%; flex-direction: row; overflow-x: auto; }

  .sidebar .card { min-width: 260px; }
}
</style>
