import type { Meta, StoryObj } from "@storybook/react";
import { EducationDisplay } from "@/components/resume/EducationSection/EducationDisplay";
import { mockEducation } from "@/lib/mock-data";
import type { Education } from "@/types";

const meta = {
  title: "Resume/Sub-Components/EducationDisplay",
  component: EducationDisplay,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Education display component showing educational background entries.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EducationDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default Education",
  args: {
    educations: mockEducation,
    isEditing: false,
    onEditEducation: () => console.log('Edit education'),
  },
};

export const MultipleEducation: Story = {
  name: "Multiple Education Entries",
  args: {
    educations: [
      ...mockEducation,
      {
        id: 2,
        schoolName: "Stanford University",
        schoolCity: "Stanford",
        schoolState: "CA",
        degreeType: "Master of Science",
        degreeTitle: "Computer Science",
        dateStarted: new Date("2016-09-01"),
        dateFinished: new Date("2018-06-15"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: 3,
        schoolName: "Community College",
        schoolCity: "San Jose",
        schoolState: "CA",
        degreeType: "Associate Degree",
        degreeTitle: "Mathematics",
        dateStarted: new Date("2010-09-01"),
        dateFinished: new Date("2012-05-15"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ] as Education[],
    isEditing: false,
    onEditEducation: () => console.log('Edit education'),
  },
};

export const CurrentEducation: Story = {
  name: "Current Education",
  args: {
    educations: [
      {
        ...mockEducation[0],
        degreeType: "PhD",
        degreeTitle: "Machine Learning",
        dateStarted: new Date("2022-09-01"),
        dateFinished: null, // Still in progress
      },
    ] as Education[],
    isEditing: false,
    onEditEducation: () => console.log('Edit education'),
  },
};

export const OnlineEducation: Story = {
  name: "Online Education",
  args: {
    educations: [
      {
        id: 1,
        schoolName: "MIT OpenCourseWare",
        schoolCity: "Online",
        schoolState: "",
        degreeType: "Certificate",
        degreeTitle: "Artificial Intelligence",
        dateStarted: new Date("2023-01-01"),
        dateFinished: new Date("2023-06-01"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ] as Education[],
    isEditing: false,
    onEditEducation: () => console.log('Edit education'),
  },
};

export const EmptyEducation: Story = {
  name: "No Education",
  args: {
    educations: [],
    isEditing: false,
    onEditEducation: () => console.log('Edit education'),
  },
};
