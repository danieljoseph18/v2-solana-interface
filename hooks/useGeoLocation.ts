import { useState, useEffect } from "react";

export const useGeoLocation = () => {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const response = await fetch("http://ip-api.com/json");
        const data: {
          countryCode: string;
        } = await response.json();

        console.log("data: ", data);

        setCountry(data.countryCode);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    }
    fetchCountry();
  }, []);

  return country;
};
