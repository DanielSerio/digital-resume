import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ScopedResumeManager,
  ScopedSummarySection,
  ScopedSkillsSection,
  ScopedWorkExperienceSection,
  ContactSection,
  EducationSection
} from "@/components/resume";
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
      <div className="flex items-center gap-4" data-testid="scoped-resume-selector">
        <label className="font-medium text-sm" data-testid="resume-selector-label">Select Scoped Resume:</label>
        <Select
          value={resumeId || ""}
          onValueChange={handleSelectorChange}
          disabled={scopedResumes.length === 0}
        >
          <SelectTrigger className="w-64" data-testid="resume-selector-trigger">
            <SelectValue
              placeholder={
                scopedResumes.length === 0
                  ? "No scoped resumes"
                  : "Select a scoped resume"
              }
            />
          </SelectTrigger>
          <SelectContent data-testid="resume-selector-content">
            {scopedResumes.length > 0 && (
              <SelectItem value="null">None (show all data)</SelectItem>
            )}
            {scopedResumes.map((resume) => (
              <SelectItem key={resume.id} value={resume.id.toString()} data-testid={`resume-option-${resume.id}`}>
                {resume.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display current selection info */}
      {selectedResume && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid="current-selection-info">
          <h3 className="font-medium text-blue-900" data-testid="current-selection-title">
            Currently viewing: {selectedResume.name}
          </h3>
          <p className="text-sm text-blue-700">
            This scoped resume filters and customizes your main resume data.
          </p>
        </div>
      )}

      {/* Show editing interface when a resume is selected, otherwise show management */}
      {selectedResume ? (
        <div className="space-y-6">
          {/* Mirror main resume layout exactly */}
          <ContactSection />
          <ScopedSummarySection scopedResumeId={selectedResume.id} />
          <ScopedSkillsSection scopedResumeId={selectedResume.id} />
          <ScopedWorkExperienceSection scopedResumeId={selectedResume.id} />
          <EducationSection />
        </div>
      ) : (
        <ScopedResumeManager onResumeSelect={handleResumeSelect} />
      )}
    </Page>
  );
}
