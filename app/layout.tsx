import "@styles/globals.css";
import {Metadata} from "@node_modules/next";
import {
    ClerkProvider,
    ClerkLoaded,
} from '@clerk/nextjs'
import {ThemeProvider} from "@components/ui/theme/theme-provider";
import {Toaster} from "@components/ui/sonner";

export const metadata: Metadata = {
  title: "Rivine Analytics",
  description: "Created by Harivignesh with <3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body>

                  <ClerkProvider>
                      <ClerkLoaded>
                          <ThemeProvider
                              attribute="class"
                              defaultTheme="system"
                              enableSystem
                              disableTransitionOnChange
                          >
                          {children}
                              <Toaster />
                          </ThemeProvider>
                      </ClerkLoaded>
                  </ClerkProvider>

          </body>
      </html>
  );
}
