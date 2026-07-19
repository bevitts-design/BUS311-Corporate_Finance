const timing = (modelMinutes = 15) => ({
  opening: 7,
  part1: 14,
  part2: 15,
  model: modelMinutes,
  part3: 14,
  discussion: 7,
  close: 3 + (15 - modelMinutes)
});

export const visualProfiles = {
  'foundations-m01-l01': {
    lectureCase: 'Costco', practiceCase: 'Costco', hero: 'foundations',
    factsetView: 'Company overview · cash flow · capital allocation',
    evidenceLabel: 'Value is a decision, not a reported subtotal',
    chart: { kind: 'waterfall', labels: ['Cash benefit', 'Investment', 'Risk buffer'], values: [135, -100, -12], unit: '$m' },
    calculationSteps: ['Forecast incremental cash flows', 'Discount at the opportunity cost of capital', 'Accept only if the value margin survives risk'],
    decision: 'Fund the opportunity only when evidence-adjusted NPV remains positive.', timing: timing(12)
  },
  'foundations-m01-l02': {
    lectureCase: 'Apple', practiceCase: 'Apple', hero: 'foundations',
    factsetView: 'Market snapshot · price · diluted shares · field definitions',
    evidenceLabel: 'Price × shares measures common equity value',
    chart: { kind: 'bars', labels: ['Price effect', 'Share-count effect', 'Equity value'], values: [225, 15.2, 3420], unit: 'indexed' },
    calculationSteps: ['Confirm the price date', 'Confirm diluted shares and units', 'Multiply, reconcile, and distinguish equity value from enterprise value'],
    decision: 'Use market capitalization only after the date, units, and claim definition reconcile.', timing: timing(14)
  },
  'foundations-m02-l01': {
    lectureCase: 'Microsoft', practiceCase: 'Microsoft', hero: 'foundations',
    factsetView: 'Financials · standardized statements · filing reconciliation',
    evidenceLabel: 'Three statements must tell one cash story',
    chart: { kind: 'waterfall', labels: ['Revenue', 'COGS', 'OpEx', 'Interest', 'Taxes', 'Net income'], values: [1200, -520, -330, -40, -65, 245], unit: '$m' },
    calculationSteps: ['Build gross profit and EBIT', 'Subtract financing costs and taxes', 'Reconcile net income to operating cash flow'],
    decision: 'Trust the conclusion only when the statements reconcile and definitions match.', timing: timing(16)
  },
  'foundations-m02-l02': {
    lectureCase: 'Nike', practiceCase: 'Nike', hero: 'foundations',
    factsetView: 'Ratios · peer comparison · period and denominator definitions',
    evidenceLabel: 'A ratio becomes useful when its driver is visible',
    chart: { kind: 'bars', labels: ['Margin', 'Asset use', 'Leverage', 'ROE'], values: [12.4, 1.35, 1.39, 23.3], unit: '%' },
    calculationSteps: ['Align the flow numerator with average equity', 'Calculate ROE', 'Decompose the result into operating and financing drivers'],
    decision: 'Explain whether performance improved because of operations, efficiency, or leverage.', timing: timing(17)
  },
  'valuation-m01-l01': {
    lectureCase: 'Berkshire Hathaway', practiceCase: 'Berkshire Hathaway', hero: 'valuation',
    factsetView: 'Rates · maturity conventions · market opportunity cost',
    evidenceLabel: 'Time and rate conventions determine the answer',
    chart: { kind: 'curve', labels: ['0', '1', '2', '3', '4', '5'], values: [10000, 10800, 11664, 12597, 13605, 14693], unit: '$' },
    calculationSteps: ['Draw the cash-flow timeline', 'Match the annual rate to annual periods', 'Compound the present amount through year five'],
    decision: 'Use the valuation only after timing, rate, period, and sign conventions agree.', timing: timing(17)
  },
  'valuation-m02-l01': {
    lectureCase: 'Caterpillar', practiceCase: 'Meridian Industrial Corp.', hero: 'valuation',
    factsetView: 'Fixed income security overview · coupon · maturity · price · YTM',
    evidenceLabel: 'Yield moves; contractual cash flows do not',
    chart: { kind: 'curve', labels: ['4%', '5%', '6%', '7%', '8%'], values: [1081, 1000, 926, 858, 796], unit: '$ price' },
    calculationSteps: ['Convert coupon and yield to semiannual periods', 'Value the coupon annuity', 'Value principal at maturity', 'Add both present values and interpret the discount'],
    decision: 'Recommend the bond only after price, yield, duration, and credit capacity are considered together.', timing: timing(19)
  },
  'valuation-m03-l01': {
    lectureCase: 'Reddit', practiceCase: 'Apex Technologies', hero: 'valuation',
    factsetView: 'IPO profile · estimates · peer multiples · ownership',
    evidenceLabel: 'One valuation method is an opinion; a range is an argument',
    chart: { kind: 'bars', labels: ['DDM', 'Peer multiple', 'Downside', 'Base', 'Upside'], values: [40, 47, 32, 43, 55], unit: '$/share' },
    calculationSteps: ['Estimate next-period cash flow', 'Choose a defensible required return and growth rate', 'Calculate intrinsic value', 'Triangulate with multiples and scenario evidence'],
    decision: 'Recommend a range and identify the assumption most likely to reverse it.', timing: timing(19)
  },
  'valuation-m04-l01': {
    lectureCase: 'Walmart', practiceCase: 'Harborside Medical Center', hero: 'valuation',
    factsetView: 'Company financials · capital spending · hurdle-rate evidence',
    evidenceLabel: 'The best project creates value after timing and risk',
    chart: { kind: 'bars', labels: ['8%', '10%', '12%', '14%'], values: [67, 25, -12, -45], unit: '$k NPV' },
    calculationSteps: ['Define incremental after-tax cash flows', 'Discount future cash flows', 'Add the initial outlay at time zero', 'Stress-test NPV before recommending the project'],
    decision: 'Select the project with the strongest positive NPV that survives defensible downside assumptions.', timing: timing(20)
  },
  'decisions-m01-l01': {
    lectureCase: 'Boeing', practiceCase: 'Boeing', hero: 'decisions',
    factsetView: 'Beta · price history · benchmark · return window',
    evidenceLabel: 'Beta converts market exposure into a required return',
    chart: { kind: 'curve', labels: ['0.8', '1.0', '1.25', '1.5', '1.8'], values: [8.8, 10.0, 11.5, 13.0, 14.8], unit: '% return' },
    calculationSteps: ['Define the risk-free rate and market premium', 'Document beta and its estimation window', 'Calculate CAPM required return', 'Explain what beta does not capture'],
    decision: 'Use CAPM as a disciplined estimate, then disclose model and company-specific risks.', timing: timing(18)
  },
  'decisions-m02-l01': {
    lectureCase: 'Target', practiceCase: 'Target', hero: 'decisions',
    factsetView: 'Capital structure · beta · debt yield · market values',
    evidenceLabel: 'WACC is a financing-weighted opportunity cost',
    chart: { kind: 'waterfall', labels: ['Equity contribution', 'Debt contribution', 'Tax shield', 'WACC'], values: [7.35, 1.74, -0.43, 8.66], unit: '%' },
    calculationSteps: ['Estimate current component costs', 'Use market-value financing weights', 'Apply the marginal tax shield to debt', 'Combine components and test project-risk fit'],
    decision: 'Apply WACC only to cash flows with matching risk and claim definitions.', timing: timing(20)
  },
  'decisions-m03-l01': {
    lectureCase: 'Delta Air Lines', practiceCase: 'Delta Air Lines', hero: 'decisions',
    factsetView: 'Debt maturity · liquidity · coverage · capital structure',
    evidenceLabel: 'Financing capacity disappears before accounting equity does',
    chart: { kind: 'bars', labels: ['Base EBIT', 'Downside EBIT', 'Interest', 'Base coverage', 'Downside coverage'], values: [1200, 750, 300, 4.0, 2.5], unit: 'mixed' },
    calculationSteps: ['Measure base interest coverage', 'Apply the downside EBIT case', 'Compare coverage with liquidity and maturity needs'],
    decision: 'Choose the financing mix that preserves value, resilience, and strategic flexibility.', timing: timing(17)
  }
};

export function totalMinutes(profile) {
  return Object.values(profile.timing).reduce((sum, value) => sum + value, 0);
}
