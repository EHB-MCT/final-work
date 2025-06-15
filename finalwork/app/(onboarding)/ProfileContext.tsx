import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Profile = {
  name: string;
  weight: string;
  imageUri: string | null;
};

type ProfileContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: { name: "", weight: "", imageUri: null },
  setProfile: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    weight: "",
    imageUri: null,
  });

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("userProfile");
      if (stored) setProfile(JSON.parse(stored));
    })();
  }, []);

  // Sla profiel altijd op in AsyncStorage zodra het verandert
  useEffect(() => {
    AsyncStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
