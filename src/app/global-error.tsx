"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global Layout Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Future Farms - System Alert</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[#f8faf7] text-[#191c1a] font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4 text-red-600">
            <span className="material-symbols-outlined text-3xl">error_outline</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            System Level Hitch
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
            Future Farms encountered a critical rendering exception. Please reload to restore your session.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 px-6 rounded-xl bg-[#009924] hover:bg-[#007a1c] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
