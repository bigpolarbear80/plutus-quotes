import { v4 as uuidv4 } from 'uuid';
import { PricingConfig, QuoteInput, QuoteResult, FuelEntry } from './types';
import { normalizeQuantityToUnit } from './conversions';
import { getProcedureById } from './procedures';

export function calculateQuote(input: QuoteInput, pricing: PricingConfig): QuoteResult {
  const section = input.deliveryTerm === 'FOB' ? pricing.fob : pricing.cif;
  const fuel = section.fuels.find(f => f.name === input.fuelProduct);
  if (!fuel) throw new Error(`Fuel "${input.fuelProduct}" not found in ${input.deliveryTerm} pricing`);

  const quantityInNativeUnit = normalizeQuantityToUnit(
    input.quantity,
    input.quantityUnit,
    fuel.unit
  );
  const monthlyInNativeUnit = normalizeQuantityToUnit(
    input.monthlyQuantity,
    input.monthlyQuantityUnit,
    fuel.unit
  );

  const pricePerUnit = fuel.price;
  const mtPrice = fuel.mtPrice;
  const lineTotal = pricePerUnit * quantityInNativeUnit;
  const monthlyValue = pricePerUnit * monthlyInNativeUnit;
  const totalContractValue = monthlyValue * input.contractDurationMonths;

  const commissionPerUnit = fuel.commission;
  const commissionMonthly = commissionPerUnit * monthlyInNativeUnit;
  const commissionTotal = commissionMonthly * input.contractDurationMonths;

  const procedure = input.procedureId ? getProcedureById(input.procedureId) : undefined;

  return {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    input,
    pricePerUnit,
    priceUnit: fuel.unit,
    mtPrice,
    lineTotal,
    monthlyValue,
    totalContractValue,
    commissionPerUnit,
    commissionUnit: fuel.commissionUnit,
    commissionMonthly,
    commissionTotal,
    fuel,
    deliveryTerm: input.deliveryTerm,
    ports: section.ports,
    procedure: procedure ? procedure.name : section.procedure,
    procedureId: procedure?.id,
    procedureName: procedure?.name,
    procedureSteps: procedure?.steps,
    asOfDate: section.asOfDate,
  };
}
