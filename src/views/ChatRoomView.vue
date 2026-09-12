<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layout/AppLayout.vue'
import { createMessage, getMessages, type Message } from '../api/message'
import { me, type User } from '../api/auth'

const conversationId = ref('b070ccfe-2c0a-47e3-b0c8-94163b9485df')
const message = ref('')
const messages = ref<Message[]>([])
const isSending = ref(false)
const messageError = ref('')
const userInfo = ref<User|null>(null)
const messagesContainer = ref<HTMLElement | null>(null);

async function loadMessages() {
    messageError.value = ''
    await getMessages(conversationId.value)
    .then((res: Record<string, Message[]>) => {
        messages.value = res["message"]
    })
    .catch((error)=>{
        messageError.value = error instanceof Error ? error.message : '訊息載入失敗'
    })
}

async function sendMessage() {
    const content = message.value.trim()
    if (!content || isSending.value) return

    isSending.value = true
    messageError.value = ''

    await createMessage({ 
        user_id: userInfo.value?.user_id ?? '',
        content: content,
        conversation_id: conversationId.value
    })
    .then((res: Record<string, Message[]>)=>{
        messages.value.push(res["message"][0])
    })
    .catch(async (err)=>{
        messageError.value = err instanceof Error ? err.message : '訊息送出失敗'
        await Swal.fire({
            title: '訊息送出失敗',
            text: '請稍後再試。',
            icon: 'error',
            confirmButtonText: '知道了',
            confirmButtonColor: 'var(--color-coral)',
        })
    })
    .finally(()=>{
        message.value = ''
    })
}

function showClue() {
  Swal.fire({
    title: '主持人的提示',
    text: '關鍵不在湯，而在那個人為什麼會點湯。',
    icon: 'info',
    confirmButtonText: '收到提示',
    confirmButtonColor: 'var(--color-coral)',
  })
}

function isOwnMessage(messageItem: Message) {
    return userInfo.value?.user_id === messageItem.user_id
}

onMounted(async ()=>{
    loadMessages();
    userInfo.value = await me()
})
watch(
  messages,
  async () => {
    await nextTick();

    messagesContainer.value?.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: "smooth",
    });
  },
  { deep: true }
);
</script>

<template>
    <AppLayout v-slot="{ activeRoom }">
        <div class="flex flex-col gap-5 mx-auto p-5 md:max-w-3/4">
            <!-- 上方聊天室資訊欄 -->
            <section class="block md:flex md:items-end md:justify-between">
                <div>
                    <div class="flex items-center gap-2 text-sm tracking-wider text-eyebrow">
                        <span class="h-1.5 w-1.5 rounded-full bg-coral shadow-live"></span>
                        正在進行中 · 6 位玩家
                    </div>
                    <h1 class="p-3 text-ink md:text-[clamp(32px,4vw,48px)]">
                        {{ activeRoom }}
                    </h1>
                    <p class="m-0 text-xs text-muted">
                        一碗湯，一個謎。問問題、找線索，拼出故事的真相。
                    </p>
                </div>
                <button class="rounded border border-border bg-paper p-3 text-md text-text-strong" @click="showClue">
                    <span class="text-coral">♧</span>
                    邀請玩家
                </button>
            </section>

            <!-- 下方聊天室與案件資訊欄 -->
            <div class="grid gap-4 md:grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(270px,.8fr)]">
                <!-- 聊天室內容 -->
                <section class="flex min-h-140 max-h-140 flex-col rounded-lg border border-line bg-paper">
                    <div class="flex items-center justify-between border-b border-line-soft p-4">
                        <div>
                            <strong class="block text-md font-semibold">推理現場</strong>
                            <span class="block text-xs text-text-faint">今天 22:38 開始</span>
                        </div>
                        <button class="border-0 bg-transparent text-sm text-text-warm" @click="showClue">
                            查看提示
                            <span class="text-sm">→</span>
                        </button>
                    </div>
                    <div class="flex-1 p-5 overflow-y-auto" ref="messagesContainer">
                        <div class="flex items-center gap-3.25 text-md text-text-faint before:h-px before:flex-1 before:bg-line-soft after:h-px after:flex-1 after:bg-line-soft">
                            <span>今天</span>
                        </div>
                        <article v-for="chat in messages" :key="`${chat.id}-${chat.created_at}`" class="mb-6 flex flex-col gap-3" :class="{ 'ml-auto': isOwnMessage(chat) }">
                            <div :class="['flex min-w-0 items-start gap-3', { 'flex-row-reverse text-right': isOwnMessage(chat) }]">
                                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-md font-semibold bg-blue text-avatar-blue-text">
                                    {{ chat.user_name.slice(0, 1) }}
                                </span>
                                <div class="min-w-0 max-w-[calc(100%-52px)]">
                                    <div :class="['mb-1.25 flex items-baseline gap-2', { 'justify-end': isOwnMessage(chat) }]">
                                        <strong class="text-sm text-text-strong">{{ chat.user_name }}</strong>
                                        <time class="text-xs text-text-faint">{{ chat.created_at }}</time>
                                    </div>
                                    <p :class="['m-0 whitespace-pre-wrap break-words p-3 text-left text-md leading-[1.6]', isOwnMessage(chat) ? 'rounded-[8px_0_8px_8px] bg-bubble-own text-bubble-own-text' : 'rounded-[0_8px_8px_8px] bg-bubble text-bubble-text']">
                                        {{ chat.content }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="chat.response" class="flex min-w-0 items-start gap-3">
                                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-peach text-md font-semibold text-avatar-peach-text">
                                    主
                                </span>
                                <div class="min-w-0 max-w-[calc(100%-52px)]">
                                    <div class="mb-1.25 flex items-baseline gap-2">
                                        <strong class="text-sm text-text-strong">主持人</strong>
                                        <time class="text-xs text-text-faint">{{ chat.created_at }}</time>
                                    </div>
                                    <p v-html="chat.response" class="m-0 break-words rounded-[0_8px_8px_8px] bg-peach p-3 text-left text-md leading-[1.6] text-bubble-text"></p>
                                </div>
                            </div>
                        </article>
                        <div class="flex items-center gap-2.25 text-md text-text-faint"><span class="grid h-6.75 w-6.75 place-items-center rounded-full bg-lavender text-[11px] font-semibold text-avatar-lavender-text">米</span><span>米粒正在思考<span class="ml-0.5 tracking-widest text-coral">···</span></span></div>
                    </div>
                    <form class="flex items-center gap-2.5 border-t border-line-soft p-4.5" @submit.prevent="sendMessage">
                        <p v-if="messageError" class="text-xs text-coral" role="alert">{{ messageError }}</p>
                        <input v-model="message" class="min-w-0 flex-1 border-0 bg-transparent text-md text-ink outline-none placeholder:text-placeholder" type="text" placeholder="輸入你的推理或提問..." aria-label="輸入推理或提問" />
                        <button class="grid h-10 w-10 place-items-center rounded-full border-0 bg-coral text-lg text-white disabled:cursor-not-allowed disabled:opacity-50" type="submit" aria-label="送出訊息" :disabled="isSending">
                            ↑
                        </button>
                    </form>
                </section>

                <!-- 案件資訊欄 -->
                <aside class="self-start rounded-lg border border-line bg-paper p-[20px_17px] md:p-[25px_23px_21px]" aria-label="案件資訊">
                    <div class="flex items-start gap-2.5"><span class="grid h-7.25 w-7.25 place-items-center rounded-full bg-icon-bg text-[15px] text-icon">✦</span><div><p class="m-0 mb-1 text-[9px] text-text-faint">本局案件</p><h2 class="m-0 font-serif text-lg font-normal text-ink">最後一碗湯</h2></div><button class="ml-auto border-0 bg-transparent tracking-widest text-text-faint" aria-label="案件選單">•••</button></div>
                    <div class="relative my-4.25 grid h-31.25 place-items-center overflow-hidden rounded bg-case-bg text-sage-dark md:my-[22px_17px]"><span class="relative z-10 text-5xl">♨</span><div class="absolute left-[42%] top-3 h-14.5 w-6.25 rotate-20 rounded-[50%] border-l-2 border-steam"></div><div class="absolute left-[53%] top-1.25 h-14.5 w-6.25 rotate-[-18deg] rounded-[50%] border-l-2 border-steam"></div></div>
                    <p class="m-0 text-[11px] leading-[1.8] text-case-text">一名男子走進餐廳，點了一碗海龜湯。他只喝了一口，便離開餐廳，回家後自殺了。</p>
                    <div class="mt-5 flex items-center justify-between text-[10px] text-case-muted"><span>案件難度</span><strong class="text-[10px] font-medium text-case-heading">中等 <i class="ml-1.75 text-[9px] not-italic tracking-wide text-difficulty">★★★☆☆</i></strong></div>
                    <div class="my-4.25 h-px bg-line-soft"></div><div class="flex items-center justify-between text-[10px] text-case-heading"><strong>房間成員</strong><span class="text-[9px] text-case-count">6 / 8</span></div>
                    <div class="flex py-3.25 pb-5.25"><span class="-mr-1.25 grid h-7.25 w-7.25 place-items-center rounded-full border-2 border-paper bg-peach text-[9px] text-avatar-peach-text">小</span><span class="-mr-1.25 grid h-7.25 w-7.25 place-items-center rounded-full border-2 border-paper bg-blue text-[9px] text-avatar-blue-text">阿</span><span class="-mr-1.25 grid h-7.25 w-7.25 place-items-center rounded-full border-2 border-paper bg-lavender text-[9px] text-avatar-lavender-text">米</span><span class="-mr-1.25 grid h-7.25 w-7.25 place-items-center rounded-full border-2 border-paper bg-olive text-[9px] text-avatar-olive-text">周</span><span class="-mr-1.25 grid h-7.25 w-7.25 place-items-center rounded-full border-2 border-paper bg-avatar-coral text-[9px] text-avatar-coral-text">葉</span><span class="-mr-1.25 grid h-7.25 w-7.25 place-items-center rounded-full border-2 border-paper bg-gold text-[9px] text-ink">你</span></div>
                    <button class="w-full rounded border border-border bg-transparent p-2.5 text-[10px] text-text-warm" @click="showClue">查看完整案件 <span class="ml-1.75">↗</span></button>
                </aside>
            </div>
        </div>
    </AppLayout>
</template>
