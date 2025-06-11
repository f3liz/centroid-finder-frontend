import ClientsideLayout from "./ClientsideLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientsideLayout>
          {children}
        </ClientsideLayout>
      </body>
    </html>
  );
}
