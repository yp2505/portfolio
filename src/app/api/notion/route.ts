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

    const projects = response.results.map((page: unknown, index: number) => {
      const pageObj = page as { properties?: Record<string, Record<string, unknown>> }
      const props = pageObj.properties || {}

      const titleProp = (props.Title || props.title || props.Name || props.name) as Record<string, unknown> | undefined
      const descProp = (props.Description || props.description) as Record<string, unknown> | undefined
      const githubProp = (props.GitHub || props.github || props.Link || props.link) as Record<string, unknown> | undefined
      const techProp = (props.Tech || props.tech) as Record<string, unknown> | undefined
      const statusProp = (props.Status || props.status) as Record<string, unknown> | undefined
      const imageProp = (props.Image || props.image) as Record<string, unknown> | undefined

      const titleText = ((titleProp?.title as Array<{ plain_text?: string }>) || [])[0]?.plain_text || 'Untitled Project'
      const descText = ((descProp?.rich_text as Array<{ plain_text?: string }>) || [])[0]?.plain_text || ''
      const githubUrl = (githubProp?.url as string) || 'https://github.com/yp2505'
      const techList =
        (techProp?.multi_select as Array<{ name: string }>)?.map((t) => t.name) || ['ML', 'Python']
      const statusVal =
        ((statusProp?.select as { name?: string })?.name || '').toLowerCase() === 'completed'
          ? 'completed'
          : 'in-progress'
      const imageUrl = (imageProp?.url as string) || ''

      return {
        id: index + 1,
        title: titleText,
        description: descText,
        github_url: githubUrl,
        tech: techList,
        status: statusVal,
        image_url: imageUrl,
      }
    })

    return NextResponse.json({ success: true, projects })
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      projects: [],
    })
  }
}
