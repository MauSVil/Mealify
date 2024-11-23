import { cn } from "@/lib/utils";

interface FieldProps {
  children: React.ReactNode;
  id: string;
  label: string;
  labelClassName?: string;
  error: { message: string } | undefined;
}

export default function Field({ children, error }: FieldProps) {
  return (
    <div className="space-y-1">
      <div className="relative">
        {children}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
