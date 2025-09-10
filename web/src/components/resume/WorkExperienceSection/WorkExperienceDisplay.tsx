import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import type { WorkExperience } from "@/types";

interface WorkExperienceDisplayProps {
  workExperiences: WorkExperience[];
  isEditing?: boolean;
  onEditWorkExperience: (workExperience: WorkExperience) => void;
}

export const WorkExperienceDisplay: React.FC<WorkExperienceDisplayProps> = ({
  workExperiences,
  isEditing,
  onEditWorkExperience,
}) => {
  if (workExperiences.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No work experience entries added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {workExperiences.map((experience) => (
        <div key={experience.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h4 className="font-semibold">{experience.jobTitle}</h4>
              <p className="text-muted-foreground">{experience.companyName}</p>
              {(experience.location || experience.companyCity) && (
                <p className="text-sm text-muted-foreground">
                  {experience.location ||
                    `${experience.companyCity}${experience.companyState ? `, ${experience.companyState}` : ""}`}
                </p>
              )}
              <div className="text-sm text-muted-foreground">
                {(experience.startDate || experience.dateStarted) && (
                  <p>
                    {format(
                      new Date(experience.startDate || experience.dateStarted!),
                      "MMM yyyy"
                    )}{" "}
                    -{" "}
                    {!experience.endDate && !experience.dateEnded
                      ? "Present"
                      : experience.endDate || experience.dateEnded
                        ? format(
                            new Date(
                              experience.endDate || experience.dateEnded!
                            ),
                            "MMM yyyy"
                          )
                        : "Present"}
                  </p>
                )}
              </div>
              {experience.workExperienceLines &&
                experience.workExperienceLines.length > 0 && (
                  <div className="mt-3">
                    <ul className="text-sm space-y-1">
                      {experience.workExperienceLines.map((line) => (
                        <li key={line.id} className="flex items-start gap-2">
                          <span className="text-muted-foreground mt-1.5">
                            •
                          </span>
                          <span>{line.lineText}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditWorkExperience(experience)}
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