// services/catService.ts
export interface CatLocation {
  probleem: any;
  chill: any;
  status: any;
  nieuwsgierig: undefined;
  latitude: number;
  longitude: number;
  timestamp?: string;
  jump?: number;
  activityLevel?: number;
}

export const fetchLatestCatLocation = async (): Promise<CatLocation | null> => {
  try {
    const response = await fetch(
      "https://final-work-7cqh.onrender.com/api/cat-locations"
    );
    const data = await response.json();

    if (data.length > 0) {
      const latest = data[0];
      return {
        latitude: latest.latitude,
        longitude: latest.longitude,
        timestamp: latest.timestamp,
        jump: latest.jump,
        activityLevel: latest.activityLevel,

        probleem: latest.probleem ?? false,
        chill: latest.chill ?? false,
        status: latest.status ?? "unknown",
        nieuwsgierig: latest.nieuwsgierig ?? false,
      };
    }

    return null;
  } catch (error) {
    console.error("Error when fetching cat location:", error);
    return null;
  }
};
