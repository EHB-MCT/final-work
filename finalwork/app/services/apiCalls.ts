// services/apiCalls.ts
export interface CatLocation {
  probleem: boolean;
  chill: boolean;
  status: string;
  nieuwsgierig: boolean;
  latitude: number;
  longitude: number;
  timestamp?: string;
  jumps?: number;      
  sleep?: number;       
  activityLevel?: number;
  battery?: number;
  environment?: string;
}

export const fetchLatestCatLocation = async (): Promise<CatLocation | null> => {
  try {
    const response = await fetch(
      "https://final-work-5-frww.onrender.com/api/cats/latest"
    );
    const text = await response.text();
    if (!text) return null;

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ JSON parse error:", text);
      return null;
    }

    // 💡 Check of data een array is of een object
    let latest: any;
    if (Array.isArray(data) && data.length > 0) {
      latest = data[data.length - 1];
    } else if (typeof data === "object" && data !== null) {
      latest = data;
    } else {
      return null;
    }

    return {
      latitude: latest.location?.latitude ?? 0,
      longitude: latest.location?.longitude ?? 0,
      timestamp: latest.timestamp,
      jumps: latest.jumps ?? 0,        
      sleep: latest.sleep ?? 0,       
      activityLevel: latest.activityLevel,

      // status flags
      probleem: latest.status === "probleem",
      chill: latest.status === "chill",
      nieuwsgierig: latest.status === "nieuwsgierig",
      status: latest.status ?? "unknown",

      // nieuwe hardware waarden
      battery: latest.battery ?? 50,
      environment: latest.environment ?? "indoors",
    };
  } catch (error) {
    console.error("Error when fetching cat location:", error);
    return null;
  }
};

export async function triggerBuzzer(): Promise<boolean> {
  try {
    const response = await fetch(
      `https://final-work-5-frww.onrender.com/api/buzzer/trigger`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to trigger buzzer:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error triggering buzzer:", error);
    return false;
  }
}
