<script setup lang="ts">
import { ref } from 'vue'

type Room = {
  name: string
  description: string
  count: number
  color: string
}

const rooms: Room[] = [
  { name: '公開聊天室', description: '自由討論', count: 6, color: 'bg-coral' },
]
const activeRoom = ref(rooms[0].name)
const isSidebarOpen = ref(false)

function closeSidebar() {
  isSidebarOpen.value = false
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="flex bg-shell text-ink min-h-dvh max-h-dvh">
    <aside :class="['fixed inset-y-0 left-0 z-10 flex w-64.5 shrink-0 -translate-x-full flex-col bg-ink px-4 py-7.5 pb-4.5 text-cream shadow-sidebar transition-transform md:static md:translate-x-0 md:shadow-none', { 'translate-x-0': isSidebarOpen }]" aria-label="聊天室導覽">
      <div class="flex items-center gap-2.75 px-3.5 pb-11.25">
        <div class="grid h-8.75 w-8.75 -rotate-25 place-items-center rounded-full border border-gold text-[22px] text-gold"><span>◎</span></div>
        <div>
          <p class="m-0 font-serif text-[17px] tracking-wide">湯底俱樂部</p>
          <p class="m-0 mt-0.75 text-[10px] tracking-wider text-mist">一起把故事拼完整</p>
        </div>
      </div>

      <div class="px-1">
        <div class="flex items-center justify-between px-2.25 pb-3 text-[11px] tracking-wider text-mist">
          <span>我的聊天室</span>
        </div>
        <RouterLink
          v-for="room in rooms"
          :key="room.name"
          class="mb-0.75 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.75 text-left text-text-pale"
          active-class="bg-shell text-ink"
          to="/"
          @click="closeSidebar"
        >
          <span :class="['h-2 w-2 shrink-0 rounded-full', room.color]"></span>
          <span class="min-w-0 flex-1">
            <strong class="block text-[13px] font-semibold">{{ room.name }}</strong>
            <small :class="['block text-[10px]', activeRoom === room.name ? 'text-muted' : 'text-text-faint']">{{ room.description }}</small>
          </span>
          <span :class="['text-[10px]', activeRoom === room.name ? 'text-coral' : 'text-text-faint']">{{ room.count }}</span>
        </RouterLink>
        <RouterLink
          class="mt-2 flex items-center gap-2.5 rounded-lg border border-dashed border-sage/50 px-2.5 py-2.75 text-[12px] text-gold transition-colors hover:border-gold hover:bg-sage/30"
          to="/stories/new"
          @click="isSidebarOpen = false"
        >
          <span class="grid h-5 w-5 place-items-center rounded-full border border-gold text-sm leading-none">＋</span>
          <span>新增故事</span>
        </RouterLink>
        <RouterLink
          class="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2.75 text-[12px] text-text-pale transition-colors hover:bg-sage/30 hover:text-cream"
          to="/stories"
          @click="isSidebarOpen = false"
        >
          <span class="grid h-5 w-5 place-items-center rounded-full border border-sage text-sm leading-none">▤</span>
          <span>故事庫</span>
        </RouterLink>
      </div>

      <div class="mt-8.75 px-1">
        <p class="m-0 px-2.25 pb-3.25 text-[10px] tracking-widest text-sage-text">最近玩過</p>
        <div class="flex items-center gap-2.5 px-2.25 py-2 text-text-pale">
          <div class="grid h-8.5 w-8.5 place-items-center rounded-md bg-sage text-[21px] text-sage-pale">◒</div>
          <div><strong class="block text-[11px] font-medium">消失的星期四</strong><small class="mt-0.75 block text-[9px] text-sage-text">已完成 · 4 人</small></div>
        </div>
        <div class="flex items-center gap-2.5 px-2.25 py-2 text-text-pale">
          <div class="grid h-8.5 w-8.5 place-items-center rounded-md bg-story-orange text-[21px] text-sage-pale">☼</div>
          <div><strong class="block text-[11px] font-medium">雨天的車站</strong><small class="mt-0.75 block text-[9px] text-sage-text">進行中 · 3 人</small></div>
        </div>
      </div>

      <div class="mt-auto flex items-center justify-between border-t border-border-dark px-2.25 pt-4.25">
        <div class="flex items-center gap-2.25"><span class="grid h-7.75 w-7.75 place-items-center rounded-full bg-gold text-[11px] font-semibold text-ink">林</span><span><strong class="block text-[11px] font-medium">林小湯</strong><small class="mt-0.5 block text-[9px] text-sage-text">推理新手</small></span></div>
        <RouterLink class="border-0 bg-transparent tracking-widest text-mist" to="/settings" aria-label="開啟設定">•••</RouterLink>
      </div>
    </aside>

    <div class="flex flex-1 flex-col">
        <header class="flex h-16 items-center justify-between gap-3 border-b border-border-muted bg-paper px-5.5 md:h-19 md:px-[5.5%]">
            <button class="block border-0 bg-transparent text-xl text-ink md:hidden" aria-label="開啟聊天室選單" @click="toggleSidebar">☰</button>
            <div class="flex flex-1 items-center gap-2.75 text-[11px] text-text-dim"><span>聊天室</span><b class="font-normal text-breadcrumb">/</b><strong class="font-semibold text-ink">{{ activeRoom }}</strong></div>
            <div class="flex items-center gap-2.5 md:gap-5.25">
                <button class="relative border-0 bg-transparent text-[22px] text-notification" aria-label="通知"><span>♢</span><i class="absolute right-0 top-1 h-1.25 w-1.25 rounded-full bg-coral"></i></button>
                <button class="grid h-7.5 w-7.5 place-items-center rounded-full border-0 bg-gold text-[11px] font-semibold text-ink" aria-label="個人選單">林</button>
            </div>
        </header>

        <main class="min-w-0 flex-1">
            <slot :active-room="activeRoom"></slot>
        </main>
    </div>
  </div>
</template>
