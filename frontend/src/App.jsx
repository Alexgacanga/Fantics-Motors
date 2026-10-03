import BuyingProcess from "./components/public/BuyingProcess";
import Footer from "./components/public/footer";
import NavBar from "./components/public/Navbar";
import SearchBar from "./components/public/Searchbar";
import Testimonials from "./components/public/Testimonials";
import VehicleGrid from "./components/public/Vehiclegrid";
import Welcome from "./components/public/Welcome";

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
