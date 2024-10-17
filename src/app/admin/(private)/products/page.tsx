"use client";

import { DataTable } from "@/components/Datatable"
import DataTableColumnHeader from "@/components/Datatable/DataTableHeader";
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useProducts } from "./_hooks/useProducts";
import { Product } from "@/lib/types/Zod/Product";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const productsQuery = useProducts();
  const data = useMemo(() => productsQuery.data || [], [productsQuery.data]);

  const columns: ColumnDef<Product>[] = useMemo(
    () =>
      [
        {
          id: 'Comprador',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Comprador" />
          ),
          accessorKey: 'name',
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
        {
          id: 'Email',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
          ),
          accessorKey: 'email',
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
        {
          id: 'Telefono',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Telefono" />
          ),
          accessorKey: 'phone',
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
      ] satisfies ColumnDef<Product>[],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getRowId(originalRow) {
      return originalRow._id;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: "auto",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex justify-end gap-4">
        <Button>
          Importar
        </Button>
        <Button onClick={() => router.push('/admin/products/new')}>
          Nuevo producto
        </Button>
      </div>
      <DataTable
        table={table}
        columns={columns}
        className="w-full"
        isLoading={productsQuery.isLoading}
      />
    </div>
  )
}

export default ProductsPage