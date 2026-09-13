import { Trip, TripRequest } from '../types/trip';

export async function generateTripItinerary(
  request: TripRequest,
  customKeys?: { openAIKey?: string; geminiKey?: string }
): Promise<Trip> {
  const response = await fetch('/api/generate-trip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      customOpenAIKey: customKeys?.openAIKey || '',
      customGeminiKey: customKeys?.geminiKey || '',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Server responded with status ${response.status}`
    );
  }

  const tripData: Trip = await response.json();
  return tripData;
}

export async function checkServerHealth(): Promise<{
  status: string;
  hasGeminiKey: boolean;
  hasOpenAIKey: boolean;
  hasMapsKey: boolean;
}> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (e) {
    return { status: 'error', hasGeminiKey: false, hasOpenAIKey: false, hasMapsKey: false };
  }
}
