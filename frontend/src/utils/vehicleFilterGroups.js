const vehicleFilterGroups = [
  {
    id: "core",
    label: "Core Search Filters",
    sections: [
      {
        id: "price",
        title: "Price Range",
        options: [
          "Under 500K",
          "500K - 750K",
          "750K - 1M",
          "1M - 1.5M",
          "1.5M - 2.5M",
          "2.5M - 3.5M",
          "Above 3.5M",
        ],
      },
      {
        id: "mileage",
        title: "Mileage",
        options: [
          "Under 40K",
          "40K - 80K",
          "80K - 105K",
          "105K - 150K",
          "Over 150K",
        ],
      },
      {
        id: "condition",
        title: "Condition",
        options: ["New", "Kenyan Used", "Foreign Used"],
      },
    ],
  },
  {
    id: "performance",
    label: "Performance & Mechanical",
    sections: [
      {
        id: "transmission",
        title: "Transmission",
        options: ["Automatic", "Manual"],
      },
      {
        id: "driveType",
        title: "Drive Type",
        options: ["FWD", "RWD", "4WD", "AWD"],
      },
      {
        id: "engineCc",
        title: "Engine cc",
        options: [
          "Under 1000 cc",
          "1000-1499 cc",
          "1500-1999 cc",
          "2000-2999 cc",
          "3000-3999 cc",
          "4000+ cc",
        ],
      },
      {
        id: "fuelType",
        title: "Fuel Type",
        options: [
          "Petrol",
          "Diesel",
          "Hybrid",
          "Plug-in hybrid (PHEV)",
          "Electric (EV)",
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design & Comfort",
    sections: [
      {
        id: "bodyType",
        title: "Body Type",
        options: [
          "Saloon",
          "HatchBack",
          "Station Wagon",
          "SUV / Offroad",
          "Cross-over",
          "Pick Up",
          "Truck / Trailer",
          "Van / Bus",
          "Coupe",
          "Mini-van",
          "Bike",
          "Convertible",
          "Three wheeler",
        ],
      },
      {
        id: "color",
        title: "Color",
        options: [
          "Black",
          "White",
          "Silver",
          "Grey",
          "Blue",
          "Red",
          "Green",
          "Brown",
          "Beige",
          "Gold",
          "Maroon",
          "Other",
        ],
      },
      {
        id: "seats",
        title: "Number of Seats",
        options: ["2 seats", "4 seats", "5 seats", "7 seats", "8+ seats"],
      },
      {
        id: "features",
        title: "Features & Technology",
        options: ["Sunroof", "Power liftgate"],
      },
    ],
  },
];

export default vehicleFilterGroups;
