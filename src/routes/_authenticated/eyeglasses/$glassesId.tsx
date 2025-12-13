import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGlasses, deleteGlasses, historyGlasses } from "@/api/glasses";
import { Badge } from "@/components/ui/badge";
import type { GlassesHistory } from "@/types/glasses";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import EditGlassesModal from "@/components/modals/EditGlassesModal";
import { toast } from "sonner";
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
import { DataTable } from "@/components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDate } from "../../../lib/helpers";

export const Route = createFileRoute("/_authenticated/eyeglasses/$glassesId")({
  component: GlassesDescription,
});

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "tersedia":
    case "available":
      return "bg-green-100 text-green-800";
    case "terjual":
    case "sold":
      return "bg-blue-100 text-blue-800";
    case "rusak":
    case "damaged":
      return "bg-red-100 text-red-800";
    case "terpinjam":
    case "borrowed":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function GlassesDescription() {
  const { glassesId } = useParams({
    from: "/_authenticated/eyeglasses/$glassesId",
  });
  const id = Number(glassesId);
  const queryClient = useQueryClient();

  // 🔹 Fetch current glasses
  const { data, isLoading, isError } = useQuery({
    queryKey: ["glasses", id],
    queryFn: () => getGlasses(id),
    enabled: !!id,
  });

  const { data: history } = useQuery<GlassesHistory[]>({
    queryKey: ["history", id],
    queryFn: () => historyGlasses(id),
  });
  console.log(history);
  const historyData: GlassesHistory[] = history ?? [];

  const columnHelper = createColumnHelper<GlassesHistory>();
  const columns = [
    columnHelper.accessor("id", { header: () => "ID" }),
    columnHelper.accessor("statusChange", { header: () => "Status" }),
    columnHelper.accessor("userName", { header: () => "User" }),
    columnHelper.accessor("createdAt", {
      header: () => "Time",
      cell: (info) => (info.getValue() ? formatDate(info.getValue()) : ""),
    }),
  ];

  // 🔹 Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteGlasses(id),
    onSuccess: () => {
      toast.success("Glasses deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["glasses"] });
      window.location.href = "/eyeglasses"; // redirect back to list
    },
    onError: () => toast.error("Failed to delete glasses"),
  });

  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <p className="p-6 text-muted-foreground">Loading...</p>;
  if (isError || !data)
    return <p className="p-6 text-destructive">Failed to load glasses data.</p>;

  const glasses = data;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border">
        <div className="px-4 mx-auto py-2">
          <div className="flex flex-row justify-between">
            <Link to="/eyeglasses">
              <Button variant="ghost" size="sm">
                <ArrowLeft />
                Back
              </Button>
            </Link>

            <div className="flex gap-2 mb-2">
              {/* ✏️ Edit */}
              <Button
                className="bg-orange-400 hover:bg-orange-500"
                size="sm"
                onClick={() => {
                  console.log("edittt");
                  setEditOpen(true);
                }}
              >
                <Edit />
                Edit
              </Button>

              {/* 🗑️ Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Glasses</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete <b>{glasses.name}</b>?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => deleteMutation.mutate()}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-foreground mb-2">
                {glasses.name}
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                {glasses.type}
              </p>
            </div>
            <Badge
              className={`${getStatusColor(
                glasses.status
              )} text-base px-4 py-2 h-fit`}
            >
              {glasses.status.charAt(0).toUpperCase() + glasses.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 mx-auto w-full py-12">
        <div className="space-y-12">
          {/* Description */}
          {glasses.description && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Description
              </p>
              <p className="text-lg text-foreground leading-relaxed text-pretty">
                {glasses.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Brand
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {glasses.brand}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Company
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {glasses.company}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Drawer
              </p>
              <p className="text-2xl font-mono font-semibold text-foreground">
                {glasses.drawer}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                RFID Tag
              </p>
              <p className="text-2xl font-mono font-semibold text-foreground">
                {glasses.rfid || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Color
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                  style={{ backgroundColor: glasses.color }}
                />
                <p className="text-lg font-mono font-semibold text-foreground">
                  {glasses.color}
                </p>
              </div>
            </div>
          </div>
          <DataTable<GlassesHistory, any>
            columns={columns}
            data={historyData}
          />

          {/* Meta Info */}
          <div className="pt-8 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Metadata
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="text-foreground font-mono font-semibold">
                  {new Date(glasses.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <p className="text-foreground font-mono font-semibold">
                  {new Date(glasses.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">ID:</span>
                <p className="text-foreground font-mono font-semibold">
                  #{glasses.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditGlassesModal
        open={editOpen}
        onOpenChange={setEditOpen}
        data={glasses}
      />
    </div>
  );
}

export default GlassesDescription;
