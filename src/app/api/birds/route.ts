import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// The path to the JSON file, assuming it's in src/lib
const dbPath = path.join(process.cwd(), 'src', 'lib', 'birds-database.json');

// Helper to read the database
async function readDB() {  
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        // If the file doesn't exist, return an empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

// Helper to write to the database
async function writeDB(data: any) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// GET /api/birds - Fetches all birds
export async function GET() {
    try {
        const birds = await readDB();
        return NextResponse.json(birds);
    } catch (error) {
        console.error('Failed to read bird database:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/birds - Adds a new bird
export async function POST(request: Request) {
    try {
        const newBird = await request.json();
        
        // Basic validation
        if (!newBird.name || !newBird.description) {
            return NextResponse.json({ message: 'Name and description are required' }, { status: 400 });
        }

        const birds = await readDB();
        
        // Simple ID generation
        newBird.id = new Date().toISOString(); 
        
        birds.push(newBird);
        
        await writeDB(birds);
        
        return NextResponse.json(newBird, { status: 201 });

    } catch (error) {
        console.error('Failed to write to bird database:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
