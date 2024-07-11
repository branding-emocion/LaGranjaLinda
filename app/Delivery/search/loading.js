import { Skeleton } from "@/components/ui/skeleton";

const LoadingSearch = () => {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-2">Cargando los resultados</h1>
      <h2 className="mb-5 text-gray-500">No tardaremos...</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <Skeleton className="w-[300px] h-[300px]" />
        <Skeleton className="w-[300px] h-[300px]" />
        <Skeleton className="w-[300px] h-[300px]" />
        <Skeleton className="w-[300px] h-[300px]" />
      </div>
    </div>
  );
};

export default LoadingSearch;
