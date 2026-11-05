import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { DemoWorkspaceProvider } from "@/lib/demo-workspace";
import { getToken } from "@/lib/auth-server";

export async function AuthProviders({ children }: { children: React.ReactNode }) {
  const token = await getToken();

  return (
    <ConvexClientProvider initialToken={token}>
      <DemoWorkspaceProvider>{children}</DemoWorkspaceProvider>
    </ConvexClientProvider>
  );
}
