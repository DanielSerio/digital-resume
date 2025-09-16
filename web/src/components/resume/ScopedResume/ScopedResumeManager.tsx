import { useState, useCallback } from "react";
import { useScopedResumesData } from "@/hooks/useScopedResumeData";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateResumeDialog } from "./CreateResumeDialog";
import { ResumeCard } from "./ResumeCard";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import type { ScopedResume } from "@/types";

interface ScopedResumeManagerProps {
  onResumeSelect?: (resume: ScopedResume) => void;
}

export function ScopedResumeManager({ onResumeSelect }: ScopedResumeManagerProps) {
  const { data: scopedResumes = [], isLoading } = useScopedResumesData();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<ScopedResume | null>(null);

  const confirmDelete = useCallback((resume: ScopedResume) => {
    setResumeToDelete(resume);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleted = useCallback(() => {
    setDeleteConfirmOpen(false);
    setResumeToDelete(null);
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
            <div
              key={i}
              className="h-32 bg-muted animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="scoped-resume-manager">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold" data-testid="manage-resumes-title">
          Manage Scoped Resumes
        </h2>
        <CreateResumeDialog onResumeSelect={onResumeSelect} />
      </div>

      {scopedResumes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Scoped Resumes</CardTitle>
            <CardDescription>
              Create your first scoped resume to start customizing content for
              specific roles or purposes.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4" data-testid="resume-cards-container">
          {scopedResumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onResumeSelect={onResumeSelect}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        resumeToDelete={resumeToDelete}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
