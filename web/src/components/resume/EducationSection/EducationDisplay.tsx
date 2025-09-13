import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { Education } from "@/types";

interface EducationDisplayProps {
  educations: Education[];
  isEditing: boolean;
  onEditEducation: (education: Education) => void;
}

export const EducationDisplay: React.FC<EducationDisplayProps> = ({
  educations,
  isEditing,
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
    <div className="space-y-4" data-testid="education-list">
      {educations.map((education) => (
        <div key={education.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-semibold">{education.schoolName}</h4>
              <p className="text-sm text-muted-foreground">
                {education.schoolCity}, {education.schoolState}
              </p>
              <div className="text-sm">
                <p>
                  {education.degreeType} in {education.degreeTitle}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {education.dateStarted && education.dateFinished ? (
                  <p>
                    {format(new Date(education.dateStarted), "MMM yyyy")} -{" "}
                    {format(new Date(education.dateFinished), "MMM yyyy")}
                  </p>
                ) : education.dateStarted ? (
                  <p>
                    {format(new Date(education.dateStarted), "MMM yyyy")} -
                    Present
                  </p>
                ) : null}
              </div>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditEducation(education)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};