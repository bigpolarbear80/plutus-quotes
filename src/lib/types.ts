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
  procedureId?: string;
  notes?: string;
}

export interface QuoteResult {
  id: string;
  createdAt: string;
  input: QuoteInput;
  procedureId?: string;
  procedureName?: string;
  procedureSteps?: string[];
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

export const DEAL_STAGES = [
  'lead',
  'quote_sent',
  'follow_up',
  'deal_in_process',
  'final_deal',
  'commission_paid',
] as const;

export type DealStage = typeof DEAL_STAGES[number];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  quote_sent: 'Quote Sent',
  follow_up: 'Follow Up',
  deal_in_process: 'Deal in Process',
  final_deal: 'Final Deal',
  commission_paid: 'Commission Paid',
};

export interface Deal {
  id: string;
  createdAt: string;
  updatedAt: string;
  stage: DealStage;
  buyerCompany: string;
  buyerContact: string;
  buyerEmail: string;
  product: string;
  deliveryTerm: 'FOB' | 'CIF';
  destinationPort: string;
  contractValue: number;
  commissionTotal: number;
  quoteId?: string;
  notes: string;
}
