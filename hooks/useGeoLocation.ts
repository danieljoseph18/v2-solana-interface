import { useState, useEffect } from "react";

export const useGeoLocation = () => {
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountry() {
      try {
        // First get the IP address from ipify
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip: ipAddress } = await ipResponse.json();

        // Then check location using your backend
        const locationResponse = await fetch(`/api/check-location`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip_address: ipAddress }),
        });

        const { userCountry } = await locationResponse.json();
        setCountry(userCountry.country_code2);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    }
    fetchCountry();
  }, []);

  return country;
};
