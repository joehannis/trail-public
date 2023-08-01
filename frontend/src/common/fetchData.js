import { useState, useEffect } from "react";
import getCurrentLocation from "./getCurrentLocation";

const useFetchData = () => {
  const [data, setData] = useState([]);
  const [isLoadingFirst, setIsLoadingFirst] = useState(false);
  const [currentPosition, setCurrentPosition] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      const longitude = currentLocation.longitude;
      const latitude = currentLocation.latitude;
      const longitudeHook = Number(longitude.toString().slice(0, -3));
      const latitudeHook = Number(latitude.toString().slice(0, -3));
      const storagePositionLongitude = Number(
        localStorage.getItem("longitude")
      );
      const storagePositionLatitude = Number(localStorage.getItem("latitude"));
      if (
        longitudeHook !== storagePositionLongitude ||
        latitudeHook !== storagePositionLatitude
      ) {
        console.log("fetching data");
        localStorage.setItem("longitude", longitudeHook);
        localStorage.setItem("latitude", latitudeHook);
        setCurrentPosition([longitudeHook, latitudeHook]);
        setError(null);
        setIsLoadingFirst(true);

        const allData = await fetch(
          `http://localhost:3000?longitude=${longitude}&latitude=${latitude}`
        );
        const responseData = await allData.json();
        localStorage.setItem("data", JSON.stringify(responseData));
        setData(responseData);
        setIsLoadingFirst(false);
      } else {
        console.log("using local storage");
        const storageData = JSON.parse(localStorage.getItem("data"));
        setData(storageData);
        const storageLongitude = JSON.parse(localStorage.getItem("longitude"));
        const storageLatitude = JSON.parse(localStorage.getItem("latitude"));
        setCurrentPosition([storageLongitude, storageLatitude]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoadingFirst,
    error,
    currentPosition,
  };
};

export default useFetchData;
