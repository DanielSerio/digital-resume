import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data in reverse order of dependencies
  await prisma.scopedWorkExperienceLine.deleteMany();
  await prisma.scopedWorkExperience.deleteMany();
  await prisma.scopedSkill.deleteMany();
  await prisma.scopedProfessionalSummary.deleteMany();
  await prisma.scopedResume.deleteMany();
  await prisma.workExperienceLine.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.technicalSkill.deleteMany();
  await prisma.skillSubcategory.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.professionalSummary.deleteMany();
  await prisma.contact.deleteMany();

  // Seed Contact Information
  const contact = await prisma.contact.create({
    data: {
      name: 'John Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
    },
  });

  // Seed Professional Summary
  const professionalSummary = await prisma.professionalSummary.create({
    data: {
      summaryText: 'Experienced full-stack developer with 8+ years building scalable web applications. Specializes in React, Node.js, and cloud architecture with a proven track record of leading development teams and delivering high-performance solutions. Strong background in microservices, API design, and modern DevOps practices.',
    },
  });

  // Seed Skill Categories
  const frontendCategory = await prisma.skillCategory.create({
    data: { name: 'Frontend' },
  });

  const backendCategory = await prisma.skillCategory.create({
    data: { name: 'Backend' },
  });

  const databaseCategory = await prisma.skillCategory.create({
    data: { name: 'Database' },
  });

  const cloudCategory = await prisma.skillCategory.create({
    data: { name: 'Cloud & Infrastructure' },
  });

  const toolsCategory = await prisma.skillCategory.create({
    data: { name: 'Tools & Platforms' },
  });

  const methodologyCategory = await prisma.skillCategory.create({
    data: { name: 'Methodology' },
  });

  // Seed Skill Subcategories
  const frameworkSubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Framework' },
  });

  const languageSubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Language' },
  });

  const librarySubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Library' },
  });

  const toolSubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Tool' },
  });

  const platformSubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Platform' },
  });

  const databaseSubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Database' },
  });

  const methodologySubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Methodology' },
  });

  const conceptSubcategory = await prisma.skillSubcategory.create({
    data: { name: 'Concept' },
  });

  // Seed Technical Skills
  const skills = [
    // Frontend Skills
    { name: 'React', categoryId: frontendCategory.id, subcategoryId: frameworkSubcategory.id },
    { name: 'Vue.js', categoryId: frontendCategory.id, subcategoryId: frameworkSubcategory.id },
    { name: 'TypeScript', categoryId: frontendCategory.id, subcategoryId: languageSubcategory.id },
    { name: 'JavaScript', categoryId: frontendCategory.id, subcategoryId: languageSubcategory.id },
    { name: 'HTML/CSS', categoryId: frontendCategory.id, subcategoryId: languageSubcategory.id },
    { name: 'Tailwind CSS', categoryId: frontendCategory.id, subcategoryId: frameworkSubcategory.id },
    
    // Backend Skills
    { name: 'Node.js', categoryId: backendCategory.id, subcategoryId: platformSubcategory.id },
    { name: 'Python', categoryId: backendCategory.id, subcategoryId: languageSubcategory.id },
    { name: 'Express.js', categoryId: backendCategory.id, subcategoryId: frameworkSubcategory.id },
    { name: 'FastAPI', categoryId: backendCategory.id, subcategoryId: frameworkSubcategory.id },
    { name: 'REST APIs', categoryId: backendCategory.id, subcategoryId: conceptSubcategory.id },
    { name: 'GraphQL', categoryId: backendCategory.id, subcategoryId: conceptSubcategory.id },
    
    // Database Skills
    { name: 'PostgreSQL', categoryId: databaseCategory.id, subcategoryId: databaseSubcategory.id },
    { name: 'MongoDB', categoryId: databaseCategory.id, subcategoryId: databaseSubcategory.id },
    { name: 'Redis', categoryId: databaseCategory.id, subcategoryId: databaseSubcategory.id },
    { name: 'Prisma', categoryId: databaseCategory.id, subcategoryId: toolSubcategory.id },
    
    // Cloud & Infrastructure
    { name: 'AWS', categoryId: cloudCategory.id, subcategoryId: platformSubcategory.id },
    { name: 'Docker', categoryId: cloudCategory.id, subcategoryId: toolSubcategory.id },
    { name: 'Kubernetes', categoryId: cloudCategory.id, subcategoryId: toolSubcategory.id },
    { name: 'CI/CD', categoryId: cloudCategory.id, subcategoryId: conceptSubcategory.id },
    
    // Tools & Platforms
    { name: 'Git', categoryId: toolsCategory.id, subcategoryId: toolSubcategory.id },
    { name: 'Webpack', categoryId: toolsCategory.id, subcategoryId: toolSubcategory.id },
    { name: 'Vite', categoryId: toolsCategory.id, subcategoryId: toolSubcategory.id },
    { name: 'Jenkins', categoryId: toolsCategory.id, subcategoryId: toolSubcategory.id },
    { name: 'Figma', categoryId: toolsCategory.id, subcategoryId: toolSubcategory.id },
    
    // Methodology
    { name: 'Agile', categoryId: methodologyCategory.id, subcategoryId: methodologySubcategory.id },
    { name: 'Scrum', categoryId: methodologyCategory.id, subcategoryId: methodologySubcategory.id },
    { name: 'Test-Driven Development', categoryId: methodologyCategory.id, subcategoryId: methodologySubcategory.id },
  ];

  for (const skill of skills) {
    await prisma.technicalSkill.create({
      data: skill,
    });
  }

  // Seed Education
  const education = await prisma.education.create({
    data: {
      schoolName: 'University of Technology',
      schoolCity: 'San Francisco',
      schoolState: 'CA',
      degreeType: 'B.S.',
      degreeTitle: 'Computer Science',
      dateStarted: new Date('2012-09-01'),
      dateFinished: new Date('2016-05-15'),
    },
  });

  // Seed Work Experience
  const currentJob = await prisma.workExperience.create({
    data: {
      companyName: 'Tech Solutions Inc',
      companyTagline: 'Leading web development team',
      companyCity: 'San Francisco',
      companyState: 'CA',
      jobTitle: 'Senior Software Engineer',
      dateStarted: new Date('2020-01-15'),
      dateEnded: null, // Current position
    },
  });

  const previousJob = await prisma.workExperience.create({
    data: {
      companyName: 'StartupCorp',
      companyTagline: 'Full-stack development role',
      companyCity: 'Remote',
      companyState: 'Remote',
      jobTitle: 'Software Engineer',
      dateStarted: new Date('2016-06-01'),
      dateEnded: new Date('2019-12-31'),
    },
  });

  // Seed Work Experience Lines for Current Job
  const currentJobLines = [
    'Led development of microservices architecture reducing system load by 40% and improving response times',
    'Implemented React-based dashboard serving 100k+ daily active users with real-time data visualization',
    'Mentored 5 junior developers and established comprehensive code review processes improving team productivity',
    'Deployed cloud infrastructure using AWS services including ECS, RDS, and CloudFront for scalable applications',
    'Architected and built RESTful APIs serving mobile and web applications with 99.9% uptime',
  ];

  for (let i = 0; i < currentJobLines.length; i++) {
    await prisma.workExperienceLine.create({
      data: {
        workExperienceId: currentJob.id,
        lineText: currentJobLines[i],
        sortOrder: i + 1,
      },
    });
  }

  // Seed Work Experience Lines for Previous Job
  const previousJobLines = [
    'Built customer portal using React and Node.js from ground up, supporting 10k+ registered users',
    'Integrated payment systems (Stripe, PayPal) and third-party APIs for seamless user experience',
    'Developed automated testing suite using Jest and Cypress, reducing bugs by 60%',
    'Optimized database queries and implemented caching strategies improving application performance by 45%',
  ];

  for (let i = 0; i < previousJobLines.length; i++) {
    await prisma.workExperienceLine.create({
      data: {
        workExperienceId: previousJob.id,
        lineText: previousJobLines[i],
        sortOrder: i + 1,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📋 Created:`);
  console.log(`   • ${1} Contact record`);
  console.log(`   • ${1} Professional summary`);
  console.log(`   • ${6} Skill categories`);
  console.log(`   • ${8} Skill subcategories`);
  console.log(`   • ${28} Technical skills`);
  console.log(`   • ${1} Education record`);
  console.log(`   • ${2} Work experiences`);
  console.log(`   • ${9} Work experience lines`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });