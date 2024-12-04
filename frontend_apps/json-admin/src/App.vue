<template>
	<el-config-provider :locale="zhCn" :size="setting.elSize">
		<router-view />
	</el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { computed, onBeforeUnmount } from 'vue';
import { SystemEmitters } from './enums/systemEmitters';
import { systemEmitter } from './utils/emitter';
import 'dayjs/locale/zh-cn';
import { useSettingStore } from './store/modules/setting';

const settingStore = useSettingStore();
const setting = computed(()=> settingStore.setting);
// 设置主题
document.documentElement.style.setProperty('--el-color-primary', '#6366f1');
document.documentElement.style.setProperty(
  '--el-color-primary-light-9',
  '#eef2ff',
);
document.documentElement.style.setProperty(
  '--el-color-primary-light-8',
  '#e0e7ff',
);
document.documentElement.style.setProperty(
  '--el-color-primary-light-7',
  '#c7d2fe',
);
document.documentElement.style.setProperty(
  '--el-color-primary-light-5',
  '#a5b4fc',
);
document.documentElement.style.setProperty(
  '--el-color-primary-light-3',
  '#818cf8',
);
document.documentElement.style.setProperty(
  '--el-color-primary-dark-2',
  '#4338ca',
);

document.documentElement.style.setProperty('--el-menu-item-height', '46px');
// 全局监听
document.addEventListener('resize', () => {
  systemEmitter.emit(SystemEmitters.RESIZE);
});

onBeforeUnmount(() => {
  document.removeEventListener('resize', () => {
    systemEmitter.emit(SystemEmitters.RESIZE);
  });
});
</script>
