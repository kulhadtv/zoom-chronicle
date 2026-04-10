const fs = require('fs');

function cleanContent(content) {
  if (!content) return '';
  return content
    .replace(/<!--.*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

const raw = JSON.parse(fs.readFileSync('./raw.json', 'utf-8'));
const posts = raw.data;

const cleanData = posts.map(post => ({
  title: post.post_title,
  content: cleanContent(post.post_content),
  slug: post.post_name,
  createdAt: new Date(post.post_date),
  updatedAt: new Date(post.post_modified)
}));

fs.writeFileSync('./clean-data.json', JSON.stringify(cleanData, null, 2));
console.log(`✓ Done: ${cleanData.length} documents`);
