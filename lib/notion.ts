import { Client } from '@notionhq/client';

// Initialize the Notion client
// You will need to add your NOTION_API_KEY to your .env.local file
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const getProjects = async (databaseId: string) => {
  if (!databaseId) return [];
  
  const response = await notion.databases.query({
    database_id: databaseId,
    // Add sorting or filtering here if needed
  });

  return response.results;
};
