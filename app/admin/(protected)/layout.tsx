import { requireAdminPage } from "../../../src/server/admin-auth";

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdminPage();
  return children;
}
