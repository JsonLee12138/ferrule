import FingerprintJS from '@fingerprintjs/fingerprintjs';
export const getDeviceId = async () => {
  try {
    const finger = await FingerprintJS.load();
    const fingerRes = await finger.get();
    const deviceId = fingerRes.visitorId;
    return deviceId;
  } catch (error) {
    return Promise.resolve('');
  }
};
