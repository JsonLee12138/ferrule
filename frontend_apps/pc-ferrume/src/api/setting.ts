import type { Setting } from "@/types/setting";
import { invoke } from "@tauri-apps/api/core"

export const getSetting = () => invoke<Setting>('get_setting');
