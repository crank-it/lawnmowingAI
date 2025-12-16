# Lawnmowing.ai - MVP Property Analysis API

Property analysis for lawn services using **100% free LINZ data**. Enter an address, get property boundaries, aerial imagery, and terrain analysis.

## What It Does

1. **Geocodes** NZ addresses to coordinates (LINZ Address Database)
2. **Gets property boundaries** as GeoJSON polygons (LINZ Cadastral)
3. **Fetches aerial imagery** at 5cm resolution (LINZ Basemaps)
4. **Calculates slope/gradient** from elevation data (Open Topo Data + LINZ DEM)
5. **Estimates lawn area** (50% of property - confirmed by operator on-site)

---

## Step 1: Get Your LINZ API Key (5 minutes)

1. Go to **https://data.linz.govt.nz**
2. Click **Sign Up** (top right) - it's free
3. Verify your email
4. Once logged in, click your name → **My Account** → **API Keys**
5. Click **Create Key**
   - Name: `lawnmowing-ai`
   - Leave all defaults
6. Copy the key (looks like: `d12345abcdef67890...`)

**That's it.** No approval process, no credit card, no waiting.

---

## Step 2: Set Up the API

```bash
# Clone or download the api folder
cd api

# Install dependencies
npm install

# Set your API key
export LINZ_API_KEY="your_key_here"

# Start the server
npm start
```

The API runs on `http://localhost:3001`

---

## Step 3: Test It

### Analyse a property (main endpoint)

```bash
curl -X POST http://localhost:3001/api/analyze-property \
  -H "Content-Type: application/json" \
  -d '{"address": "15 Helensburgh Road, Dunedin"}'
```

### Response:

```json
{
  "status": "success",
  "address": {
    "full": "15 Helensburgh Road, Helensburgh, Dunedin 9012",
    "suburb": "Helensburgh",
    "city": "Dunedin",
    "postcode": "9012"
  },
  "coordinates": {
    "lat": -45.8641,
    "lng": 170.5143
  },
  "property": {
    "totalArea": {
      "sqm": 723,
      "sqft": 7782
    },
    "boundary": { "type": "Polygon", "coordinates": [...] },
    "estimatedLawnArea": {
      "sqm": 362,
      "sqft": 3897,
      "note": "Estimate only - to be confirmed on-site"
    }
  },
  "terrain": {
    "elevation": {
      "min": 45.2,
      "max": 48.7,
      "range": 3.5
    },
    "slope": {
      "percent": 8.2,
      "category": "Gentle slope"
    }
  },
  "imagery": {
    "aerialTileUrl": "https://basemaps.linz.govt.nz/v1/tiles/aerial/...",
    "zoom": 19,
    "attribution": "Sourced from Toitū Te Whenua Land Information New Zealand"
  },
  "quote": {
    "status": "pending_site_visit",
    "message": "Lawn area and final price to be confirmed during site assessment"
  }
}
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze-property` | POST | Full property analysis (main endpoint) |
| `/api/geocode` | POST | Address → coordinates |
| `/api/property-boundary` | POST | Coordinates → parcel polygon |
| `/api/aerial-imagery` | POST | Coordinates → tile URLs |
| `/api/elevation` | POST | Polygon → slope analysis |
| `/health` | GET | Health check |

---

## Connecting to Your Frontend

Update the Beefy Cuts / Lawnmowing.ai frontend to call the real API:

```javascript
// Replace the simulated analyzeProperty function with:

const analyzeProperty = async () => {
  setIsAnalyzing(true);
  
  try {
    const response = await fetch('http://localhost:3001/api/analyze-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      setPropertyData({
        totalArea: data.property.totalArea?.sqm || 0,
        lawnArea: data.property.estimatedLawnArea?.sqm || 0,
        gradient: data.terrain.slope?.category || 'Unknown',
        estimatedEdging: Math.round(Math.sqrt(data.property.totalArea?.sqm || 0) * 4),
        accessDifficulty: 'Standard', // To be confirmed on-site
        aerialImageUrl: data.imagery.aerialTileUrl,
        boundary: data.property.boundary
      });
    }
  } catch (error) {
    console.error('Analysis failed:', error);
  }
  
  setIsAnalyzing(false);
};
```

---

## Deploying to Production

### Option A: Vercel (Recommended - Free tier)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variable: `LINZ_API_KEY`
4. Deploy

### Option B: Railway / Render

Same process - both have free tiers suitable for MVP.

### Option C: Your own server

```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
LINZ_API_KEY="your_key" pm2 start server.js --name lawnmowing-api

# Save process list
pm2 save
```

---

## Cost Summary

| Service | Monthly Cost |
|---------|--------------|
| LINZ Data (all of it) | **$0** |
| Open Topo Data | **$0** |
| Vercel hosting (free tier) | **$0** |
| **Total** | **$0** |

At scale with thousands of properties, you're still at $0 for data - just hosting costs.

---

## Next Steps

1. ✅ Get LINZ API key
2. ✅ Run the API locally
3. ✅ Connect to frontend
4. □ Deploy to Vercel
5. □ Add operator confirmation flow (update lawn area after site visit)
6. □ Add customer database (store confirmed properties)
7. □ Add pricing engine (calculate quotes from confirmed data)

---

## Attribution Requirement

LINZ data requires this attribution in your app:

> Sourced from Toitū Te Whenua Land Information New Zealand

The API includes this in responses. Display it near any maps/imagery.

---

## Questions?

The API is designed to be simple. One endpoint does everything:

```
POST /api/analyze-property
Body: { "address": "123 Street Name, City" }
```

That's the entire integration.
