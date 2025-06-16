// /src/app/api/map-generation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateMap, MapGenerationParamsSchema } from '@/flows/mapGenerator';
import { validateGeneratedMap } from '@/lib/map-validator';
// import { saveGeneratedMapToDB, getGeneratedMapFromDB } from '@/lib/firestoreService'; // Placeholder for DB operations

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();
    
    const parsedParams = MapGenerationParamsSchema.safeParse(params);
    if (!parsedParams.success) {
      return NextResponse.json({ error: 'Invalid map generation parameters', details: parsedParams.error.format() }, { status: 400 });
    }

    console.log('API: Received map generation request with params:', parsedParams.data);
    
    const generatedMapData = await generateMap(parsedParams.data);

    const validationResult = await validateGeneratedMap(generatedMapData);
    if (!validationResult.isValid) {
      console.error('API: Generated map failed validation:', validationResult.errors);
      return NextResponse.json({ error: 'Generated map is invalid', details: validationResult.errors }, { status: 500 });
    }
    console.log('API: Generated map passed validation.');

    // const mapId = await saveGeneratedMapToDB(generatedMapData); // Placeholder
    // console.log(`API: Generated map saved with ID: ${mapId}`);
    // For now, just return the map data
    console.log(`API: Generated map ${generatedMapData.mapId} ready to be returned (DB save skipped).`);


    return NextResponse.json({ mapId: generatedMapData.mapId, mapData: generatedMapData }, { status: 200 });

  } catch (error: any) {
    console.error('API Error during map generation:', error);
    return NextResponse.json({ error: 'Failed to generate map', details: error.message || String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mapId = searchParams.get('mapId');

  if (!mapId) {
    return NextResponse.json({ error: 'mapId query parameter is required' }, { status: 400 });
  }

  try {
    // const mapData = await getGeneratedMapFromDB(mapId); // Placeholder
    // if (!mapData) {
    //   return NextResponse.json({ error: 'Map not found' }, { status: 404 });
    // }
    // return NextResponse.json(mapData);
    return NextResponse.json({ message: `Fetch map by ID ${mapId} - Not implemented yet` });
  } catch (error: any) {
    console.error(`API Error fetching map ${mapId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch map data', details: error.message }, { status: 500 });
  }
}
