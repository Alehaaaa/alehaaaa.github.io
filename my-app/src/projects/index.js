const dataModules = import.meta.glob('./*/data.js', { eager: true });
const blogModules = import.meta.glob('./*/blog.mdx', { eager: true });

const monthMap = {
  "Jan.": 0, "Feb.": 1, "Mar.": 2, "Apr.": 3, "May": 4, "Jun.": 5,
  "Jul.": 6, "Aug.": 7, "Sep.": 8, "Oct.": 9, "Nov.": 10, "Dec.": 11
};

const getTimelineScore = (timelinePoint) => {
  if (!timelinePoint) return 0;
  const monthVal = monthMap[timelinePoint.month] ?? 0;
  return timelinePoint.year * 12 + monthVal;
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
