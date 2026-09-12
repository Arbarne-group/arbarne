"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface ScannableQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  alt?: string;
  lightColor?: string;
  darkColor?: string;
}

export function ScannableQrCode({
  value,
  size = 120,
  className = "",
  alt = "Scan QR Code for official verification",
  lightColor = "#ffffff",
  darkColor = "#0f172a",
}: ScannableQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!value) {
      setDataUrl("");
      return;
    }

    QRCode.toDataURL(value, {
      width: size * 2, // High resolution for crisp scanning and 300 DPI printing
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch((err) => {
        console.error("Failed to generate QR code:", err);
        if (isMounted) setError("Failed to generate QR");
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, lightColor, darkColor]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 text-center p-1 ${className}`}
      >
        <span>QR Unavailable</span>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center animate-pulse ${className}`}
      >
        <span className="material-symbols-outlined text-slate-400 text-xl">
          qr_code_2
        </span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`rounded-lg object-contain bg-white shadow-xs ${className}`}
    />
  );
}

export default ScannableQrCode;
