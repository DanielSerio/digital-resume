import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  useScopedResumesData,
  useCreateScopedResume,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScopedResume } from "@/types";

interface ScopedResumeManagerProps {
  onResumeSelect?: (resume: ScopedResume) => void;
}

export function ScopedResumeManager({ onResumeSelect }: ScopedResumeManagerProps) {
  const { data: scopedResumes = [], isLoading } = useScopedResumesData();
  const createScopedResume = useCreateScopedResume();
  const updateScopedResume = useUpdateScopedResume();
  const deleteScopedResume = useDeleteScopedResume();
  const duplicateScopedResume = useDuplicateScopedResume();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<ScopedResume | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<ScopedResume | null>(null);
  const [newResumeName, setNewResumeName] = useState("");

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleCreateResume = useCallback(async () => {
    if (!newResumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    try {
      const result = await createScopedResume.mutateAsync({ name: newResumeName.trim() });
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        toast.success("Scoped resume created successfully");
        setNewResumeName("");
        setCreateDialogOpen(false);
        if (onResumeSelect && result) {
          onResumeSelect(result);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to create scoped resume");
      }
    }
  }, [newResumeName, createScopedResume, onResumeSelect]);

  const handleRenameResume = useCallback(async () => {
    if (!editingResume || !newResumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }

    try {
      await updateScopedResume.mutateAsync({ 
        id: editingResume.id, 
        data: { name: newResumeName.trim() } 
      });
      
      if (isMountedRef.current) {
        toast.success("Resume renamed successfully");
        setEditingResume(null);
        setNewResumeName("");
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to rename resume");
      }
    }
  }, [editingResume, newResumeName, updateScopedResume]);

  const handleDeleteResume = useCallback(async () => {
    if (!resumeToDelete) return;
    
    try {
      await deleteScopedResume.mutateAsync(resumeToDelete.id);
      
      if (isMountedRef.current) {
        toast.success("Resume deleted successfully");
        setDeleteConfirmOpen(false);
        setResumeToDelete(null);
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to delete resume");
      }
    }
  }, [resumeToDelete, deleteScopedResume]);

  const confirmDelete = useCallback((resume: ScopedResume) => {
    setResumeToDelete(resume);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDuplicateResume = useCallback(async (resume: ScopedResume) => {
    try {
      const result = await duplicateScopedResume.mutateAsync(resume.id);
      
      if (isMountedRef.current) {
        toast.success("Resume duplicated successfully");
        if (onResumeSelect && result) {
          onResumeSelect(result);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error("Failed to duplicate resume");
      }
    }
  }, [duplicateScopedResume, onResumeSelect]);

  const startRename = useCallback((resume: ScopedResume) => {
    setEditingResume(resume);
    setNewResumeName(resume.name);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Manage Scoped Resumes</h2>
          <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Manage Scoped Resumes</h2>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Resume</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Scoped Resume</DialogTitle>
              <DialogDescription>
                Create a new scoped resume variation. You can filter and customize content 
                without affecting your main resume.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="resume-name">Resume Name</Label>
                <Input
                  id="resume-name"
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
                onClick={() => {
                  setCreateDialogOpen(false);
                  setNewResumeName("");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateResume} 
                disabled={createScopedResume.isPending}
              >
                {createScopedResume.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {scopedResumes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Scoped Resumes</CardTitle>
            <CardDescription>
              Create your first scoped resume to start customizing content for specific roles or purposes.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scopedResumes.map((resume) => (
            <Card key={resume.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{resume.name}</CardTitle>
                    <CardDescription>
                      Created {new Date(resume.createdAt).toLocaleDateString()}
                      {resume.updatedAt !== resume.createdAt && (
                        <span> • Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
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
                    onClick={() => onResumeSelect?.(resume)}
                  >
                    View/Edit
                  </Button>
                  
                  <Dialog 
                    open={editingResume?.id === resume.id} 
                    onOpenChange={(open) => !open && setEditingResume(null)}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startRename(resume)}
                      >
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
                    onClick={() => handleDuplicateResume(resume)}
                    disabled={duplicateScopedResume.isPending}
                  >
                    {duplicateScopedResume.isPending ? "Duplicating..." : "Duplicate"}
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => confirmDelete(resume)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{resumeToDelete?.name}"? This action cannot be undone.
              All customizations for this scoped resume will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <AlertDescription>
                This will permanently delete the scoped resume and all its customizations.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteConfirmOpen(false);
                setResumeToDelete(null);
              }}
            >
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
    </div>
  );
}