import type { SystemEmitters } from '@/enums/systemEmitters';
import mitt from 'mitt';

export const systemEmitter = mitt<Record<SystemEmitters, unknown>>();
