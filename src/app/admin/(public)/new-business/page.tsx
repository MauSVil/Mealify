
"use client"

import { useCreateBusiness } from "./_hooks/useCreateBusiness";
import ClientForm from "../../(private)/_common/ClientForm";

const NewBusinessPage = () => {
  const createBusiness = useCreateBusiness();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <ClientForm mutation={createBusiness} />
    </div>
  )
}

export default NewBusinessPage;