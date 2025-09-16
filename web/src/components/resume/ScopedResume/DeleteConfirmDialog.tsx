import { useRef, useEffect } from "react";
import { toast } from "sonner";
import { useDeleteScopedResume } from "@/hooks/useScopedResumeData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ScopedResume } from "@/types";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeToDelete: ScopedResume | null;
  onDeleted: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  resumeToDelete,
  onDeleted,
}: DeleteConfirmDialogProps) {
  const deleteScopedResume = useDeleteScopedResume();

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;

    try {
      await deleteScopedResume.mutateAsync(resumeToDelete.id);

      // Always update dialog state, only show toast if mounted
      if (isMountedRef.current) {
        toast.success("Resume deleted successfully");
      }
      onDeleted();
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to delete resume");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resume</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{resumeToDelete?.name}"? This
            action cannot be undone. All customizations for this scoped resume
            will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Alert>
            <AlertDescription>
              This will permanently delete the scoped resume and all its
              customizations.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteResume}
            disabled={deleteScopedResume.isPending}
          >
            {deleteScopedResume.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}