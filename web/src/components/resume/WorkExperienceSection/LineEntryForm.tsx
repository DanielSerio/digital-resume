import React from "react";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LineEntryFormProps {
  index: number;
  onRemove: () => void;
  register: any;
  errors: any;
}

export const LineEntryForm: React.FC<LineEntryFormProps> = ({
  index,
  onRemove,
  register,
  errors,
}) => {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-shrink-0 pt-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <Textarea
          {...register(`lines.${index}.lineText`)}
          placeholder="Describe an accomplishment or responsibility..."
          className={cn(
            "min-h-[60px] resize-y",
            errors?.lines?.[index]?.lineText && "border-red-500"
          )}
        />
        {errors?.lines?.[index]?.lineText && (
          <p className="text-xs text-red-600 mt-1">
            {errors.lines[index].lineText.message}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};