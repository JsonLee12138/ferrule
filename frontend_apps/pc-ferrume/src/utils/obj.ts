export const objToJson = (str: string) => {
  try {
    const res = str
      .replace(/(\b\w+\b)\s*:/g, (_match, key) => {
        // 检查键名是否已经被引号包围
        if (key.startsWith('"') && key.endsWith('"')) {
          return `${key}:`; // 如果已经有双引号，保持不变
        } else if (key.startsWith("'") && key.endsWith("'")) {
          return `${key.replace(/'/g, '"')}:`; // 如果有单引号，替换为双引号
        } else {
          return `"${key}":`; // 如果没有引号，添加双引号
        }
      })
      .replace(/:\s*'([^']*?)'/g, ': "$1"');
    return res;
  } catch {
    return str;
  }
};
