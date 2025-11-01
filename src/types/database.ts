export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string;
          make: string;
          model: string;
          year: number;
          mileage: number | null;
          price: number;
          condition: string;
          color: string | null;
          transmission: string | null;
          fuel_type: string | null;
          description: string | null;
          location: string | null;
          images: string[];
          status: 'available' | 'sold';
          is_hidden: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          make: string;
          model: string;
          year: number;
          mileage?: number | null;
          price: number;
          condition: string;
          color?: string | null;
          transmission?: string | null;
          fuel_type?: string | null;
          description?: string | null;
          location?: string | null;
          images?: string[];
          status?: 'available' | 'sold';
          is_hidden?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          make?: string;
          model?: string;
          year?: number;
          mileage?: number | null;
          price?: number;
          condition?: string;
          color?: string | null;
          transmission?: string | null;
          fuel_type?: string | null;
          description?: string | null;
          location?: string | null;
          images?: string[];
          status?: string;
          is_hidden?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type Car = Database['public']['Tables']['cars']['Row'];
export type CarInsert = Database['public']['Tables']['cars']['Insert'];
export type CarUpdate = Database['public']['Tables']['cars']['Update'];