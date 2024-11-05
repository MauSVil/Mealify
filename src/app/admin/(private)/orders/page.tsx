'use client';

import { useMemo, useState } from "react";
import { useOrders } from "./_hooks/useOrders"
import { DataTable } from "@/components/Datatable";
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Order } from "@/lib/types/Zod/Order";
import DataTableColumnHeader from "@/components/Datatable/DataTableHeader";
import { Button } from "@/components/ui/button";
import moment from "moment";

const translatedStatuses: Record<string, string> = {
  'in-process': 'En proceso',
  'on-way': 'En camino',
  'delivered': 'Entregado',
}

const AdminOrdersPage = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const ordersQuery = useOrders();
  const orders = useMemo(() => ordersQuery.data || [], [ordersQuery.data]);

  const columns: ColumnDef<Order>[] = useMemo(
    () =>
      [
        {
          id: 'Fecha de creacion',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Fecha de creacion" />
          ),
          accessorFn: (row) => {
            if (row.createdAt) {
              return moment(row.createdAt).format('DD/MM/YYYY - HH:mm');
            }
            return '';
          },
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
        {
          id: 'Estatus',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Estatus" />
          ),
          accessorFn: (row) => translatedStatuses[row.deliveryStatus as string],
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
        {
          id: 'Acciones',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Acciones" />
          ),
          cell: ({ cell }) => {
            return (
              <div className="flex gap-2">
                <Button variant="outline" size={"sm"}>
                  Ver detalles
                </Button>
                <Button
                  variant="outline"
                  size={"sm"}
                  disabled={!cell.row.original.receiptUrl}
                  onClick={() => window.open(cell.row.original.receiptUrl as string, '_blank')}
                >
                  Ver recibo
                </Button>
              </div>
            )
          },
          enableGlobalFilter: true,
          enableSorting: true,
          filterFn: "auto",
          enableColumnFilter: true,
          sortingFn: "textCaseSensitive",
        },
      ] satisfies ColumnDef<Order>[],
    []
  );

  const table = useReactTable({
    data: orders,
    columns,
    getRowId(originalRow) {
      return originalRow._id || '';
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
      <DataTable
        table={table}
        columns={columns}
        className="w-full"
        isLoading={ordersQuery.isLoading}
      />
    </div>
  )
}

export default AdminOrdersPage