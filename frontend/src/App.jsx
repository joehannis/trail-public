import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Startup from "./startup/Startup";
import Locations from "./locations/Locations";
import Location from "./locations/Location";
import getCurrentLocation from "./common/getCurrentLocation";
import StaticLogo from "./logo/StaticLogo";
import GreetingScreen from "./logo/GreetingScreen";

const App = () => {
  const [showGreeting, setShowGreeting] = useState(true);
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoadingFirst, setIsLoadingFirst] = useState(false);
  const [isLoadingSecond, setIsLoadingSecond] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentLocation = await getCurrentLocation();
        const longitude = currentLocation.longitude;
        const latitude = currentLocation.latitude;
        setError(null);

        try {
          // Uncomment this section if needed
          const allData = await fetch(
            `http://localhost:3000?longitude=${longitude}&latitude=${latitude}`
          );
          const responseData = await allData.json();
          console.log("responseData", responseData);
          setData(responseData);
        } catch (err) {
          setError(err.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {showGreeting && <GreetingScreen />}
      {!showGreeting && (
        <BrowserRouter>
          <header>
            <Link to="/">
              <StaticLogo />
            </Link>
          </header>
          <Routes>
            <Route
              path="/"
              element={
                <Startup isLoading={isLoadingFirst} error={error} data={data} />
              }
            />
            <Route
              path="/locations"
              element={
                <Locations
                  isLoading={isLoadingFirst}
                  error={error}
                  data={data}
                  setIsLoadingSecond={setIsLoadingSecond}
                />
              }
            />
            <Route
              path="locations/:id"
              element={
                <Location
                  isLoading={isLoadingSecond}
                  error={error}
                  data={data}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);