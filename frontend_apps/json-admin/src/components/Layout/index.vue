<template>
  <el-container class="w-screen h-screen">
    <el-aside :width="sideWidth" class="aside-transition flex flex-col overflow-hidden">
      <el-menu default-active="2" class="flex-1 overflow-y-auto p-3" :class="collapsed && 'j-menu-collapsed'"
        style="padding-left: 0.75rem;" :collapse="collapsed" :collapse-transition="false" unique-opened>
        <div class="flex items-center mb-2 whitespace-nowrap justify-center">
          <Logo width="26px" height="26px" />
          <h1 class="text-2xl font-bold ml-3" v-if="!collapsed">{{ t('title') }}</h1>
        </div>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <location />
            </el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group>
            <template #title><span>Group One</span></template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title><span>item four</span></template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon>
            <location />
          </el-icon>
          <template #title>Navigator Two</template>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon>
            <location />
          </el-icon>
          <template #title>Navigator Three</template>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon>
            <location />
          </el-icon>
          <template #title>Navigator Four</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="flex items-center justify-between border-b">
        <el-button link @click="setCollapsed.toggle">
          <template #icon>
            <el-icon :size="24">
              <Expand v-if="collapsed" />
              <Fold v-else />
            </el-icon>
          </template>
        </el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Logo from '@/assets/Logo.vue';
import { useUserStore } from '@/store/modules/user';
import { Expand, Fold, Location } from '@element-plus/icons-vue';
import { computed, nextTick, watch, watchEffect } from 'vue';
import { useBoolean } from 'vue-hooks-plus';
import { useI18n } from 'vue-i18n';

const [collapsed, setCollapsed] = useBoolean(false);

const userStore = useUserStore();
const { t } = useI18n();
userStore.refreshUserInfo();

const sideWidth = computed(() => {
  return collapsed.value
    ? import.meta.env?.J_SIDE_WIDTH_COLLAPSED
    : import.meta.env?.J_SIDE_WIDTH_EXPAND;
});

watchEffect(() => {
  console.log(sideWidth.value);
});
</script>

<style lang="scss" scoped>
.aside-transition {
  transition: width .3s;
}
</style>
