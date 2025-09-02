# useGeolocation Hook

A custom React hook for getting current geolocation without depending on UV services or mock data.

## Features

- High accuracy geolocation with fallback to regular accuracy
- Loading states and error handling
- TypeScript support with proper interfaces
- No dependency on UV service or mock data
- Works independently and can be reused across the application

## Usage

```tsx
import { useGeolocation } from '../hooks/useGeolocation';

function MyComponent() {
  const { 
    location, 
    loading, 
    error, 
    getCurrentLocation, 
    clearError 
  } = useGeolocation();

  const handleGetLocation = async () => {
    try {
      const position = await getCurrentLocation();
      console.log('Current position:', position);
    } catch (err) {
      console.error('Failed to get location:', err);
    }
  };

  return (
    <div>
      <button 
        onClick={handleGetLocation} 
        disabled={loading}
      >
        {loading ? 'Getting location...' : 'Get Current Location'}
      </button>
      
      {location && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy}m</p>
        </div>
      )}
      
      {error && (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={clearError}>Clear Error</button>
        </div>
      )}
    </div>
  );
}
```

## Return Values

- `location`: GeolocationData | null - Current location data
- `loading`: boolean - Whether location is being fetched
- `error`: GeolocationError | null - Any error that occurred
- `getCurrentLocation`: () => Promise<GeolocationData> - Function to get current location
- `clearError`: () => void - Function to clear current error

## Interfaces

```typescript
interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface GeolocationError {
  code: number;
  message: string;
}
```