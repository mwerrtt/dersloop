const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("dersloop", {
  platform: process.platform,
  isDesktop: true,
});
