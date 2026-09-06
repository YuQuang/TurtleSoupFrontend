<script setup lang="ts">
import { ref } from 'vue'
import Swal from 'sweetalert2'
import AppLayout from '../layout/AppLayout.vue'

const activeRoom = ref('深夜食堂')
const displayName = ref('林小湯')
const email = ref('lin.tang@example.com')
const soundEnabled = ref(true)
const desktopNotifications = ref(true)
const rooms = [
  { name: '深夜食堂', description: '案件 #042', count: 6, color: 'bg-coral' },
  { name: '週末聚會', description: '案件 #038', count: 4, color: 'bg-leaf' },
  { name: '新手村', description: '自由討論', count: 12, color: 'bg-sky' },
]

function selectRoom(roomName: string) {
  activeRoom.value = roomName
}

function saveSettings() {
  Swal.fire({
    title: '設定已儲存',
    text: '你的偏好設定已更新。',
    icon: 'success',
    confirmButtonText: '完成',
    confirmButtonColor: 'var(--color-ink)',
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
</script>

<template>
    <AppLayout :rooms="rooms" :active-room="activeRoom" @select-room="selectRoom" @add-room="showClue">
        <div class="mx-auto max-w-297.5 px-4 py-7.25 md:px-[5.5%] md:py-13.75">
            <section class="mb-6.25"><p class="m-0 text-[10px] tracking-wider text-eyebrow">個人設定</p><h1 class="my-3.25 mb-1.75 font-serif text-9.5 font-normal tracking-tight text-ink">帳號與偏好</h1><p class="m-0 text-xs text-muted">管理你的個人資料與聊天室體驗。</p></section>

            <form class="grid gap-3.75 lg:grid-cols-[minmax(0,1.3fr)_minmax(270px,.7fr)]" @submit.prevent="saveSettings">
                <section class="rounded-lg border border-line bg-paper p-5 md:p-7">
                <div class="mb-6 border-b border-line-soft pb-4"><h2 class="m-0 font-serif text-xl font-normal text-ink">個人資料</h2><p class="mt-1 text-[11px] text-muted">這些資訊會顯示在聊天室中。</p></div>
                <div class="grid gap-5 md:grid-cols-2">
                    <label class="grid gap-2 text-[11px] font-medium text-text-strong">顯示名稱<input v-model="displayName" class="rounded border border-border-input bg-shell px-3 py-2.5 text-xs text-ink outline-none focus:border-coral" type="text" /></label>
                    <label class="grid gap-2 text-[11px] font-medium text-text-strong">電子信箱<input v-model="email" class="rounded border border-border-input bg-shell px-3 py-2.5 text-xs text-ink outline-none focus:border-coral" type="email" /></label>
                </div>
                <div class="mt-6 flex items-center gap-3 border-t border-line-soft pt-5"><span class="grid h-12 w-12 place-items-center rounded-full bg-gold text-lg font-semibold text-ink">林</span><div><strong class="block text-xs text-ink">{{ displayName }}</strong><span class="text-[10px] text-muted">推理新手</span></div><button type="button" class="ml-auto rounded border border-border bg-transparent px-3 py-2 text-[10px] text-text-warm">更換頭像</button></div>
                </section>

                <section class="rounded-lg border border-line bg-paper p-5 md:p-7">
                <div class="mb-6 border-b border-line-soft pb-4"><h2 class="m-0 font-serif text-xl font-normal text-ink">通知與音效</h2><p class="mt-1 text-[11px] text-muted">選擇你想收到的提醒。</p></div>
                <label class="flex items-center justify-between gap-4 border-b border-line-soft py-4 text-xs text-text-strong">聊天室音效<input v-model="soundEnabled" class="h-4 w-4 accent-coral" type="checkbox" /></label>
                <label class="flex items-center justify-between gap-4 py-4 text-xs text-text-strong">桌面通知<input v-model="desktopNotifications" class="h-4 w-4 accent-coral" type="checkbox" /></label>
                </section>

                <div class="flex justify-end lg:col-span-2"><button class="rounded bg-ink px-5 py-3 text-xs font-medium text-cream transition-colors hover:bg-sage" type="submit">儲存設定</button></div>
            </form>
        </div>
    </AppLayout>
</template>
