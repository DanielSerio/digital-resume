import React from "react";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LineEntryFormProps {
  index: number;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  register: any;
  errors: any;
}

export const LineEntryForm: React.FC<LineEntryFormProps> = ({
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  register,
  errors,
}) => {
  return (
    <div className="flex gap-2 items-start" data-testid={`work-exp-line-${index}`}>
      <div className="flex-shrink-0 flex flex-col pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-testid={`line-move-up-${index}`}
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-testid={`line-move-down-${index}`}
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex-1">
        <Textarea
          {...register(`lines.${index}.lineText`)}
          data-testid={`line-textarea-${index}`}
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
        data-testid={`line-remove-${index}`}
        onClick={onRemove}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};