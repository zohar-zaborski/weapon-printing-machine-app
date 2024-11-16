// src/types.ts

// Define the structure of a Weapon
export interface Weapon {
    id: number;                   // Unique ID for the weapon
    name: string;                 // Name of the weapon
    description?: string;         // Optional description
    compatibleParts: string[];    // Array of compatible part IDs (parsed from CSV)
  }
  
  // Define the structure of a Part
  export interface Part {
    id: number;
    name: string;
    compatibleWeapons: string | string[]; // CSV string or parsed array
  }
  
  
  // Define the structure for customizing a weapon
  export interface Customization {
    weaponId: number;             // ID of the selected weapon
    parts: number[];              // Array of selected part IDs
  }
  
  // Define the structure of a Customized Weapon
  export interface CustomizedWeapon {
    id: number;                   // Unique ID of the customization
    userId: number;               // User ID who created the customization
    weaponId: number;             // ID of the weapon being customized
    parts: number[];              // Array of selected part IDs
    printJobId?: number;          // Optional associated print job ID
  }
  
  // Define the structure of a Print Job
  export interface PrintJob {
    id: number;                   // Unique ID of the print job
    customizedWeaponId: number;   // ID of the customized weapon being printed
    status: string;               // Status of the print job (e.g., "Pending", "Completed")
    createdAt: string;            // Timestamp when the print job was created
  }
  
  // For API responses
  export interface ApiResponse<T> {
    success: boolean;             // Whether the API call was successful
    message: string;              // Message from the server
    data?: T;                     // Optional payload data (generic type)
  }
  