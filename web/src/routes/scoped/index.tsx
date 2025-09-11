import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ScopedResumeManager } from "@/components/resume";
import { Page } from "@/components/common";
import { apiClient } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScopedResume } from "@/types";

// Search params for selected scoped resume
interface ScopedSearchParams {
  resumeId?: string;
}

export const Route = createFileRoute("/scoped/")({
  validateSearch: (search: Record<string, unknown>): ScopedSearchParams => {
    return {
      resumeId: search.resumeId as string,
    };
  },
  loader: async () => {
    try {
      // Fetch scoped resumes using native API client (not TanStack Query)
      const scopedResumes =
        await apiClient.get<ScopedResume[]>("/scoped-resumes");
      return {
        scopedResumes,
      };
    } catch (error) {
      console.error("Failed to load scoped resumes in route loader:", error);
      return {
        scopedResumes: [] as ScopedResume[],
      };
    }
  },
  component: ScopedResumeComponent,
});

function ScopedResumeComponent() {
  const { resumeId } = Route.useSearch();
  const { scopedResumes } = Route.useLoaderData();
  const navigate = useNavigate();

  // Find the currently selected scoped resume
  const selectedResume = resumeId
    ? scopedResumes.find((r) => r.id.toString() === resumeId) || null
    : null;

  const handleResumeSelect = (resume: ScopedResume) => {
    // Navigate with the selected resume ID in URL
    navigate({
      to: "/scoped",
      search: { resumeId: resume.id.toString() },
      replace: true,
    });
  };

  const handleSelectorChange = (value: string) => {
    navigate({
      to: "/scoped",
      search: value === "" ? {} : { resumeId: value },
      replace: true,
    });
  };

  return (
    <Page className="space-y-6">
      {/* Scoped Resume Selector */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-sm">Select Scoped Resume:</label>
        <Select
          value={resumeId || ""}
          onValueChange={handleSelectorChange}
          disabled={scopedResumes.length === 0}
        >
          <SelectTrigger className="w-64">
            <SelectValue
              placeholder={
                scopedResumes.length === 0
                  ? "No scoped resumes"
                  : "Select a scoped resume"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {scopedResumes.length > 0 && (
              <SelectItem value="null">None (show all data)</SelectItem>
            )}
            {scopedResumes.map((resume) => (
              <SelectItem key={resume.id} value={resume.id.toString()}>
                {resume.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display current selection info */}
      {selectedResume && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">
            Currently viewing: {selectedResume.name}
          </h3>
          <p className="text-sm text-blue-700">
            This scoped resume filters and customizes your main resume data.
          </p>
        </div>
      )}

      <ScopedResumeManager onResumeSelect={handleResumeSelect} />
    </Page>
  );
}
