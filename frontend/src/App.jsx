import BuyingProcess from "./components/public/BuyingProcess";
import Testimonials from "./components/public/Testimonials";
import Welcome from "./components/public/Welcome";
import Footer from "./components/public/Footer";
import SearchBar from "./components/public/SearchBar";
import NavBar from "./components/public/NavBar";
import VehicleGrid from "./components/public/VehicleGrid";


function App() {
  return (
    <>
      <NavBar />
      <Welcome />
      <SearchBar />
      <VehicleGrid />
      <BuyingProcess />
      <Testimonials />
      <Footer />
    </>
  );
}

export default App;
