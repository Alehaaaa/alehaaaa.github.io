const dataModules = import.meta.glob('./*/data.js', { eager: true });
const blogModules = import.meta.glob('./*/blog.mdx', { eager: true });

// Parse "YYYY-MM" into a sortable score (year * 12 + month)
const getTimelineScore = (ym) => {
  if (!ym) return 0;
  const [year, month] = ym.split('-').map(Number);
  return year * 12 + (month - 1);
};

// Sort function: newest projects first.
// If both have end dates, sort by end date descending.
// If one has no end date (future/currently), sort it to the top.
// If it's a tie, compare start dates descending.
const sortProjects = (a, b) => {
  const aEnd = a.timeline?.end ? getTimelineScore(a.timeline.end) : Infinity;
  const bEnd = b.timeline?.end ? getTimelineScore(b.timeline.end) : Infinity;

  if (aEnd !== bEnd) {
    return bEnd - aEnd;
  }

  const aStart = a.timeline?.start ? getTimelineScore(a.timeline.start) : 0;
  const bStart = b.timeline?.start ? getTimelineScore(b.timeline.start) : 0;

  return bStart - aStart;
};

export const projects = Object.keys(dataModules)
  .map((filePath) => {
    // Extract folder name as slug (e.g. "./the-sheep-detectives/data.js" -> "the-sheep-detectives")
    const folderName = filePath.split('/')[1];
    
    const data = dataModules[filePath].default;
    const blogPath = `./${folderName}/blog.mdx`;
    const blog = blogModules[blogPath] ? blogModules[blogPath].default : null;
    const frontmatter = blogModules[blogPath]?.frontmatter || {};
    const hasBlog = Boolean(blog);

    return {
      ...data,
      slug: folderName, // slug is programmatically determined by the folder name!
      detail: hasBlog ? {
        subtitle: frontmatter.subtitle,
        experienceTitle: frontmatter.title,
        Content: blog
      } : null
    };
  })
  .sort(sortProjects);

export default projects;
