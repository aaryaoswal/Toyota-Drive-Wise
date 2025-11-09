/**
 * Vehicle data and utilities for DriveWise
 */

export interface VehicleData {
  id: string;
  model: string;
  trim: string;
  year: number;
  msrp: number;
  image: string;
  category: string;
  fuelType: string;
  mpg: string;
  mpgCombined: number;
  seating: number;
  reliability: number;
}

// Comprehensive Toyota vehicle lineup
export const TOYOTA_VEHICLES: VehicleData[] = [
  {
    id: "camry-le",
    model: "Camry",
    trim: "LE",
    year: 2024,
    msrp: 28400,
    image: "/stock_images/2024_toyota_camry_hero.png",
    category: "Sedan",
    fuelType: "Gas",
    mpg: "28/39",
    mpgCombined: 32,
    seating: 5,
    reliability: 4.8
  },
  {
    id: "camry-se",
    model: "Camry",
    trim: "SE",
    year: 2024,
    msrp: 30200,
    image: "/stock_images/2024_toyota_camry_hero.png",
    category: "Sedan",
    fuelType: "Gas",
    mpg: "28/39",
    mpgCombined: 32,
    seating: 5,
    reliability: 4.8
  },
  {
    id: "camry-xse",
    model: "Camry",
    trim: "XSE",
    year: 2024,
    msrp: 32500,
    image: "/stock_images/2024_toyota_camry_hero.png",
    category: "Sedan",
    fuelType: "Gas",
    mpg: "28/39",
    mpgCombined: 32,
    seating: 5,
    reliability: 4.8
  },
  {
    id: "camry-hybrid-se",
    model: "Camry",
    trim: "Hybrid SE",
    year: 2024,
    msrp: 31900,
    image: "/stock_images/2024_toyota_camry_hero.png",
    category: "Sedan",
    fuelType: "Hybrid",
    mpg: "51/53",
    mpgCombined: 52,
    seating: 5,
    reliability: 4.9
  },
  {
    id: "corolla-le",
    model: "Corolla",
    trim: "LE",
    year: 2024,
    msrp: 22300,
    image: "/stock_images/2024_toyota_corolla__05ea0fdf.jpg",
    category: "Sedan",
    fuelType: "Gas",
    mpg: "30/38",
    mpgCombined: 33,
    seating: 5,
    reliability: 4.9
  },
  {
    id: "corolla-se",
    model: "Corolla",
    trim: "SE",
    year: 2024,
    msrp: 24500,
    image: "/stock_images/2024_toyota_corolla__05ea0fdf.jpg",
    category: "Sedan",
    fuelType: "Gas",
    mpg: "31/40",
    mpgCombined: 34,
    seating: 5,
    reliability: 4.9
  },
  {
    id: "corolla-hybrid-le",
    model: "Corolla",
    trim: "Hybrid LE",
    year: 2024,
    msrp: 25900,
    image: "/stock_images/2024_toyota_corolla__05ea0fdf.jpg",
    category: "Sedan",
    fuelType: "Hybrid",
    mpg: "53/52",
    mpgCombined: 52,
    seating: 5,
    reliability: 4.9
  },
  {
    id: "rav4-le",
    model: "RAV4",
    trim: "LE",
    year: 2024,
    msrp: 30500,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "27/35",
    mpgCombined: 30,
    seating: 5,
    reliability: 4.7
  },
  {
    id: "rav4-xle",
    model: "RAV4",
    trim: "XLE",
    year: 2024,
    msrp: 33200,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "27/35",
    mpgCombined: 30,
    seating: 5,
    reliability: 4.7
  },
  {
    id: "rav4-xle-hybrid",
    model: "RAV4",
    trim: "XLE Hybrid",
    year: 2024,
    msrp: 35800,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Hybrid",
    mpg: "41/38",
    mpgCombined: 40,
    seating: 5,
    reliability: 4.7
  },
  {
    id: "rav4-prime-se",
    model: "RAV4 Prime",
    trim: "SE",
    year: 2024,
    msrp: 44500,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Plug-in Hybrid",
    mpg: "94 MPGe",
    mpgCombined: 38,
    seating: 5,
    reliability: 4.6
  },
  {
    id: "highlander-le",
    model: "Highlander",
    trim: "LE",
    year: 2024,
    msrp: 40500,
    image: "/stock_images/2024_toyota_highland_0eafcb92.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "21/29",
    mpgCombined: 24,
    seating: 8,
    reliability: 4.6
  },
  {
    id: "highlander-xle",
    model: "Highlander",
    trim: "XLE",
    year: 2024,
    msrp: 44200,
    image: "/stock_images/2024_toyota_highland_0eafcb92.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "21/29",
    mpgCombined: 24,
    seating: 8,
    reliability: 4.6
  },
  {
    id: "highlander-limited",
    model: "Highlander",
    trim: "Limited",
    year: 2024,
    msrp: 48500,
    image: "/stock_images/2024_toyota_highland_0eafcb92.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "21/29",
    mpgCombined: 24,
    seating: 8,
    reliability: 4.6
  },
  {
    id: "highlander-hybrid-xle",
    model: "Highlander",
    trim: "Hybrid XLE",
    year: 2024,
    msrp: 47500,
    image: "/stock_images/2024_toyota_highland_0eafcb92.jpg",
    category: "SUV",
    fuelType: "Hybrid",
    mpg: "36/35",
    mpgCombined: 36,
    seating: 8,
    reliability: 4.7
  },
  {
    id: "tacoma-sr5",
    model: "Tacoma",
    trim: "SR5",
    year: 2024,
    msrp: 36500,
    image: "/stock_images/2024_toyota_tacoma_p_e535598f.jpg",
    category: "Truck",
    fuelType: "Gas",
    mpg: "19/24",
    mpgCombined: 21,
    seating: 5,
    reliability: 4.5
  },
  {
    id: "tacoma-trd-sport",
    model: "Tacoma",
    trim: "TRD Sport",
    year: 2024,
    msrp: 42000,
    image: "/stock_images/2024_toyota_tacoma_p_e535598f.jpg",
    category: "Truck",
    fuelType: "Gas",
    mpg: "18/22",
    mpgCombined: 20,
    seating: 5,
    reliability: 4.5
  },
  {
    id: "tacoma-trd-pro",
    model: "Tacoma",
    trim: "TRD Pro",
    year: 2024,
    msrp: 52500,
    image: "/stock_images/2024_toyota_tacoma_p_e535598f.jpg",
    category: "Truck",
    fuelType: "Gas",
    mpg: "17/20",
    mpgCombined: 18,
    seating: 5,
    reliability: 4.4
  },
  {
    id: "4runner-sr5",
    model: "4Runner",
    trim: "SR5",
    year: 2024,
    msrp: 45000,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "16/19",
    mpgCombined: 17,
    seating: 7,
    reliability: 4.7
  },
  {
    id: "4runner-trd-off-road",
    model: "4Runner",
    trim: "TRD Off-Road",
    year: 2024,
    msrp: 47800,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "16/19",
    mpgCombined: 17,
    seating: 7,
    reliability: 4.6
  },
  {
    id: "4runner-limited",
    model: "4Runner",
    trim: "Limited",
    year: 2024,
    msrp: 49500,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "16/19",
    mpgCombined: 17,
    seating: 7,
    reliability: 4.7
  },
  {
    id: "4runner-trd-pro",
    model: "4Runner",
    trim: "TRD Pro",
    year: 2024,
    msrp: 55000,
    image: "/stock_images/2024_toyota_rav4_suv_c2a1cabc.jpg",
    category: "SUV",
    fuelType: "Gas",
    mpg: "16/19",
    mpgCombined: 17,
    seating: 7,
    reliability: 4.6
  }
];

export function getVehicleById(id: string): VehicleData | undefined {
  return TOYOTA_VEHICLES.find(v => v.id === id);
}

export function getVehiclesByCategory(category: string): VehicleData[] {
  if (category === "all") return TOYOTA_VEHICLES;
  return TOYOTA_VEHICLES.filter(v => v.category === category);
}

export function searchVehicles(query: string): VehicleData[] {
  const lowerQuery = query.toLowerCase();
  return TOYOTA_VEHICLES.filter(v => 
    v.model.toLowerCase().includes(lowerQuery) ||
    v.trim.toLowerCase().includes(lowerQuery)
  );
}
