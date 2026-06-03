export interface ProcedureTemplate {
  id: string;
  name: string;
  shortName: string;
  applicableTo: ('FOB' | 'CIF')[];
  steps: string[];
}

export const PROCEDURES: ProcedureTemplate[] = [
  {
    id: 'fob-dip-pay',
    name: 'Refinery Tank to Tank Dip & Pay FOB',
    shortName: 'FOB Dip & Pay',
    applicableTo: ['FOB'],
    steps: [
      'Buyer sends ICPO and CIS for KYC including Buyer\'s Passport.',
      'Seller issues Commercial Invoice (CI) for the available quantity to Buyer. Buyer signs and returns to Seller with TSA and NCNDA/IMFPA signed by all buyer groups with commission structure(s).',
      'Seller issues Dip Test Authorization letter signed by all parties including Buyer\'s tank Farm. (Note: If Buyer TSA doesn\'t meet with seller\'s verification, Buyer has no other choice than to extend on our tanks to enable Buyer dip and lift from our tanks).',
      'Upon the signing of the Dip Test Authorization (DTA) by all parties Seller issues: (a) Fresh SGS Report, (b) Tank Receipt, (c) Injection Report, (d) Certificate of Origin, (e) Refinery Reservoir Receipt.',
      'Buyer orders SGS to conduct dip test of the product in the Seller\'s tank on Buyer\'s expense. Buyer provides vessel details or tank details. Seller shall immediately submit the SGS inspection report along with the full Proof of Product (POP) to the Buyer.',
      'Buyer makes 100% payment by MT103 TT wire transfer for the total product and Seller pays Commission to all intermediaries involved in the transaction within 24 hours after confirmation of the Buyer\'s payment.',
    ],
  },
  {
    id: 'fob-ttv',
    name: 'FOB TTV Transaction Procedure',
    shortName: 'FOB TTV',
    applicableTo: ['FOB'],
    steps: [
      'Buyer issues official ICPO addressed to the refinery or representative.',
      'Seller issues Commercial Invoice (CI); Buyer signs and returns the signed invoice to the Seller.',
      'Seller issues to the Buyer the partial proof of product documents: (a) ATSC Authority to sell and collect, (b) Certificate of Origin of the Product, (c) DTA - Dip Test Authorization, (d) Product Passport - Product analysis report from a renowned inspection company, (e) Statement of Product Availability, (f) Commitment Letter to Supply, (g) ATV - Authority to verify the existence of product via email or phone call.',
      'Buyer extends Seller\'s tank (minimum 3 days) and receives full GPS coordinates of the tanks, Hub Numbers, terminal access permit and dip test is conducted immediately with Buyer\'s team to obtain fresh SGS report.',
      'After a successful Dip Test in Seller\'s tanks, Buyer takes over Seller\'s tank or Seller injects into Buyer\'s vessel/tank and Buyer conducts its DIP TEST Inspection for Q&Q of the Petroleum Products aboard vessel/tank.',
      'Buyer after a successful Q&Q Dip test on the product, makes payment for the total product injected into the tanks through MT103 - TT or USDT.',
      'Upon Seller receiving payment, Seller issues to the Buyer the Title ownership of the product and all exporting documents. Seller pays all intermediaries involved in the transaction.',
    ],
  },
  {
    id: 'cif-sblc',
    name: 'International Standard CIF Transaction on SBLC',
    shortName: 'CIF SBLC',
    applicableTo: ['CIF'],
    steps: [
      'Buyer issues ICPO on Buyer\'s company letterhead together with company certificate, passport copy, and full banking details to Seller.',
      'Seller issues draft contract (open for amendments) to Buyer. Buyer signs, seals and returns the draft contract to Seller for final endorsement along with acceptance letter on Buyer letterhead to issue the payment instrument or pay 5% of the trial total cost via MT103 TT Wire Transfer as security guarantee deposit fee. Seller issues partial settlement documents: (i) Refinery Commitment Letter to Supply, (ii) Statement of Product Availability, (iii) Certificate of Origin, (iv) Product Quality Passport, (v) Refinery Letter of Guarantee Refund/Supply, (vi) Pro-Forma Invoice.',
      'Upon examination of Seller\'s settlement documents, Buyer\'s Top Prime bank issues SBLC via SWIFT MT760 according to Seller\'s approved verbiage covering the total cargo value, valid for sixty days within 5 banking days, or Buyer makes 5% cash deposit via MT103 TT Wire transfer for trial cost within 5 banking days as security guarantee. Seller\'s bank issues full settlement documents to the Buyer\'s bank alongside with the 2% Performance Bond (PB).',
      'Shipment commences as per the signed contract delivery schedule and should arrive at Buyer\'s discharge port within 5-25 days. SGS inspection will be borne by the Seller at the loading seaport and the Buyer at the discharge seaport.',
      'Upon Vessel\'s arrival and finalization of SGS at the destination port, Buyer releases payment via SWIFT fund transfer within 24-48 hours to Seller for total shipment value after discharge of product at destination port and receipt of the entire relevant shipping and export documents.',
      'Seller pays the commissions within 48 hours by SWIFT MT103 to all intermediaries as signed the NCNDA/IMFPA.',
    ],
  },
  {
    id: 'cif-escrow',
    name: 'Escrow Procedure for CIF Transaction',
    shortName: 'CIF Escrow',
    applicableTo: ['CIF'],
    steps: [
      'Buyer issues ICPO on Buyer company letterhead with CIS/KYC and banking details addressed to Seller.',
      'Seller issues draft contract (open for amendments) to Buyer who signs, seals and returns to Seller for final endorsement along with acceptance letter to issue 50% of the total trial cost via escrow deposit fee. Seller issues partial proof of product (PPOP): (i) Commitment Letter to Supply, (ii) Statement of Product Availability, (iii) Certificate of Origin, (iv) Product Quality Passport, (v) Company Registration Certificate.',
      'Upon examination of Seller\'s PPOP by Buyer, Seller provides their Escrow Agent information for Buyer to contact and finalize on the Escrow agreement.',
      'Seller and Buyer deposit 50% each of the total trial cost via Escrow deposit into Seller\'s Escrow/Law firm nominated account, which will be deducted from the total cost of product after inspection at discharge port.',
      'Upon confirmation of the 50% deposit by Buyer and Seller, funds are held in the agreed escrow account and released after inspection at discharge port along with the balance of 50% for discharge costs. Seller issues full POP documents alongside the 2% Performance Bond (PB).',
      'Shipment commences as per the signed contract delivery schedule and should arrive at Buyer\'s discharge port within 5-25 days. SGS inspection borne by Seller at loading seaport and Buyer at unloading seaport.',
      'Buyer releases the remaining 50% payment along with the 50% in Escrow by Escrow agent to Seller by TT, MT103 or GPI upon receipt of shipping documents and confirmation of Q&Q by SGS/CIQ at destination port.',
      'Seller pays commissions within 48 hours by SWIFT MT103, TT or GPI to all intermediaries as signed the NCNDA/IMFPA.',
    ],
  },
];

export function getProceduresForTerm(term: 'FOB' | 'CIF'): ProcedureTemplate[] {
  return PROCEDURES.filter(p => p.applicableTo.includes(term));
}

export function getProcedureById(id: string): ProcedureTemplate | undefined {
  return PROCEDURES.find(p => p.id === id);
}

export function formatProcedureSteps(steps: string[]): string {
  return steps.map((step, i) => `${i + 1}. ${step}`).join('\n\n');
}
