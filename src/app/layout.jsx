export const metadata = {
  title: "Salamander Video Tracker Website",
  icons: {
    icon: "/SalamanderTransparent.png"
  },
};

import ClientsideLayout from "./ClientsideLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientsideLayout>{children}</ClientsideLayout>
      </body>
    </html>
  );
}

