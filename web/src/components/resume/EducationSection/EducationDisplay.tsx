import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Education } from "@/types";

interface EducationDisplayProps {
  educations: Education[];
  onEditEducation: (education: Education) => void;
}

export const EducationDisplay: React.FC<EducationDisplayProps> = ({
  educations,
  onEditEducation,
}) => {
  if (educations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No education entries added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educations.map((education) => (
        <div key={education.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-semibold">{education.schoolName}</h4>
              {education.location && (
                <p className="text-sm text-muted-foreground">
                  {education.location}
                </p>
              )}
              <div className="text-sm">
                {education.degree && education.fieldOfStudy ? (
                  <p>
                    {education.degree} in {education.fieldOfStudy}
                  </p>
                ) : education.degree ? (
                  <p>{education.degree}</p>
                ) : education.fieldOfStudy ? (
                  <p>{education.fieldOfStudy}</p>
                ) : null}
              </div>
              <div className="text-sm text-muted-foreground">
                {education.startDate && education.endDate ? (
                  <p>
                    {format(new Date(education.startDate), "MMM yyyy")} -{" "}
                    {format(new Date(education.endDate), "MMM yyyy")}
                  </p>
                ) : education.startDate ? (
                  <p>
                    {format(new Date(education.startDate), "MMM yyyy")} -
                    Present
                  </p>
                ) : null}
              </div>
              {education.gpa && <p className="text-sm">GPA: {education.gpa}</p>}
              {education.honors && (
                <p className="text-sm italic">{education.honors}</p>
              )}
              {education.relevantCoursework && (
                <p className="text-sm mt-2">{education.relevantCoursework}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditEducation(education)}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};