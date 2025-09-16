import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  useUpdateScopedResume,
  useDeleteScopedResume,
  useDuplicateScopedResume,
} from "@/hooks/useScopedResumeData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScopedResume } from "@/types";

interface ResumeCardProps {
  resume: ScopedResume;
  onResumeSelect?: (resume: ScopedResume) => void;
  onDelete: (resume: ScopedResume) => void;
}

export function ResumeCard({ resume, onResumeSelect, onDelete }: ResumeCardProps) {
  const updateScopedResume = useUpdateScopedResume();
  const duplicateScopedResume = useDuplicateScopedResume();

  const [editingResume, setEditingResume] = useState<ScopedResume | null>(null);
  const [newResumeName, setNewResumeName] = useState("");

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleRenameResume = async () => {
    if (!editingResume || !newResumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    try {
      await updateScopedResume.mutateAsync({
        id: editingResume.id,
        data: { name: newResumeName.trim() },
      });

      // Always update dialog state, only show toast if mounted
      if (isMountedRef.current) {
        toast.success("Resume renamed successfully");
      }
      setEditingResume(null);
      setNewResumeName("");
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to rename resume");
      }
    }
  };

  const handleDuplicateResume = async () => {
    try {
      const result = await duplicateScopedResume.mutateAsync(resume.id);

      // Always trigger navigation, only show toast if mounted
      if (isMountedRef.current) {
        toast.success("Resume duplicated successfully");
      }
      if (onResumeSelect && result) {
        onResumeSelect(result);
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to duplicate resume");
      }
    }
  };

  const startRename = () => {
    setEditingResume(resume);
    setNewResumeName(resume.name);
  };

  return (
    <Card
      className="transition-shadow hover:shadow-md"
      data-testid={`resume-card-${resume.id}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle
              className="text-base"
              data-testid={`resume-title-${resume.id}`}
            >
              {resume.name}
            </CardTitle>
            <CardDescription>
              Created {new Date(resume.createdAt).toLocaleDateString()}
              {resume.updatedAt !== resume.createdAt && (
                <span>
                  {" "}
                  • Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </span>
              )}
            </CardDescription>
          </div>
          <Badge variant="secondary">Scoped</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            data-testid={`view-edit-button-${resume.id}`}
            onClick={() => onResumeSelect?.(resume)}
          >
            View/Edit
          </Button>

          <Dialog
            open={editingResume?.id === resume.id}
            onOpenChange={(open) => !open && setEditingResume(null)}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={startRename}>
                Rename
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Resume</DialogTitle>
                <DialogDescription>
                  Change the name of "{resume.name}"
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rename-input">Resume Name</Label>
                  <Input
                    id="rename-input"
                    value={newResumeName}
                    onChange={(e) => setNewResumeName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRenameResume()}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingResume(null);
                    setNewResumeName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRenameResume}
                  disabled={updateScopedResume.isPending}
                >
                  {updateScopedResume.isPending ? "Renaming..." : "Rename"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicateResume}
            disabled={duplicateScopedResume.isPending}
          >
            {duplicateScopedResume.isPending ? "Duplicating..." : "Duplicate"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(resume)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}