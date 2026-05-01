let savedItems: any[] = [];

export async function GET() {
  return Response.json(savedItems);
}

export async function POST(request: Request) {
  const item = await request.json();
  const exists = savedItems.find(i => i.id === item.id);
  
  if (exists) {
    savedItems = savedItems.filter(i => i.id !== item.id);
  } else {
    savedItems.push(item);
  }
  
  return Response.json(savedItems);
}
