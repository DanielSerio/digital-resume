# Objective

The objective of this application is to provide a way for a user to manage their resume. The resume has 5 main sections:

- Header/Contact info
  - Name
  - Title
  - Email
  - Phone
  - GitHub
  - Website
  - Linkedin
- Professional Summary
- Technical Skills
  - name
  - category (such as Back-end, Front-end, Project Management, Methodology, etc)
  - subcategory (such as Language, Framework, Library, Tool, Platform, Database, Methodology, Concept, etc) - any category can pair with any subcategory
- Education
  - School name
  - School city
  - School state/province
  - Degree Type (BFA, MBA, etc)
  - Degree Title (Graphic Design, etc)
  - Date Started
  - Date finished (nullable in the case that we are still in school)
- Work Experience
  - Company Name
  - Company Tagline
  - Company city
  - Company state/province
  - Job Title
  - Experience Lines (one to many relationship to a table with "work experience lines". These are the lines that describe what was accomplished at this job.)
    - markdown text (the lines actual text)
    - line ID (integer. will be used for sorting the lines)
