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
      sales_agreements: {
        Row: {
          id: string;
          agreement_number: string;
          car_id: string | null;
          car_make: string;
          car_model: string;
          car_year: number;
          car_mileage: number | null;
          car_color: string | null;
          car_transmission: string | null;
          car_fuel_type: string | null;
          car_condition: string | null;
          car_image: string | null;
          seller_name: string;
          seller_id_type: string;
          seller_id_number: string;
          seller_kra_pin: string | null;
          seller_phone: string;
          seller_email: string | null;
          seller_address: string;
          buyer_name: string;
          buyer_id_type: string;
          buyer_id_number: string;
          buyer_kra_pin: string | null;
          buyer_phone: string;
          buyer_email: string | null;
          buyer_address: string;
          sale_price: number;
          deposit_amount: number;
          balance_amount: number;
          payment_method: string;
          sale_date: string;
          transfer_date: string | null;
          additional_terms: string | null;
          witness_name: string | null;
          witness_id: string | null;
          witness_phone: string | null;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agreement_number: string;
          car_id?: string | null;
          car_make: string;
          car_model: string;
          car_year: number;
          car_mileage?: number | null;
          car_color?: string | null;
          car_transmission?: string | null;
          car_fuel_type?: string | null;
          car_condition?: string | null;
          car_image?: string | null;
          seller_name: string;
          seller_id_type: string;
          seller_id_number: string;
          seller_kra_pin?: string | null;
          seller_phone: string;
          seller_email?: string | null;
          seller_address: string;
          buyer_name: string;
          buyer_id_type: string;
          buyer_id_number: string;
          buyer_kra_pin?: string | null;
          buyer_phone: string;
          buyer_email?: string | null;
          buyer_address: string;
          sale_price: number;
          deposit_amount?: number;
          balance_amount: number;
          payment_method: string;
          sale_date: string;
          transfer_date?: string | null;
          additional_terms?: string | null;
          witness_name?: string | null;
          witness_id?: string | null;
          witness_phone?: string | null;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agreement_number?: string;
          car_id?: string | null;
          car_make?: string;
          car_model?: string;
          car_year?: number;
          car_mileage?: number | null;
          car_color?: string | null;
          car_transmission?: string | null;
          car_fuel_type?: string | null;
          car_condition?: string | null;
          car_image?: string | null;
          seller_name?: string;
          seller_id_type?: string;
          seller_id_number?: string;
          seller_kra_pin?: string | null;
          seller_phone?: string;
          seller_email?: string | null;
          seller_address?: string;
          buyer_name?: string;
          buyer_id_type?: string;
          buyer_id_number?: string;
          buyer_kra_pin?: string | null;
          buyer_phone?: string;
          buyer_email?: string | null;
          buyer_address?: string;
          sale_price?: number;
          deposit_amount?: number;
          balance_amount?: number;
          payment_method?: string;
          sale_date?: string;
          transfer_date?: string | null;
          additional_terms?: string | null;
          witness_name?: string | null;
          witness_id?: string | null;
          witness_phone?: string | null;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      car_wash_employees: {
        Row: {
          id: string;
          name: string;
          phone: string;
          employee_id: string;
          commission_rate: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          employee_id: string;
          commission_rate?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          employee_id?: string;
          commission_rate?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      car_wash_services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          commission_amount: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          commission_amount: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          commission_amount?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      car_wash_jobs: {
        Row: {
          id: string;
          job_number: string;
          customer_name: string;
          customer_phone: string | null;
          vehicle_make: string;
          vehicle_model: string;
          vehicle_registration: string | null;
          vehicle_color: string | null;
          employee_id: string | null;
          services: any; // JSONB
          subtotal: number;
          discount: number;
          total_amount: number;
          status: 'pending' | 'in_progress' | 'completed';
          notes: string | null;
          created_at: string;
          started_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          job_number: string;
          customer_name: string;
          customer_phone?: string | null;
          vehicle_make: string;
          vehicle_model: string;
          vehicle_registration?: string | null;
          vehicle_color?: string | null;
          employee_id?: string | null;
          services: any; // JSONB
          subtotal: number;
          discount?: number;
          total_amount: number;
          status?: 'pending' | 'in_progress' | 'completed';
          notes?: string | null;
          created_at?: string;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          job_number?: string;
          customer_name?: string;
          customer_phone?: string | null;
          vehicle_make?: string;
          vehicle_model?: string;
          vehicle_registration?: string | null;
          vehicle_color?: string | null;
          employee_id?: string | null;
          services?: any; // JSONB
          subtotal?: number;
          discount?: number;
          total_amount?: number;
          status?: 'pending' | 'in_progress' | 'completed';
          notes?: string | null;
          created_at?: string;
          started_at?: string | null;
          completed_at?: string | null;
        };
      };
      car_wash_payments: {
        Row: {
          id: string;
          job_id: string;
          receipt_number: string;
          amount_paid: number;
          payment_method: 'cash' | 'mpesa' | 'card';
          mpesa_reference: string | null;
          paid_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          receipt_number: string;
          amount_paid: number;
          payment_method: 'cash' | 'mpesa' | 'card';
          mpesa_reference?: string | null;
          paid_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          receipt_number?: string;
          amount_paid?: number;
          payment_method?: 'cash' | 'mpesa' | 'card';
          mpesa_reference?: string | null;
          paid_at?: string;
        };
      };
      car_wash_commissions: {
        Row: {
          id: string;
          employee_id: string;
          job_id: string;
          commission_amount: number;
          is_paid: boolean;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          job_id: string;
          commission_amount: number;
          is_paid?: boolean;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          job_id?: string;
          commission_amount?: number;
          is_paid?: boolean;
          paid_at?: string | null;
          created_at?: string;
        };
      };
      car_wash_expenses: {
        Row: {
          id: string;
          expense_date: string;
          category: 'supplies' | 'utilities' | 'rent' | 'equipment' | 'maintenance' | 'salaries' | 'marketing' | 'other';
          description: string;
          amount: number;
          payment_method: 'cash' | 'mpesa' | 'card' | 'bank_transfer' | null;
          receipt_reference: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_date: string;
          category: 'supplies' | 'utilities' | 'rent' | 'equipment' | 'maintenance' | 'salaries' | 'marketing' | 'other';
          description: string;
          amount: number;
          payment_method?: 'cash' | 'mpesa' | 'card' | 'bank_transfer' | null;
          receipt_reference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          expense_date?: string;
          category?: 'supplies' | 'utilities' | 'rent' | 'equipment' | 'maintenance' | 'salaries' | 'marketing' | 'other';
          description?: string;
          amount?: number;
          payment_method?: 'cash' | 'mpesa' | 'card' | 'bank_transfer' | null;
          receipt_reference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Car = Database['public']['Tables']['cars']['Row'];
export type CarInsert = Database['public']['Tables']['cars']['Insert'];
export type CarUpdate = Database['public']['Tables']['cars']['Update'];

export type SalesAgreement = Database['public']['Tables']['sales_agreements']['Row'];
export type SalesAgreementInsert = Database['public']['Tables']['sales_agreements']['Insert'];
export type SalesAgreementUpdate = Database['public']['Tables']['sales_agreements']['Update'];

// Car Wash Management Types (Simplified)
export type CarWashEmployee = Database['public']['Tables']['car_wash_employees']['Row'];
export type CarWashEmployeeInsert = Database['public']['Tables']['car_wash_employees']['Insert'];
export type CarWashEmployeeUpdate = Database['public']['Tables']['car_wash_employees']['Update'];

export type CarWashService = Database['public']['Tables']['car_wash_services']['Row'];
export type CarWashServiceInsert = Database['public']['Tables']['car_wash_services']['Insert'];
export type CarWashServiceUpdate = Database['public']['Tables']['car_wash_services']['Update'];

export type CarWashJob = Database['public']['Tables']['car_wash_jobs']['Row'];
export type CarWashJobInsert = Database['public']['Tables']['car_wash_jobs']['Insert'];
export type CarWashJobUpdate = Database['public']['Tables']['car_wash_jobs']['Update'];

export type CarWashPayment = Database['public']['Tables']['car_wash_payments']['Row'];
export type CarWashPaymentInsert = Database['public']['Tables']['car_wash_payments']['Insert'];
export type CarWashPaymentUpdate = Database['public']['Tables']['car_wash_payments']['Update'];

export type CarWashCommission = Database['public']['Tables']['car_wash_commissions']['Row'];
export type CarWashCommissionInsert = Database['public']['Tables']['car_wash_commissions']['Insert'];
export type CarWashCommissionUpdate = Database['public']['Tables']['car_wash_commissions']['Update'];

export type CarWashExpense = Database['public']['Tables']['car_wash_expenses']['Row'];
export type CarWashExpenseInsert = Database['public']['Tables']['car_wash_expenses']['Insert'];
export type CarWashExpenseUpdate = Database['public']['Tables']['car_wash_expenses']['Update'];

// Extended types with relationships
export interface CarWashJobWithRelations extends CarWashJob {
  employee?: CarWashEmployee;
  payments?: CarWashPayment[];
  commissions?: CarWashCommission[];
}