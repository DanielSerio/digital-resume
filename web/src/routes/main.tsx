import { createFileRoute } from "@tanstack/react-router";
import {
  ContactSection,
  SummarySection,
  SkillsSection,
  EducationSection,
  WorkExperienceSection,
} from "@/components/resume";
import { Page } from "@/components/common";

export const Route = createFileRoute("/main")({
  component: MainResumePage,
});

function MainResumePage() {
  return (
    <Page className="space-y-6">
      <ContactSection />
      <SummarySection />
      <SkillsSection />
      <WorkExperienceSection />
      <EducationSection />
    </Page>
  );
}
