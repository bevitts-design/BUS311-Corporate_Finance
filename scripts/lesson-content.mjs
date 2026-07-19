const idea = (title, body, note, image) => ({ title, body, note, image });

export const lessonContent = [
  {
    id: 'foundations-m01-l01', track: 'foundations', module: 'M01', lesson: 'L01',
    title: 'Corporate Finance and Value Creation', caseStudy: 'Costco', outcomes: ['LO1'],
    objectives: ['Frame the financial manager’s three decisions', 'Distinguish value creation from accounting profit', 'Evaluate stakeholder trade-offs ethically'],
    bridge: 'BUS210 measured money over time; BUS311 decides where corporate money should go.',
    parts: [
      { title: 'The finance function', items: [
        idea('Invest', 'Choose assets whose benefits exceed their costs.', 'Capital budgeting asks which long-lived investments deserve scarce funds. The relevant comparison is incremental future cash flow versus opportunity cost, not whether a proposal sounds exciting.', 'Capital allocation committee reviewing investments'),
        idea('Finance', 'Choose a resilient mix of debt and equity.', 'Financing decisions affect risk, flexibility, taxes, and the claims different investors hold. There is no universally correct mix; the answer depends on the firm and its strategy.', 'Debt and equity claims flowing into a company'),
        idea('Distribute', 'Return cash only after funding valuable opportunities.', 'Payout policy includes dividends and repurchases. A company should not retain cash merely to grow larger; retained funds should have a credible value-creating use.', 'Dividend and repurchase decision diagram')
      ]},
      { title: 'Value, cash flow, and incentives', items: [
        idea('Cash beats labels', 'Value follows timing, risk, and cash—not accounting labels.', 'Accounting profit is necessary information but not the valuation endpoint. Finance translates operating performance into expected cash flows, timing, and risk.', 'Cash-flow timeline beside an income statement'),
        idea('Opportunity cost', 'Every dollar invested gives up its next-best use.', 'The cost of capital reflects what investors could earn on investments with comparable risk. A project creates value only when it clears that opportunity-cost hurdle.', 'Forked road labeled project and alternative'),
      ]},
      { title: 'Governance and judgment', items: [
        idea('Agency tension', 'Managers may prefer growth, safety, or status over value.', 'Governance systems align managers with owners and other stakeholders through oversight, incentives, disclosure, and accountability. Incentives should reward durable outcomes rather than short-term optics.', 'Board oversight and management incentive loop'),
        idea('Stakeholders matter', 'Value creation must survive legal, ethical, and operational reality.', 'Customers, employees, suppliers, communities, and creditors influence the firm’s ability to generate cash. Ignoring them can convert a short-term gain into a long-term liability.', 'Stakeholder network around a company'),
        idea('Decision standard', 'Recommend the choice with the strongest evidence-adjusted value.', 'A professional finance recommendation names the decision, quantifies the value case, identifies key risks, and explains what evidence could change the conclusion.', 'CFO decision memo with evidence and risks')
      ]}
    ],
    worked: { title: 'Value-creation screen', excel: '=NPV(discount_rate, future_cash_flows)+initial_outlay', math: 'PV of benefits − required investment', answer: 'Accept only when NPV is positive after risk-appropriate discounting.', note: 'Use this as a preview rather than a full NPV lesson. Emphasize that every later BUS311 model supports this same decision standard.' },
    discussion: ['When might maximizing this quarter’s earnings reduce long-run value?', 'Which Costco stakeholder relationship most directly supports durable cash flow?'],
    takeaways: ['Finance allocates scarce capital', 'Value depends on cash, timing, and risk', 'Recommendations must explain trade-offs'],
    next: 'Trace capital from savers through institutions and markets.'
  },
  {
    id: 'foundations-m01-l02', track: 'foundations', module: 'M01', lesson: 'L02',
    title: 'Financial Institutions, Markets, and Ethics', caseStudy: 'Apple', outcomes: ['LO1', 'LO5'],
    objectives: ['Map institutions to capital-allocation roles', 'Explain primary and secondary markets', 'Use FactSet data without overstating evidence'],
    bridge: 'Corporate decisions require capital; markets connect those decisions to investors.',
    parts: [
      { title: 'The capital-allocation system', items: [
        idea('Financial institutions', 'Banks, funds, and insurers transform savings into capital.', 'Institutions reduce search, information, transaction, and risk-sharing frictions. Their business models differ, but each helps move funds toward uses investors consider worthwhile.', 'Capital flowing through banks funds and insurers'),
        idea('Direct markets', 'Bonds and shares connect issuers directly with investors.', 'Public securities let corporations raise large amounts from dispersed investors. Standardized claims, disclosure, and trading infrastructure make those claims easier to evaluate and exchange.', 'Bond and stock issuance pipeline'),
        idea('Information matters', 'Prices aggregate expectations, not certainty.', 'Market prices reflect available beliefs and constraints. A price is useful evidence, but it is not proof that the market forecast will be correct.', 'Market price screen with competing forecasts')
      ]},
      { title: 'Issuance, trading, and price', items: [
        idea('Primary market', 'New securities move cash from investors to issuers.', 'An IPO, seasoned equity offering, or bond issue raises capital for the firm or selling owners. The issuance terms determine new claims and potential dilution.', 'IPO book-building illustration'),
        idea('Secondary market', 'Trading changes ownership and reveals required returns.', 'Secondary trading usually does not send new cash to the issuer, but liquidity and price discovery affect the terms on which the firm can raise capital later.', 'Exchange order book and liquidity'),
      ]},
      { title: 'Ethics and data discipline', items: [
        idea('Material information', 'Never trade or advise from improperly obtained material information.', 'CFA ethical principles emphasize integrity, duties to clients and employers, and fair dealing. Students should pause when data access, disclosure status, or intended use is uncertain.', 'Compliance checkpoint before a trade'),
        idea('FactSet is evidence', 'Record source, period, units, and retrieval date.', 'A professional model identifies exactly what a metric means. Mixing fiscal periods, currencies, adjusted values, or stale retrieval dates can produce confident but invalid comparisons.', 'FactSet field definition and audit trail'),
        idea('Market-cap discipline', 'Price × diluted shares is a starting point, not enterprise value.', 'Market capitalization values common equity. Enterprise value adjusts for debt, cash, and other claims, so the two measures answer different questions.', 'Equity value to enterprise value bridge')
      ]}
    ],
    worked: { title: 'Market capitalization', excel: '=share_price*diluted_shares_outstanding', math: '$225 × 15.2 billion shares', answer: '$3.42 trillion equity value.', note: 'Ask students to confirm the price date, share-count period, and units before multiplying. The workbook extends this across a FactSet peer set.' },
    discussion: ['Why does a liquid secondary market lower the cost of raising capital?', 'Which FactSet field-definition error could most distort a peer comparison?'],
    takeaways: ['Institutions reduce financing frictions', 'Primary and secondary markets serve different roles', 'Ethical analysis requires an audit trail'],
    next: 'Follow market information into the financial statements.'
  },
  {
    id: 'foundations-m02-l01', track: 'foundations', module: 'M02', lesson: 'L01',
    title: 'Financial Statements and Cash Flow', caseStudy: 'Microsoft', outcomes: ['LO2'],
    objectives: ['Connect the three primary statements', 'Separate operating performance from financing', 'Locate decision-useful 10-K evidence'],
    bridge: 'Markets price claims; financial statements reveal the operating engine behind those claims.',
    parts: [
      { title: 'Three statements, three questions', items: [
        idea('Income statement', 'Did operations create accounting profit during the period?', 'The income statement reports revenues, expenses, and profit over time. Analysts inspect margins, nonrecurring items, and the relationship between operating income and financing costs.', 'Income statement waterfall'),
        idea('Balance sheet', 'What resources and claims exist at one date?', 'Assets describe controlled resources; liabilities and equity describe financing claims. Working capital and invested capital connect the statement to operating and financing decisions.', 'Balance sheet with assets and claims'),
        idea('Cash-flow statement', 'Why did cash change during the period?', 'Operating, investing, and financing sections reconcile accrual accounting to cash. The classification helps analysts distinguish business generation, reinvestment, and capital-provider transactions.', 'Operating investing financing cash flows')
      ]},
      { title: 'The statement links', items: [
        idea('Profit rolls into equity', 'Net income affects retained earnings after distributions.', 'Closing entries connect income to shareholders’ equity. Dividends and repurchases then explain why retained earnings and total equity may move differently.', 'Net income to retained earnings bridge'),
        idea('Cash closes the loop', 'Ending cash must agree across cash flow and balance sheet.', 'A model that does not reconcile ending cash is incomplete. This tie-out is one of the most useful first checks in financial analysis.', 'Cash roll-forward check')
      ]},
      { title: 'From filings to judgment', items: [
        idea('Footnotes define reality', 'Policies and estimates can change what headline numbers mean.', 'Revenue recognition, leases, stock compensation, segment definitions, and contingencies often require footnote review. Analysts should not compare metrics before checking definitions.', '10-K footnote magnifier'),
        idea('Quality of earnings', 'Sustainable cash generation matters more than one reported number.', 'Large accruals, repeated adjustments, weak cash conversion, or dependence on asset sales can signal that headline earnings overstate recurring performance.', 'Earnings to operating cash comparison'),
        idea('FactSet workflow', 'Pull, define, reconcile, then interpret.', 'FactSet accelerates retrieval but does not remove the need to reconcile a value to the filing. Save the field name, period, units, and source link with every important input.', 'FactSet to 10-K reconciliation path')
      ]}
    ],
    worked: { title: 'Build net income', excel: '=revenue-cogs-operating_expenses-interest-taxes', math: '1,200 − 520 − 330 − 40 − 65', answer: '$245 million net income.', note: 'Use the workbook to construct subtotals and then reconcile operating cash flow to the supplied statement data.' },
    discussion: ['Why can a profitable company report declining cash?', 'Which footnote would you inspect before comparing Microsoft with a peer?'],
    takeaways: ['Each statement answers a different question', 'The statements must reconcile', 'Definitions and footnotes shape interpretation'],
    next: 'Turn statements into comparable performance signals.'
  },
  {
    id: 'foundations-m02-l02', track: 'foundations', module: 'M02', lesson: 'L02',
    title: 'Ratio Analysis and Corporate Performance', caseStudy: 'Nike', outcomes: ['LO2', 'LO3'],
    objectives: ['Calculate ratios from consistent inputs', 'Interpret ratios through drivers and peers', 'Avoid denominator and period mismatches'],
    bridge: 'Statements organize the evidence; ratios make patterns and comparisons visible.',
    parts: [
      { title: 'Ratio families', items: [
        idea('Liquidity', 'Can near-term resources cover near-term obligations?', 'Current and quick ratios provide a snapshot, but analysts also inspect cash conversion and credit access. Too much liquidity may indicate idle capital rather than strength.', 'Working-capital cycle'),
        idea('Profitability', 'How effectively does the firm convert activity into profit?', 'Margins isolate different layers of economics. ROA and ROE combine income with the asset or equity base used to generate it.', 'Margin ladder from gross to net'),
        idea('Leverage', 'How much fixed financial obligation supports the business?', 'Debt ratios and interest coverage capture different dimensions of financing risk. A level that is manageable for stable utilities may be dangerous for cyclical firms.', 'Debt and coverage gauge')
      ]},
      { title: 'Interpret, do not merely calculate', items: [
        idea('DuPont logic', 'ROE reflects margin, efficiency, and leverage.', 'Breaking ROE into components prevents a misleading conclusion. A high ROE driven by better operations is different from a high ROE created by a thin equity base.', 'Three-part DuPont bridge'),
        idea('Peer context', 'A ratio gains meaning through trend, target, and comparison.', 'Compare the same definition, period, and accounting basis. Industry structure, strategy, seasonality, and business mix explain why healthy ratios differ across firms.', 'Peer benchmark distribution')
      ]},
      { title: 'Analytical safeguards', items: [
        idea('Match periods', 'Flow numerators usually require average balance-sheet denominators.', 'Income covers a period while balance-sheet values represent dates. Average assets or average equity better align the denominator with the activity that generated the numerator.', 'Beginning and ending balance average'),
        idea('Check signs and units', 'Percent, decimal, millions, and dollars are not interchangeable.', 'Many spreadsheet errors are unit errors. Label currency scale, express percentages as decimals in formulas, and verify that debt and cash signs match the chosen convention.', 'Unit audit checklist'),
        idea('Explain the driver', 'A useful conclusion names what changed and why it matters.', 'Move from result to driver to implication: the ratio changed, a specific numerator or denominator caused it, and the change affects risk, return, or strategy.', 'Result driver implication chain')
      ]}
    ],
    worked: { title: 'Return on equity', excel: '=net_income/AVERAGE(beginning_equity,ending_equity)', math: '245 ÷ ((1,000 + 1,100) ÷ 2)', answer: '23.3% ROE.', note: 'Ask whether the result came from stronger profitability, asset use, or leverage. The workbook dashboard supports the driver discussion.' },
    discussion: ['When might a lower current ratio reflect better management?', 'How could a share repurchase increase ROE without improving operations?'],
    takeaways: ['Use consistent definitions and periods', 'Decompose ratios into drivers', 'Connect every ratio to a decision implication'],
    next: 'Value cash flows that arrive at different times.'
  },
  {
    id: 'valuation-m01-l01', track: 'valuation', module: 'M01', lesson: 'L01',
    title: 'Time Value of Money', caseStudy: 'Berkshire Hathaway', outcomes: ['LO4'],
    objectives: ['Draw cash-flow timelines', 'Solve present and future value', 'Match rate and period conventions'],
    bridge: 'Performance measures describe the past; valuation converts future cash into today’s terms.',
    parts: [
      { title: 'The valuation grammar', items: [
        idea('Timeline first', 'Place every cash flow at an exact point in time.', 'A timeline exposes whether a payment occurs today, at period-end, or at period-beginning. Most TVM errors start before the formula because timing was never made explicit.', 'Cash-flow timeline'),
        idea('Compounding', 'Future value moves cash forward through reinvestment.', 'Each period earns a return on the original principal and prior accumulated returns. Longer time and higher rates amplify the compounding effect.', 'Compounding curve'),
        idea('Discounting', 'Present value moves future cash back at opportunity cost.', 'The discount rate compensates for time and risk. A higher required return lowers what a future cash flow is worth today.', 'Discounting funnel')
      ]},
      { title: 'Rates and periods must agree', items: [
        idea('Periodic rate', 'Convert the quoted rate to the cash-flow period.', 'For monthly cash flows, use a monthly rate and monthly count unless an effective rate is supplied. Never divide an effective annual rate by twelve without checking its definition.', 'Annual to periodic rate conversion'),
        idea('Sign convention', 'Excel treats cash paid and cash received with opposite signs.', 'Financial functions use directional cash flows. If PV is entered as a cash outflow, FV usually appears as a positive inflow; inconsistent signs create confusing results.', 'Cash outflow and inflow arrows')
      ]},
      { title: 'Cash-flow patterns', items: [
        idea('Lump sum', 'One cash flow uses one compounding or discounting path.', 'Lump-sum PV and FV are the foundation. Multi-period securities and projects then add together the values of multiple dated cash flows.', 'Single payment timeline'),
        idea('Annuity', 'Equal periodic cash flows can be valued as one pattern.', 'Ordinary annuities pay at period-end; annuities due pay at period-beginning. That one-period timing difference changes value.', 'Ordinary annuity versus annuity due'),
        idea('Perpetuity', 'A stable infinite stream has a compact valuation rule.', 'A level perpetuity is cash flow divided by required return, provided the first payment arrives one period from now. Growth requires a separate growing-perpetuity condition.', 'Perpetuity timeline')
      ]}
    ],
    worked: { title: 'Future value', excel: '=FV(8%,5,0,-10000)', math: '$10,000 × (1.08)^5', answer: '$14,693.28 future value.', note: 'Have students solve manually and in Excel, then change only the timing or rate to observe sensitivity.' },
    discussion: ['Why does a higher discount rate reduce present value?', 'What mistake occurs when monthly payments use an annual period count?'],
    takeaways: ['Draw the timeline before choosing a formula', 'Match rates to periods', 'Treat signs as cash-flow direction'],
    next: 'Apply TVM to coupon bonds and yield to maturity.'
  },
  {
    id: 'valuation-m02-l01', track: 'valuation', module: 'M02', lesson: 'L01',
    title: 'Bond Valuation, Interest Rates, and YTM', caseStudy: 'Meridian Industrial Corp.', outcomes: ['LO4', 'LO5'],
    objectives: ['Price coupon bonds', 'Interpret yield to maturity', 'Explain interest-rate and credit risk'],
    bridge: 'A bond is a dated package of cash flows valued with TVM.',
    parts: [
      { title: 'Bond cash flows', items: [
        idea('Coupon stream', 'Coupons compensate investors while principal remains outstanding.', 'The coupon rate determines contractual payments from par value. It does not change merely because market yields move.', 'Coupon timeline'),
        idea('Principal repayment', 'Par value returns at maturity unless default intervenes.', 'The final cash flow includes both the last coupon and principal. Credit risk affects whether investors expect the promised amount to arrive.', 'Maturity payment stack'),
        idea('Price is present value', 'Discount every promised cash flow at the market-required yield.', 'A bond price equals the PV of coupons plus the PV of principal. The required yield reflects current base rates, maturity, liquidity, taxes, and credit risk.', 'Coupons and principal converging to price')
      ]},
      { title: 'Price and yield move oppositely', items: [
        idea('Premium bond', 'Coupon rate above market yield produces price above par.', 'Investors pay more because the contract offers coupons richer than newly issued comparable debt. The premium amortizes as maturity approaches.', 'Premium bond path to par'),
        idea('Discount bond', 'Coupon rate below market yield produces price below par.', 'A lower price raises the return earned from coupons plus the pull toward par. Price must adjust because the contractual coupon cannot.', 'Discount bond path to par')
      ]},
      { title: 'Risk and corporate impact', items: [
        idea('Duration intuition', 'Longer and lower-coupon bonds react more to rate changes.', 'More value arriving far in the future increases sensitivity to discount-rate changes. Duration provides a compact measure of that exposure.', 'Rate shock and bond price sensitivity'),
        idea('Credit spread', 'Riskier issuers must offer yield above safer benchmarks.', 'Spreads compensate for expected loss, uncertainty, liquidity, and risk aversion. Widening spreads reduce existing bond prices even if Treasury yields do not move.', 'Treasury yield plus credit spread'),
        idea('Debt changes ratios', 'Issuance affects liquidity, leverage, coverage, and flexibility.', 'The use of proceeds matters. Refinancing short-term debt differs from funding uncertain expansion, even when the bond terms are identical.', 'Debt issuance scenario comparison')
      ]}
    ],
    worked: { title: 'Semiannual bond price', excel: '=-PV(6%/2,10*2,1000*5%/2,1000)', math: 'PV of 20 coupons + PV of $1,000 principal', answer: '$925.61 when YTM exceeds the coupon rate.', note: 'Use the MRID workbook to connect pricing mechanics to the issuer’s post-offering ratios and CFO recommendation.' },
    discussion: ['Why do bond prices fall when required yields rise?', 'How should MRID’s use of proceeds affect your financing recommendation?'],
    takeaways: ['Price equals discounted coupons plus principal', 'Yield and price move inversely', 'Debt terms and use of proceeds shape risk'],
    next: 'Value equity claims with dividends, growth, and market multiples.'
  },
  {
    id: 'valuation-m03-l01', track: 'valuation', module: 'M03', lesson: 'L01',
    title: 'Equity Valuation and IPO Analysis', caseStudy: 'Apex Technologies', outcomes: ['LO4', 'LO5'],
    objectives: ['Use dividend-based valuation', 'Interpret relative valuation multiples', 'Test IPO pricing scenarios'],
    bridge: 'Bonds promise contractual cash flows; equity receives uncertain residual cash flows.',
    parts: [
      { title: 'The equity claim', items: [
        idea('Residual ownership', 'Shareholders receive value after contractual claims are met.', 'Equity has no maturity and no guaranteed payout. Its value depends on future distributions, growth opportunities, and the risk of those outcomes.', 'Capital claims waterfall'),
        idea('Return sources', 'Investor return combines cash distributions and price change.', 'Dividends and repurchases return cash, while price appreciation reflects changing expectations about future cash flow and required return.', 'Dividend plus capital gain'),
        idea('Growth must earn', 'Reinvestment creates value only above its opportunity cost.', 'Retaining more earnings does not automatically increase value. Growth adds value when reinvested capital earns more than the return investors require.', 'Reinvestment return versus required return')
      ]},
      { title: 'Valuation approaches', items: [
        idea('Dividend discount', 'Value equals the present value of expected dividends.', 'The constant-growth model is useful for stable firms when growth is below the required return. Its output is highly sensitive to the spread between those two rates.', 'Dividend stream valuation'),
        idea('Market multiples', 'Compare price with a consistently defined operating or equity metric.', 'P/E compares equity value with earnings; EV/EBITDA compares enterprise value with a pre-financing operating measure. Match numerator and denominator claims.', 'Equity and enterprise multiple matching')
      ]},
      { title: 'IPO judgment', items: [
        idea('Offer price', 'The IPO price balances issuer proceeds and investor demand.', 'Underpricing may support aftermarket performance but transfers value from existing owners to new investors. Overpricing risks weak demand and reputation damage.', 'IPO pricing range'),
        idea('Dilution', 'New shares change ownership and per-share economics.', 'Analysts must use post-offering diluted shares and trace how proceeds affect cash, debt, investment, and future earnings.', 'Pre and post IPO ownership'),
        idea('Scenario discipline', 'Test valuation against growth, margin, and multiple assumptions.', 'A single point estimate hides uncertainty. Base, downside, and upside cases reveal which assumptions truly drive the recommendation.', 'Three-case valuation range')
      ]}
    ],
    worked: { title: 'Constant-growth stock value', excel: '=next_dividend/(required_return-growth_rate)', math: '$2.40 ÷ (10% − 4%)', answer: '$40.00 intrinsic value.', note: 'Stress that required return must exceed perpetual growth. The Apex workbook adds multiples and scenario analysis to avoid relying on one method.' },
    discussion: ['When is P/E a misleading comparison?', 'Who benefits and who loses when an IPO is intentionally underpriced?'],
    takeaways: ['Equity is a residual claim', 'Match valuation methods to claim definitions', 'Use scenarios instead of false precision'],
    next: 'Choose projects by incremental cash flow and value created.'
  },
  {
    id: 'valuation-m04-l01', track: 'valuation', module: 'M04', lesson: 'L01',
    title: 'Capital Budgeting and Project Selection', caseStudy: 'Harborside Medical Center', outcomes: ['LO4', 'LO6'],
    objectives: ['Identify incremental project cash flows', 'Calculate NPV, IRR, and PI', 'Recommend under capital constraints'],
    bridge: 'Security valuation prices claims; capital budgeting values operating investments.',
    parts: [
      { title: 'Build the cash-flow case', items: [
        idea('Incremental only', 'Include cash flows that change because the project is accepted.', 'Exclude allocated costs that will not change. Include opportunity costs, side effects, and changes in working capital caused by the decision.', 'With-project minus without-project cash flows'),
        idea('Sunk costs', 'Past spending cannot be changed by today’s decision.', 'Research or consulting already paid is irrelevant to accept-or-reject analysis. Emotional attachment to sunk cost is a common source of value destruction.', 'Sunk cost crossed out'),
        idea('Terminal effects', 'Recover working capital and include disposal consequences.', 'End-of-project cash flow may include asset sale proceeds, taxes on gains or losses, cleanup costs, and working-capital recovery.', 'Terminal cash-flow bridge')
      ]},
      { title: 'Decision measures', items: [
        idea('NPV', 'Accept projects that add positive present value.', 'NPV directly estimates value created in dollars at the required return. For mutually exclusive projects, choose the feasible alternative with the highest positive NPV.', 'NPV value bridge'),
        idea('IRR and PI', 'Use supporting metrics without overriding value.', 'IRR is intuitive but can mislead with unusual cash-flow signs or scale differences. Profitability index helps rank value created per constrained investment dollar.', 'NPV IRR PI comparison')
      ]},
      { title: 'Risk and recommendation', items: [
        idea('Sensitivity', 'Change one driver to locate the fragile assumptions.', 'Sensitivity analysis identifies which input has the greatest effect on NPV. It does not assign probabilities, but it focuses due diligence.', 'One-variable sensitivity bars'),
        idea('Scenarios', 'Change coherent sets of assumptions together.', 'Downside, base, and upside cases capture operating relationships better than independent changes. Each scenario should have a clear business narrative.', 'Three scenario panels'),
        idea('Capital rationing', 'Fund the portfolio that creates the most feasible value.', 'When capital is limited, rankings must respect project indivisibility, dependencies, strategic constraints, and risk—not just one ratio.', 'Project portfolio selection')
      ]}
    ],
    worked: { title: 'Net present value', excel: '=NPV(10%,year1:year4)+initial_outlay', math: 'PV of future inflows − $500,000 investment', answer: 'Accept when calculated NPV is positive and assumptions are defensible.', note: 'Use the Harborside workbook to compare NPV, IRR, PI, and narrative risks before writing the recommendation.' },
    discussion: ['Why should sunk costs be excluded?', 'When might the highest-IRR project not be the best decision?'],
    takeaways: ['Model incremental after-tax cash flows', 'Let NPV lead the decision', 'Use sensitivity to focus judgment'],
    next: 'Measure the risk investors require the firm to compensate.'
  },
  {
    id: 'decisions-m01-l01', track: 'decisions', module: 'M01', lesson: 'L01',
    title: 'Risk, Return, and CAPM', caseStudy: 'Boeing', outcomes: ['LO5'],
    objectives: ['Calculate expected return and volatility', 'Interpret diversification and beta', 'Estimate required return with CAPM'],
    bridge: 'Capital budgeting needs a discount rate; risk determines the return investors require.',
    parts: [
      { title: 'Describe return and risk', items: [
        idea('Holding-period return', 'Combine income and price change over the same interval.', 'Return measurement must align dates and distributions. Comparing a price-only return with a total return leads to incorrect conclusions.', 'Price gain plus dividend'),
        idea('Expected return', 'Weight possible returns by their probabilities.', 'Expected return is the probability-weighted average outcome, not the most likely outcome. It represents the center of the distribution.', 'Probability distribution of returns'),
        idea('Volatility', 'Standard deviation measures dispersion around the average.', 'Volatility captures total variability but not the reason for it. Historical estimates are backward-looking and sensitive to measurement window and frequency.', 'Return distribution spread')
      ]},
      { title: 'Diversification changes the question', items: [
        idea('Company-specific risk', 'Firm events can be diversified across a portfolio.', 'Product failures, lawsuits, and management shocks may be severe for one company but have smaller effects on a broad portfolio.', 'Single-company shocks diversified away'),
        idea('Market risk', 'Economy-wide exposure remains after diversification.', 'Rates, recessions, inflation, and risk appetite affect many assets together. Investors require compensation for this nondiversifiable exposure.', 'Market shock affecting many firms')
      ]},
      { title: 'Beta and required return', items: [
        idea('Beta', 'Beta measures sensitivity to market movements, not total risk.', 'A beta above one indicates amplified market exposure; below one indicates lower sensitivity. Estimates depend on benchmark, interval, and sample period.', 'Stock return versus market slope'),
        idea('CAPM', 'Required return equals risk-free return plus priced market exposure.', 'CAPM links beta to the market risk premium. Its assumptions are simplified, so analysts should document sources and test the result against reasonableness.', 'Security market line'),
        idea('Decision use', 'Match the discount rate to the project’s risk.', 'A corporate average rate may misprice a project that is materially safer or riskier than existing operations. Risk follows the asset, not the funding label.', 'Projects positioned along a risk spectrum')
      ]}
    ],
    worked: { title: 'CAPM required return', excel: '=risk_free+beta*(market_return-risk_free)', math: '4.0% + 1.25 × (10.0% − 4.0%)', answer: '11.5% required return.', note: 'The workbook lets students change beta and the market risk premium, then explain why the required return changes.' },
    discussion: ['Why is Boeing volatility not the same as Boeing beta?', 'When should a project use a rate different from the company WACC?'],
    takeaways: ['Measure returns on a consistent basis', 'Diversification removes company-specific risk', 'CAPM prices market exposure through beta'],
    next: 'Combine investor-required returns into the company WACC.'
  },
  {
    id: 'decisions-m02-l01', track: 'decisions', module: 'M02', lesson: 'L01',
    title: 'Cost of Capital and WACC', caseStudy: 'Target', outcomes: ['LO5', 'LO6'],
    objectives: ['Estimate component costs of capital', 'Use market-value financing weights', 'Apply WACC as a project hurdle rate'],
    bridge: 'CAPM estimates equity return; WACC combines all long-term capital providers.',
    parts: [
      { title: 'Component costs', items: [
        idea('Cost of equity', 'Equity investors require compensation for market risk.', 'CAPM is a common estimate, supported by source-documented risk-free rate, beta, and market risk premium. Dividend models can provide a reasonableness check for stable payers.', 'CAPM inputs feeding cost of equity'),
        idea('Cost of debt', 'Current borrowing yield matters more than historical coupon.', 'The cost of debt reflects today’s required return on comparable borrowing. Because interest is generally tax-deductible, WACC uses the after-tax debt cost.', 'Debt yield and tax shield'),
        idea('Preferred stock', 'Preferred dividends create a distinct required-return claim.', 'When material, preferred stock receives its own component cost and market-value weight. It should not be forced into debt or common equity.', 'Three capital-provider claims')
      ]},
      { title: 'Weights and taxes', items: [
        idea('Market-value weights', 'Current claim values represent the opportunity-cost mix.', 'Book values describe accounting history. WACC normally uses market values because investor-required returns apply to current economic claims.', 'Book versus market capital weights'),
        idea('After-tax debt', 'The interest tax shield lowers debt’s effective cost.', 'Multiply the pretax debt cost by one minus the marginal tax rate, while recognizing that loss positions or interest limitations can reduce the realized shield.', 'Pretax debt to after-tax debt')
      ]},
      { title: 'Use WACC carefully', items: [
        idea('Matching principle', 'WACC fits projects with risk similar to existing operations.', 'Using one company WACC for every proposal can subsidize risky projects and reject safe ones. Adjust the rate or use comparable pure-play evidence when risk differs.', 'Risk matched hurdle rates'),
        idea('Consistent cash flow', 'Discount unlevered operating cash flow with WACC.', 'The numerator and discount rate must describe the same claim set. Financing cash flows should not be double-counted inside unlevered project cash flows.', 'Cash-flow and discount-rate matching'),
        idea('Sensitivity', 'WACC uncertainty can dominate long-duration valuations.', 'Because distant cash flows are sensitive to discount rates, show a range and explain which inputs drive it. Do not hide a precise WACC behind rounded assumptions.', 'WACC sensitivity table')
      ]}
    ],
    worked: { title: 'Weighted average cost of capital', excel: '=E_weight*cost_equity+D_weight*cost_debt*(1-tax_rate)', math: '70% × 10.5% + 30% × 5.8% × (1 − 25%)', answer: '8.66% WACC.', note: 'Use the Target-style workbook to calculate each component, confirm weights sum to 100%, and test the hurdle rate.' },
    discussion: ['Why are book-value weights usually inappropriate?', 'What happens when a risky project is discounted at an average company WACC?'],
    takeaways: ['Estimate current component costs', 'Use market-value weights', 'Match WACC to cash flow and project risk'],
    next: 'Choose a financing mix that supports value and resilience.'
  },
  {
    id: 'decisions-m03-l01', track: 'decisions', module: 'M03', lesson: 'L01',
    title: 'Capital Structure and Financing Decisions', caseStudy: 'Delta Air Lines', outcomes: ['LO5', 'LO6'],
    objectives: ['Compare debt and equity trade-offs', 'Evaluate financing capacity and flexibility', 'Write a defensible CFO recommendation'],
    bridge: 'WACC summarizes financing costs; capital structure determines the claims and constraints behind them.',
    parts: [
      { title: 'Debt and equity trade-offs', items: [
        idea('Debt advantages', 'Debt can add tax shields without diluting ownership.', 'Contractual payments and maturity discipline can reduce agency costs. The benefit is strongest when taxable income is stable and default risk remains manageable.', 'Debt tax shield versus fixed payments'),
        idea('Debt costs', 'Fixed obligations increase distress and lost-flexibility risk.', 'Distress costs include more than bankruptcy fees. Customers, employees, suppliers, and managers may change behavior long before a formal filing.', 'Financial distress ripple effects'),
        idea('Equity flexibility', 'Equity absorbs losses but dilutes ownership and upside.', 'Common equity has no required payment or maturity, making it resilient. Issuance can be expensive when information asymmetry or undervaluation is high.', 'Equity cushion and dilution')
      ]},
      { title: 'What determines capacity?', items: [
        idea('Cash-flow stability', 'Stable recurring cash flow supports more fixed obligations.', 'Cyclicality, operating leverage, customer concentration, and commodity exposure reduce safe debt capacity even when current ratios look strong.', 'Stable and cyclical cash-flow paths'),
        idea('Asset support', 'Collateral value and redeployability influence borrowing terms.', 'Tangible, marketable assets can support secured borrowing. Specialized or intangible assets often provide weaker recovery value in distress.', 'Collateral quality spectrum')
      ]},
      { title: 'Build the recommendation', items: [
        idea('Credit consequences', 'Ratings and covenant headroom affect future access.', 'A financing plan should test leverage, coverage, liquidity, maturity concentration, and covenant capacity under downside conditions.', 'Credit metrics dashboard'),
        idea('Financial flexibility', 'Preserve capacity for shocks and valuable future investments.', 'The cheapest financing today may be costly if it prevents the company from acting later. Flexibility has option value even when it is hard to observe directly.', 'Unused borrowing capacity as an option'),
        idea('CFO memo', 'State choice, evidence, risks, and monitoring triggers.', 'A decision-ready recommendation quantifies expected value, identifies the main downside, explains alternatives, and names indicators that would cause management to revisit the plan.', 'One-page CFO recommendation')
      ]}
    ],
    worked: { title: 'Interest coverage stress test', excel: '=EBIT/interest_expense', math: '$1.2 billion EBIT ÷ $300 million interest', answer: '4.0× base coverage; rerun under the downside EBIT case.', note: 'The workbook compares project financing choices and requires a recommendation grounded in cash flow, coverage, and flexibility.' },
    discussion: ['Why might Delta choose equity even when debt appears cheaper?', 'Which downside assumption matters most for debt capacity?'],
    takeaways: ['Debt adds both tax benefit and fixed risk', 'Capacity depends on downside cash flow', 'Flexibility belongs in the recommendation'],
    next: 'Synthesize the course through cumulative assessment and future project design.'
  }
];
