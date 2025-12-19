import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { SearchIcon, Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { DataTable } from "@/components/DataTable";

export const Route = createFileRoute("/_authenticated/organization")({
  component: RouteComponent,
});

// Updated User type
type User = {
  id: number;
  name: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
};

function RouteComponent() {
  // Updated dummy data
  const users: User[] = [
    { id: 1, name: "Deswandy", verified: true, createdAt: "2025-11-01", updatedAt: "2025-11-01" },
    { id: 2, name: "Pargonda", verified: true, createdAt: "2025-11-01", updatedAt: "2025-11-01" },
    { id: 3, name: "Nabil", verified: true, createdAt: "2025-11-01", updatedAt: "2025-11-01" },
    { id: 4, name: "Emily", verified: false, createdAt: "2025-10-28", updatedAt: "-" },
  ];

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),

    columnHelper.accessor("name", { header: () => "User Name" }),

    columnHelper.accessor("verified", {
      header: () => "Verified",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-green-600 font-medium">Verified</span>
        ) : (
          <span className="text-red-600 font-medium">Not Verified</span>
        ),
    }),

    columnHelper.accessor("createdAt", { header: () => "Created At" }),
    columnHelper.accessor("updatedAt", { header: () => "Updated At" }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-orange-400"
                  onClick={() => setSelected(item)}
                >
                  <Edit className="text-orange-400" />
                  Edit
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="text-red-600" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <b>{item.name}</b>? This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        );
      },
    }),
  ];

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return users.filter((item) =>
      [item.id, item.name, item.verified, item.createdAt, item.updatedAt]
        .map((field) => String(field))
        .some((field) => field.toLowerCase().includes(lower))
    );
  }, [search]);

  return (
    <div className="h-full flex flex-col gap-3 mt-2">
      {/* Search + Add Button */}
      <div className="flex flex-row gap-2 justify-end">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => setSearch("")}>
              Clear
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Button className="bg-primary text-white px-3">
          + Add User
        </Button>
      </div>

      <DataTable<User, any> columns={columns} data={filtered} />

      {selected && (
        <div className="text-center text-sm text-muted-foreground">
          (Pretend edit modal opens for: {selected.name})
        </div>
      )}
    </div>
  );
}
