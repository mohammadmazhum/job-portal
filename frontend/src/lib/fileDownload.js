import { server } from "./apiList";

export const resolveAssetUrl = (assetUrl, baseUrl = server) => {
  if (!assetUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(assetUrl)) {
    return assetUrl;
  }

  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = assetUrl.startsWith("/") ? assetUrl : `/${assetUrl}`;

  return `${normalizedBase}${normalizedPath}`;
};

export const triggerDownload = (blob, fileName = "download") => {
  const fileUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = fileUrl;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(fileUrl);
};
