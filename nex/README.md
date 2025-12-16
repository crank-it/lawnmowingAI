# Lawnmowing.ai - Enhanced Property Analysis API

Multi-source geocoding with **cross-validation** for accurate NZ addresses.

## How It Works

```
User types address
       ↓
┌──────────────────┐
│  Addy Solutions  │  ← Fuzzy matching, typo correction, NZ-specific
│  (500 free/mo)   │
└────────┬─────────┘
         ↓
┌──────────────────┐
│  LINZ Cadastral  │  ← Cross-validate coordinates, get property boundary
│  (unlimited/free)│
└────────┬─────────┘
         ↓
   Confidence Score
   (0-100%)
```

**Result:** Address accuracy + property boundaries + confidence scoring

---

## API Keys You Need

| Service | Free Tier | Get It |
|---------|-----------|--------|
| **Addy Solutions** | 500/month | https://addysolutions.com/signup |
| **LINZ Data Service** | Unlimited | https://data.linz.govt.nz |
| **Google Places** (optional) | 250K/month | https://console.cloud.google.com |

### 1. Addy Solutions (Primary - 5 mins)

1. Go to **https://addysolutions.com/signup**
2. Create free account
3. Go to **Dashboard** → **API Keys**
4. Copy your API key

Addy uses NZ Postal Address File + LINZ combined with fuzzy matching. Best for user input.

### 2. LINZ Data Service (5 mins)

1. Go to **https://data.linz.govt.nz**
2. Sign up (free)
3. **My Account** → **API Keys** → **Create Key**
4. Copy your API key

LINZ provides authoritative property boundaries and cross-validation.

### 3. Google Places (Optional)

Only needed if Addy doesn't have coverage in some areas (rare for NZ).

1. Go to **https://console.cloud.google.com**
2. Create project → Enable Places API
3. Create API key with Places API restriction

---

## Setup

```bash
cd api-v2
npm install

# Set all API keys
export LINZ_API_KEY="your_linz_key"
export ADDY_API_KEY="your_addy_key"
export GOOGLE_API_KEY="your_google_key"  # optional

npm start
```

---

## API Endpoints

### 1. Address Autocomplete

```bash
GET /api/address/autocomplete?q=15+helensburgh
```

Returns suggestions as the user types:

```json
{
  "results": [
    {
      "source": "addy",
      "address": "15 Helensburgh Road, Helensburgh, Dunedin 9012",
      "addressId": "1234567",
      "confidence": 0.95
    }
  ]
}
```

### 2. Full Property Analysis

```bash
POST /api/analyze-property
Content-Type: application/json

{
  "address": "15 Helensburgh Road, Dunedin",
  "addressId": "1234567",
  "source": "addy"
}
```

Returns:

```json
{
  "status": "success",
  "address": {
    "input": "15 Helensburgh Road, Dunedin",
    "resolved": "15 Helensburgh Road, Helensburgh, Dunedin 9012",
    "source": "addy"
  },
  "coordinates": { "lat": -45.8641, "lng": 170.5143 },
  "validation": {
    "linzMatch": true,
    "linzAddress": "15 Helensburgh Road, Helensburgh, Dunedin 9012",
    "distance": 3,
    "confidence": 94
  },
  "property": {
    "totalArea": { "sqm": 723, "sqft": 7782 },
    "boundary": { "type": "Polygon", "coordinates": [...] },
    "estimatedLawnArea": { "sqm": 362, "note": "Estimate only" }
  },
  "terrain": {
    "elevation": { "min": 45.2, "max": 48.7, "range": 3.5 },
    "slope": { "percent": 8.2, "category": "Gentle slope" }
  },
  "quote": {
    "status": "ready_for_estimate",
    "confidence": 94,
    "message": "Address verified. Lawn area to be confirmed on-site."
  }
}
```

---

## Frontend Integration

### Address Input with Autocomplete

```jsx
const [suggestions, setSuggestions] = useState([]);
const [selectedAddress, setSelectedAddress] = useState(null);

// Autocomplete as user types
const handleAddressInput = async (value) => {
  if (value.length < 3) return;
  
  const response = await fetch(
    `/api/address/autocomplete?q=${encodeURIComponent(value)}`
  );
  const data = await response.json();
  setSuggestions(data.results);
};

// User selects an address
const handleSelectAddress = (suggestion) => {
  setSelectedAddress(suggestion);
  analyzeProperty(suggestion);
};

// Analyze the selected property
const analyzeProperty = async (suggestion) => {
  const response = await fetch('/api/analyze-property', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: suggestion.address,
      addressId: suggestion.addressId,
      source: suggestion.source
    })
  });
  
  const data = await response.json();
  
  if (data.validation.confidence >= 80) {
    // High confidence - show quote
    setPropertyData(data);
  } else {
    // Low confidence - ask user to verify
    setNeedsVerification(true);
  }
};
```

---

## Confidence Scoring

The API returns a confidence score (0-100%) based on:

- **Distance** between Addy coordinates and nearest LINZ address (60% weight)
- **Text similarity** between input address and LINZ address (40% weight)

| Score | Meaning | Action |
|-------|---------|--------|
| 80-100% | High confidence | Show quote directly |
| 50-79% | Medium confidence | Show quote with warning |
| 0-49% | Low confidence | Ask user to verify on map |

---

## Cost at Scale

| Monthly Volume | Addy Cost | LINZ Cost | Total |
|----------------|-----------|-----------|-------|
| 500 properties | $0 (free tier) | $0 | **$0** |
| 2,000 properties | ~$90 NZD | $0 | **~$90** |
| 10,000 properties | ~$450 NZD | $0 | **~$450** |

Addy pricing: $0.06 NZD per lookup after free tier.

---

## Troubleshooting

### "Address not found"
- User may have typo - Addy's fuzzy matching usually handles this
- Try the autocomplete endpoint first, then use the returned `addressId`

### Low confidence score
- The coordinates from Addy don't match a nearby LINZ address
- Could be a new subdivision not yet in LINZ
- Ask operator to verify on-site

### Missing property boundary
- LINZ parcel data has gaps in some rural areas
- Use the coordinates but note lawn area is unverified

---

## Next Steps

1. ✅ Get Addy API key (5 mins)
2. ✅ Get LINZ API key (5 mins)  
3. ✅ Run locally and test
4. □ Connect frontend autocomplete
5. □ Deploy to Vercel
6. □ Add operator confirmation flow
