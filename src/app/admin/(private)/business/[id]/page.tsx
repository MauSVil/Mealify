'use client';
import { useParams } from "next/navigation";
import { useBusiness } from "./_hooks/useBusiness";
import { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ky from "ky";
import { useStripeAccountStatus } from "./_hooks/useStripeAccountStatus";

const BusinessIdPage = () => {
  const params = useParams();
  const businessId = params.id;

  const businessQuery = useBusiness(businessId as string);
  const business = useMemo(() => businessQuery.data, [businessQuery.data]);

  const statusQuery = useStripeAccountStatus(businessId as string);
  const status = useMemo(() => statusQuery.data, [statusQuery.data]);

  const handleCreateOrUpdateBusiness = async () => {
    try {
      const resp = await ky.post('/api/admin/business/create-strapi-account', { json: { businessId } }).json<{ data: string, error?: string }>();
      const { data } = resp;
      window.location.href = data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h2 className="text-2xl font-bold">
        {business?.name}
      </h2>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h1 className="text-2xl font-bold">
            Stripe
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:gap-8">
          <Button onClick={handleCreateOrUpdateBusiness} disabled={businessQuery.isLoading || statusQuery.isLoading || status === false}>
            {status ? 'Actualizar cuenta' : 'Crear cuenta'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default BusinessIdPage;