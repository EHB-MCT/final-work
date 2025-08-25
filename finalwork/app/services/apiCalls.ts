export interface CatLocation {
  probleem: boolean;
  chill: boolean;
  status: string;
  nieuwsgierig: boolean;
  latitude: number;
  longitude: number;
  timestamp?: string;
  jump?: number;
  activityLevel?: number;
  battery?: number;            
  environment?: "indoors" | "outdoors"; 
}

export const fetchLatestCatLocation = async (): Promise<CatLocation | null> => {
  try {
    const response = await fetch("https://final-work-4-jtgv.onrender.com/api/cats");

    const text = await response.text();
    if (!text) return null; // fallback bij lege response

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ JSON parse error:", text);
      return null;
    }

    if (!Array.isArray(data) || data.length === 0) return null;

    const latest = data[0]; // neem de eerste entry

    return {
      latitude: latest.location?.latitude ?? 0,
      longitude: latest.location?.longitude ?? 0,
      timestamp: latest.timestamp,
      jump: latest.jump,
      activityLevel: latest.activityLevel,
      probleem: latest.probleem ?? false,
      chill: latest.chill ?? false,
      status: latest.status ?? "unknown",
      nieuwsgierig: latest.nieuwsgierig ?? false,
      battery: latest.battery ?? 0,                
      environment: latest.environment ?? "indoors" 
    };
  } catch (error) {
    console.error("Error when fetching cat location:", error);
    return null;
  }
};
