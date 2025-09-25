export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body style={{ background: "#111", color: "white" }}>{children}</body>
      </html>
    );
  }
  