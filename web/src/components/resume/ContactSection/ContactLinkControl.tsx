import { Label } from "@/components/ui/label";
import type { EditableSectionControlProps } from "../common.props";

interface ContactLinkControlProps extends EditableSectionControlProps {
  label: string;
  type?: "phone" | "email";
  value: string;
  testId?: string;
}

export function ContactLinkControl({
  isEditing,
  label,
  value,
  type,
  children,
  fieldId,
  testId,
}: ContactLinkControlProps) {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-y-1 mb-2 min-w-[220px]">
        <Label htmlFor={fieldId}>{label}</Label>
        {children}
      </div>
    );
  }

  const href =
    type === "email"
      ? `mailto:${value}`
      : type === "phone"
        ? `tel:${value}`
        : value;

  return (
    <div className="text-sm">
      <span className="font-medium inline-block min-w-[9ch]">{label}: </span>
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        data-testid={testId}
      >
        {value}
      </a>
    </div>
  );
}
