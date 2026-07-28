import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export async function GET() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    return NextResponse.json({
      success: false,
      message: 'Notion API Key or Database ID not configured in .env.local',
      projects: [],
    });
  }

  try {
    const notion = new Client({ auth: apiKey });
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const projects = response.results.map((page: any, index: number) => {
      const props = page.properties;

      const titleProp = props.Title || props.title || props.Name || props.name;
      const descProp = props.Description || props.description;
      const githubProp = props.GitHub || props.github || props.Link || props.link;
      const techProp = props.Tech || props.tech;
      const statusProp = props.Status || props.status;
      const imageProp = props.Image || props.image;

      const titleText = titleProp?.title?.[0]?.plain_text || 'Untitled Project';
      const descText = descProp?.rich_text?.[0]?.plain_text || '';
      const githubUrl = githubProp?.url || 'https://github.com/yp2505';
      const techList = techProp?.multi_select?.map((t: any) => t.name) || ['ML', 'Python'];
      const statusVal = statusProp?.select?.name?.toLowerCase() === 'completed' ? 'completed' : 'in-progress';
      const imageUrl = imageProp?.url || '';

      return {
        id: index + 1,
        title: titleText,
        description: descText,
        github_url: githubUrl,
        tech: techList,
        status: statusVal,
        image_url: imageUrl,
      };
    });

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      projects: [],
    });
  }
}
