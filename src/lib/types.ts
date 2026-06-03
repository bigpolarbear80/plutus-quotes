export interface FuelEntry {
  id: string;
  name: string;
  price: number;
  unit: string;
  mtPrice: number;
  commission: number;
  commissionUnit: string;
}

export interface PricingSection {
  asOfDate: string;
  ports: string[];
  procedure: string;
  fuels: FuelEntry[];
}

export interface PricingConfig {
  fob: PricingSection;
  cif: PricingSection & { cifPriceIncrease: number };
}

export interface PricingHistoryEntry {
  date: string;
  changes: string;
  snapshot: PricingConfig;
}

export interface QuoteInput {
  buyerCompany: string;
  buyerContact: string;
  buyerEmail: string;
  fuelProduct: string;
  deliveryTerm: 'FOB' | 'CIF';
  destinationPort: string;
  quantity: number;
  quantityUnit: string;
  monthlyQuantity: number;
  monthlyQuantityUnit: string;
  contractDurationMonths: number;
  buyerTargetPrice?: number;
  notes?: string;
}

export interface QuoteResult {
  id: string;
  createdAt: string;
  input: QuoteInput;
  pricePerUnit: number;
  priceUnit: string;
  mtPrice: number;
  lineTotal: number;
  monthlyValue: number;
  totalContractValue: number;
  commissionPerUnit: number;
  commissionUnit: string;
  commissionMonthly: number;
  commissionTotal: number;
  fuel: FuelEntry;
  deliveryTerm: 'FOB' | 'CIF';
  ports: string[];
  procedure: string;
  asOfDate: string;
}
