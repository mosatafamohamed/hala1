import { HubManager } from "@/app/admin/_components/hub-manager";
import { listAdminHubs } from "@/lib/cms/admin";

export default async function AdminHubsPage() {
  const hubs = await listAdminHubs();
  return <HubManager initialHubs={hubs} />;
}
