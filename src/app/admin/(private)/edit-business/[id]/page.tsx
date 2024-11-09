'use client';

import { useParams } from "next/navigation";
import { useBusiness } from "./_hooks/useBusiness";
import { useMemo } from "react";
import ClientForm from "../../_common/ClientForm";
import { Business } from "@/lib/types/Zod/Business";

const EditBusinessPage = () => {
  const params = useParams();
  const businessId = params.id;

  const businessQuery = useBusiness(businessId as string);
  const business = useMemo(() => businessQuery.data || {}, [businessQuery.data]) as Business

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ClientForm
        // mutation={editBusiness}
        businessData={business}
      />
    </div>
  )
}

export default EditBusinessPage