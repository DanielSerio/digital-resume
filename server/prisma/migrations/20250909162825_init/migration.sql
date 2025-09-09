-- CreateTable
CREATE TABLE "contacts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "github" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "professional_summaries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "summary_text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "skill_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "skill_subcategories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "technical_skills" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "subcategory_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "technical_skills_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "skill_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "technical_skills_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "skill_subcategories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "education" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "school_name" TEXT NOT NULL,
    "school_city" TEXT NOT NULL,
    "school_state" TEXT NOT NULL,
    "degree_type" TEXT NOT NULL,
    "degree_title" TEXT NOT NULL,
    "date_started" DATETIME NOT NULL,
    "date_finished" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "work_experiences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company_name" TEXT NOT NULL,
    "company_tagline" TEXT,
    "company_city" TEXT NOT NULL,
    "company_state" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "date_started" DATETIME NOT NULL,
    "date_ended" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "work_experience_lines" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "work_experience_id" INTEGER NOT NULL,
    "line_text" TEXT NOT NULL,
    "line_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "work_experience_lines_work_experience_id_fkey" FOREIGN KEY ("work_experience_id") REFERENCES "work_experiences" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scoped_resumes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "scoped_professional_summaries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scoped_resume_id" INTEGER NOT NULL,
    "summary_text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "scoped_professional_summaries_scoped_resume_id_fkey" FOREIGN KEY ("scoped_resume_id") REFERENCES "scoped_resumes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scoped_skills" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scoped_resume_id" INTEGER NOT NULL,
    "technical_skill_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "scoped_skills_scoped_resume_id_fkey" FOREIGN KEY ("scoped_resume_id") REFERENCES "scoped_resumes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scoped_skills_technical_skill_id_fkey" FOREIGN KEY ("technical_skill_id") REFERENCES "technical_skills" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scoped_work_experiences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scoped_resume_id" INTEGER NOT NULL,
    "work_experience_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "scoped_work_experiences_scoped_resume_id_fkey" FOREIGN KEY ("scoped_resume_id") REFERENCES "scoped_resumes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scoped_work_experiences_work_experience_id_fkey" FOREIGN KEY ("work_experience_id") REFERENCES "work_experiences" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scoped_work_experience_lines" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scoped_resume_id" INTEGER NOT NULL,
    "work_experience_line_id" INTEGER NOT NULL,
    "line_text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "scoped_work_experience_lines_scoped_resume_id_fkey" FOREIGN KEY ("scoped_resume_id") REFERENCES "scoped_resumes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scoped_work_experience_lines_work_experience_line_id_fkey" FOREIGN KEY ("work_experience_line_id") REFERENCES "work_experience_lines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "skill_categories_name_key" ON "skill_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_subcategories_name_key" ON "skill_subcategories"("name");
