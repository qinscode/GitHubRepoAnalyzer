import { useState } from 'react';

interface UseRepoActionsReturn {
  copiedUrl: string | null;
  copyRepoUrl: (url: string) => void;
  openInGitHub: (url: string) => void;
}

export const useRepoActions = (): UseRepoActionsReturn => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyRepoUrl = (url: string): void => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedUrl(url);
        setTimeout(() => {
          setCopiedUrl(null);
        }, 2000);
      })
      .catch((error) => {
        console.error("Copy failed", error);
      });
  };

  const openInGitHub = (url: string): void => {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    try {
      if (window.__TAURI__) {
        window.__TAURI__.shell.open(formattedUrl).catch((error) => {
          console.error("Failed to open URL with Tauri:", error);
          alert("Cannot open URL with Tauri. Please check your configuration.");
        });
      } else {
        const newTab = window.open("about:blank", "_blank");
        if (newTab) {
          newTab.location.href = formattedUrl;
        } else {
          window.open(formattedUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Failed to open GitHub URL:", error);
      alert("无法打开GitHub链接，请手动复制URL。");
    }
  };

  return { copiedUrl, copyRepoUrl, openInGitHub };
}; 