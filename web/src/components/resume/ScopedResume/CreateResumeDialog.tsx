import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useCreateScopedResume } from "@/hooks/useScopedResumeData";
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
import type { ScopedResume } from "@/types";

interface CreateResumeDialogProps {
  onResumeSelect?: (resume: ScopedResume) => void;
}

export function CreateResumeDialog({ onResumeSelect }: CreateResumeDialogProps) {
  const createScopedResume = useCreateScopedResume();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newResumeName, setNewResumeName] = useState("");
  const [createdResume, setCreatedResume] = useState<ScopedResume | null>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle navigation after dialog closes
  useEffect(() => {
    if (!createDialogOpen && createdResume && onResumeSelect) {
      onResumeSelect(createdResume);
      setCreatedResume(null);
    }
  }, [createDialogOpen, createdResume, onResumeSelect]);

  const handleCreateResume = async () => {
    if (!newResumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    try {
      const result = await createScopedResume.mutateAsync({
        name: newResumeName.trim(),
      });

      // Always update dialog state and trigger navigation, but only show toast if mounted
      if (isMountedRef.current) {
        toast.success("Scoped resume created successfully");
      }

      setNewResumeName("");
      setCreatedResume(result); // Store result for navigation after dialog closes
      setCreateDialogOpen(false);
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to create scoped resume");
      }
    }
  };

  return (
    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button data-testid="create-resume-button">Create New Resume</Button>
      </DialogTrigger>
      <DialogContent data-testid="create-resume-dialog">
        <DialogHeader>
          <DialogTitle>Create Scoped Resume</DialogTitle>
          <DialogDescription>
            Create a new scoped resume variation. You can filter and customize
            content without affecting your main resume.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="resume-name">Resume Name</Label>
            <Input
              id="resume-name"
              data-testid="resume-name-input"
              placeholder="e.g., Frontend Developer Role"
              value={newResumeName}
              onChange={(e) => setNewResumeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateResume()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-testid="create-resume-cancel-button"
            onClick={() => {
              setCreateDialogOpen(false);
              setNewResumeName("");
            }}
          >
            Cancel
          </Button>
          <Button
            data-testid="create-resume-submit-button"
            onClick={handleCreateResume}
            disabled={createScopedResume.isPending}
          >
            {createScopedResume.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}