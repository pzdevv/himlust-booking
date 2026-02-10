import { cookies } from "next/headers";
import EditTripForm from "@/components/admin/EditTripForm";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditTripWrapper({ params }: PageProps) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;

    return <EditTripForm tripId={id} token={token} />;
}
