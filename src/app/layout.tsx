import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://satria-putra.vercel.app"),
  alternates: { canonical: "/" },
  title: "Satria Putra, AI Engineer (Full Stack)",
  description:
    "I build the pipeline my team ships through: spec-driven subagents, failing-test-first gates, multi-repo orchestration. How the systems on my CV actually work.",
  openGraph: {
    title: "Satria Putra, AI Engineer (Full Stack)",
    description: "How a ticket becomes a deploy when agents write most of the code.",
    type: "website",
  },
};

// Lets ?theme=dark / ?theme=light override the system setting (used for screenshots).
const themeScript =
  "(function(){try{var t=new URLSearchParams(location.search).get('theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
