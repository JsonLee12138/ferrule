import type { ProxyConfig } from "@rsbuild/core";

export const proxiesSetup = (data = "") => {
  let dataStr = data;
  dataStr = dataStr.replace(/(?<=\[|,)\s*([^\[\]',\s]+)\s*(?=,|\])/g, '"$1"');
  dataStr = dataStr.replace(/'/g, '"');
  const proxies: [[string, string]] = JSON.parse(dataStr);
  return proxies.reduce<ProxyConfig>((prev, [key, val])=> {
    prev[key] = {
      target: val,
      pathRewrite: { [`^${key}`]: '' },
      ws: true
    };
    return prev;
  }, {})
}
