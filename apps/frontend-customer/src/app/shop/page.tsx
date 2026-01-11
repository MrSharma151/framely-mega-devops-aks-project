import { Suspense } from 'react';
import ShopClient from '@/components/ui/ShopClient';
import { Loader2 } from "lucide-react"; 

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading products...
      </div>
    }>
      <ShopClient />
    </Suspense>
  );
}