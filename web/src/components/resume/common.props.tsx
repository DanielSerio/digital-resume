import type { PropsWithChildren } from "react";

export interface EditableSectionControlProps extends PropsWithChildren {
  isEditing?: boolean;
  fieldId: string;
}
