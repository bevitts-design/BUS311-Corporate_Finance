const slide = (sources, label, classes, body, note) => ({ sources, label, classes, body, note });

const cocaCola10K = 'https://investors.coca-colacompany.com/filings-reports/annual-filings-10-k/content/0001628280-26-010047/ko-20251231.htm';
const sec10KGuide = 'https://www.sec.gov/investor/pubs/reada10k.pdf';
const secIpoGuide = 'https://www.sec.gov/file/ipo-investorbulletinpdf';

export const equityM07Deck = {
  id: 'valuation-m07-l01',
  title: 'Equity Valuation and Going Public',
  slides: [
    slide('1', 'Equity valuation and going public', 'dark title-slide image-slide', `
      <img class="hero-image" src="assets/valuation-hero.webp" alt="Financial analyst reviewing valuation charts and an Excel model">
      <div class="hero-overlay"></div><div class="signal-bar"></div>
      <div class="title-copy"><div class="eyebrow">BUS311 · Valuation M07</div><h1>Equity Valuation<br>&amp; Going Public</h1><p>Turn public evidence and assumptions into a defensible range.</p><div class="title-meta"><span>Professor Bethany Evitts</span><span>Fall 2026</span></div></div>`,
      'Open with one question: if two analysts use the same public filing, why can their values still differ? The evidence can be shared while the growth, discount-rate, terminal-value, and peer assumptions differ. Frame today as an audit trail from evidence to recommendation, not a hunt for one perfect price. Time: 1 minute.'),

    slide('2', 'The 75-minute route', 'cream route-slide', `
      <div class="header-row"><h2>Move from evidence to a decision</h2><div class="eyebrow">75-minute route</div></div><div class="rule"></div>
      <div class="route" role="img" aria-label="Lesson route from public evidence through intrinsic and relative valuation to IPO consequences and a recommendation">
        <article><span>Evidence · 12 min</span><strong>Audit</strong><small>Definition, period, units, source</small></article><i>→</i>
        <article><span>Valuation · 35 min</span><strong>Calculate</strong><small>Excel, DDM, terminal value, sensitivity</small></article><i>→</i>
        <article><span>Offering · 13 min</span><strong>Trace</strong><small>Primary proceeds, dilution, leverage</small></article><i>→</i>
        <article><span>Decision · 15 min</span><strong>Defend</strong><small>Range, assumption, recommendation</small></article>
      </div>`,
      'Preview the four phases and the final deliverable: a recommendation that shows its evidence, calculation, critical assumption, and reversal condition. Tell students the deck includes two attempt-before-reveal arcs. The purpose of the time boxes is to protect student reasoning time, especially during sensitivity and the final decision. Time: 2 minutes.'),

    slide('3', 'Learning goals', 'cream goals-slide', `
      <div class="header-row"><h2>By the end, you can defend the range—not just the formula</h2><div class="eyebrow">LO2 · LO3</div></div><div class="rule"></div>
      <div class="goal-flow" role="img" aria-label="Public evidence flows through an Excel valuation, assumption sensitivity, and an IPO or investment recommendation">
        <article><span>Source cleanly</span><strong>Audit evidence</strong><small>Record definition, period, units, currency, supplier, and retrieval date.</small></article><b>→</b>
        <article><span>Model visibly</span><strong>Value the claim</strong><small>Use Excel to discount dividends and terminal value.</small></article><b>→</b>
        <article><span>Stress honestly</span><strong>Defend a range</strong><small>Name the assumption that can reverse the recommendation.</small></article>
      </div>`,
      'Translate each goal into observable work. Students should be able to show where a number came from, reproduce the calculation in Excel, and explain why a different required return or growth rate changes the decision. A formula without source discipline or sensitivity is not yet a professional valuation. Time: 2 minutes.'),

    slide('4,10,11', 'Value is a claim on uncertain future benefits', 'cream bridge-slide', `
      <div class="header-row"><h2>Equity value begins with the cash benefits owners expect</h2><div class="eyebrow">Bridge from bonds</div></div><div class="rule"></div>
      <div class="claim-contrast" role="img" aria-label="Bond value uses contractual coupons and principal while equity value uses uncertain dividends, free cash flow, and resale value">
        <article><span>Debt claim</span><strong>Contractual cash flows</strong><small>Coupons + principal discounted at the required yield</small></article>
        <i>same present-value logic</i>
        <article class="equity"><span>Equity claim</span><strong>Forecast cash benefits</strong><small>Dividends + resale value, or cash flow available to owners</small></article>
      </div><div class="decision-banner">The arithmetic is familiar. The forecast is the hard part.</div>`,
      'Reconnect to M06 bond valuation. Both securities use present value, but bond cash flows are contractual while equity cash benefits are residual and forecast. Ask students which input is likely to create the largest disagreement. The answer is usually the forecast and terminal assumption, not the discounting mechanics. Time: 3 minutes.'),

    slide('12-14', 'Evidence before valuation', 'dark section-slide image-slide', `
      <img class="section-image" src="assets/valuation-hero.webp" alt="Close view of valuation charts and spreadsheet analysis"><div class="section-overlay"></div><div class="signal-bar"></div>
      <div class="eyebrow">Evidence discipline</div><h2>Source the input before you model it</h2><p>A valuation is auditable only when every input has a public trail.</p>`,
      'Use this short transition to shift from valuation vocabulary to evidence capture. The next slide is a public-data mockup, not a proprietary FactSet screen. Emphasize that a premium data platform can accelerate retrieval but does not eliminate the analyst’s responsibility to record definitions and dates. Time: 1 minute.'),

    slide('20-27,58', 'FactSet-style public evidence workflow', 'cream evidence-slide', `
      <div class="header-row"><h2>Capture enough metadata to reproduce the input</h2><div class="eyebrow">FACTSET WORKFLOW MOCKUP · public data only</div></div><div class="rule"></div>
      <div class="factset-console" role="img" aria-label="FactSet-style public workflow mockup records company, field definition, period, units, currency, supplier, retrieval date, and public filing source">
        <div class="console-top"><strong>KO · The Coca-Cola Company</strong><span>Public-source teaching mockup</span></div>
        <div class="console-grid"><b>Input</b><b>Recorded value</b><b>Audit metadata</b>
          <span>Annualized common dividend</span><strong>$2.12 per share</strong><small>2026 annualized · USD/share · company 10-K</small>
          <span>Diluted EPS</span><strong>$3.04</strong><small>FY2025 · USD/share · GAAP · company 10-K</small>
          <span>Supplier + retrieved</span><strong>Coca-Cola IR / SEC filing</strong><small>Retrieved 2026-08-06 · public link retained</small>
        </div>
      </div>
      <div class="evidence-pipeline"><span>Field</span><i>→</i><span>Definition</span><i>→</i><span>Period</span><i>→</i><span>Units</span><i>→</i><span>Currency</span><i>→</i><span>Supplier</span><i>→</i><span>Retrieval date</span></div>
      <a class="source-link" href="${cocaCola10K}">Public source: Coca-Cola 2025 Form 10-K · filed February 20, 2026</a>`,
      'Have students audit the two inputs aloud. The 2.12 dollar figure is the annualized 2026 dividend announced in the 2025 Form 10-K; diluted EPS of 3.04 dollars is for fiscal 2025. They are not from the same period, so the record must say so. Likely misconception: a field label alone guarantees comparability. Debrief by asking what must change before using a quarterly value. Time: 4 minutes.'),

    slide('11-14,51-59', 'Choose a model that fits the claim', 'cream model-slide', `
      <div class="header-row"><h2>Model choice follows the economics of the claim</h2><div class="eyebrow">Triangulate value</div></div><div class="rule"></div>
      <div class="model-map" role="img" aria-label="Three valuation model families connect dividends, free cash flow, and market multiples to an equity value range">
        <article><span>Stable payout</span><strong>Dividend discount</strong><code>P₀ = Σ Dₜ/(1+r)ᵗ</code><small>Best when dividends reflect distributable cash.</small></article>
        <article><span>Operating cash</span><strong>FCFE or FCFF</strong><code>PV of forecast cash flow</code><small>Best when payout policy obscures economics.</small></article>
        <article><span>Market context</span><strong>Relative valuation</strong><code>Driver × justified multiple</code><small>Best as a comparable-company cross-check.</small></article>
      </div><div class="decision-banner">Use more than one lens when the recommendation matters.</div>`,
      'Explain that each model answers a different question. DDM values distributions to shareholders, FCFE or FCFF values cash generation, and multiples show how the market prices comparable fundamentals. A model is not “better” in the abstract; it is better or worse for the company and decision. Ask which model fits a mature dividend payer and which fits a pre-profit platform. Time: 4 minutes.'),

    slide('28-33', 'Build the one-period model in Excel', 'cream excel-slide', `
      <div class="header-row"><h2>Excel discounts the total shareholder payoff</h2><div class="eyebrow">BUS311 LECTURE MODEL</div></div><div class="rule"></div>
      <div class="excel-sheet" role="img" aria-label="Editable Excel-style model discounts a three dollar dividend and an eighty-one dollar resale value at twelve percent to a seventy-five dollar present value">
        <div class="excel-ribbon"><span>BUS311_EQUITY_VALUE.xlsx</span><b>Home</b><b>Formulas</b><strong>One-period value</strong></div>
        <div class="formula-row"><span>B7</span><b>ƒx</b><code>=-PV(B5,1,0,B3+B4)</code></div>
        <div class="excel-grid"><span></span><b>A</b><b>B</b><b>C</b><strong>3</strong><label>Dividend in Year 1</label><data class="input">$3.00</data><small>cash income</small><strong>4</strong><label>Expected price in Year 1</label><data class="input">$81.00</data><small>resale value</small><strong>5</strong><label>Required return</label><data class="input">12.0%</data><small>time + risk</small><strong>6</strong><i></i><i></i><i></i><strong>7</strong><label>Intrinsic value today</label><data class="result">$75.00</data><small>=-PV(B5,1,0,B3+B4)</small></div>
      </div>`,
      'Introduce the Excel function before manual arithmetic. The future value argument is the combined 84 dollar payoff, and the leading negative sign converts Excel’s cash-flow sign convention into a positive value. Then connect the equivalent math: 84 divided by 1.12 equals 75. Likely misconception: discounting only the resale price and adding the dividend afterward. Time: 4 minutes.'),

    slide('32-33', 'Attempt the one-period value', 'cream activity-slide', `
      <div class="header-row"><h2>Predict the error before checking the model</h2><div class="eyebrow">Pairs · 4 minutes</div></div><div class="rule"></div>
      <div class="activity-layout"><div class="prompt-card"><span>Scenario</span><strong>$3 dividend · $81 resale · 12% required return</strong><p>A teammate enters <code>=81/1.12+3</code> and reports $75.32.</p></div>
        <div class="activity-steps"><article><span>Do</span><strong>Find the modeling error</strong><small>Use the Excel visual or write a corrected formula.</small></article><article><span>Compare</span><strong>Explain the timing</strong><small>Which cash flows arrive at Year 1?</small></article><article><span>Required deliverable</span><strong>One corrected formula + one sentence</strong><small>Commit before the reveal.</small></article></div></div>
      <div class="choice-check" data-interactive="one-period"><button type="button" data-correct="false">Discount only the resale price</button><button type="button" data-correct="true">Discount the dividend and resale value together</button><button type="button" data-correct="false">Add the dividend to today’s price</button><button class="check-button" type="button" data-action="check-choice">Check reasoning</button><output aria-live="polite">Choose the cash-flow treatment.</output></div>`,
      'Correct answer: both Year 1 cash flows must be discounted, so the value is (3 + 81) / 1.12 = 75 dollars, or =-PV(12%,1,0,84). The 75.32 dollar answer incorrectly treats the dividend as if it arrived today. Likely misconception: dividends are “income,” so they need not be discounted. Debrief: timing governs every cash flow, regardless of label. Time: 4 minutes.'),

    slide('32-33', 'Reveal the one-period value', 'dark reveal-slide', `
      <div class="header-row"><h2>Both Year 1 benefits belong inside the discounting step</h2><div class="eyebrow">Reveal and debrief</div></div><div class="rule dark-rule"></div>
      <div class="payoff-flow" role="img" aria-label="Three dollar dividend plus eighty-one dollar resale value equals eighty-four dollars at Year 1, which discounted at twelve percent equals seventy-five dollars today">
        <article><span>Year 1 dividend</span><strong>$3</strong></article><i>+</i><article><span>Year 1 resale</span><strong>$81</strong></article><i>=</i><article><span>Total payoff</span><strong>$84</strong></article><b>÷ 1.12</b><article class="result"><span>Value today</span><strong>$75</strong></article>
      </div><code class="hero-formula">=-PV(12%,1,0,84)</code>`,
      'Reveal only after pairs commit. The visual makes the timing error explicit: the dividend and resale price sit at the same Year 1 point. The Excel function and manual calculation reconcile exactly. Ask students how the formula changes for a two-year holding period; the resale value and second dividend move to Year 2, while the first dividend remains at Year 1. Time: 3 minutes.'),

    slide('34-38', 'Growth turns valuation into an assumption test', 'dark section-slide image-slide', `
      <img class="section-image" src="assets/valuation-hero.webp" alt="Valuation model displaying growth and discount-rate inputs"><div class="section-overlay"></div><div class="signal-bar"></div>
      <div class="eyebrow">Growth and terminal value</div><h2>The denominator deserves the challenge</h2><p>When r and g move closer, value can change faster than the business.</p>`,
      'Transition from a finite holding period to a continuing business. Tell students that the formula becomes shorter while the judgment becomes harder. The next sequence uses an official dividend input from Coca-Cola and clearly labels the discount rate and growth rate as classroom assumptions. Time: 1 minute.'),

    slide('29-30,37-38,49-51,63-64', 'Constant-growth value', 'cream gordon-slide', `
      <div class="header-row"><h2>Constant growth turns a stream into one valuation</h2><div class="eyebrow">Coca-Cola teaching case</div></div><div class="rule"></div>
      <div class="gordon-layout"><div class="equation-panel"><span>Gordon growth</span><code>P₀ = D₁ / (r − g)</code><strong>$47.11</strong><small>$2.12 ÷ (8.5% − 4.0%)</small></div>
        <div class="assumption-stack"><article><span>Public evidence</span><strong>D₁ = $2.12</strong><small>2026 annualized dividend announced in the 2025 10-K</small></article><article><span>Course assumption</span><strong>r = 8.5%</strong><small>Required return for teaching analysis</small></article><article><span>Course assumption</span><strong>g = 4.0%</strong><small>Perpetual dividend growth for teaching analysis</small></article></div></div>
      <a class="source-link" href="${cocaCola10K}">Public source for dividend evidence: Coca-Cola 2025 Form 10-K</a>`,
      'Separate fact from assumption. The 2.12 dollar annualized 2026 dividend is company-reported; the 8.5 percent required return and 4 percent perpetual growth rate are teaching assumptions. The model produces 47.11 dollars, not a current investment recommendation. The essential condition is r greater than g. Ask what happens as the denominator approaches zero. Time: 5 minutes.'),

    slide('37-38', 'Sensitivity attempt', 'cream activity-slide sensitivity-attempt', `
      <div class="header-row"><h2>Which one-point change moves value more?</h2><div class="eyebrow">Sensitivity setup · teams · 5 minutes</div></div><div class="rule"></div>
      <div class="sensitivity-setup"><div class="base-case"><span>Base case</span><strong>$47.11</strong><code>D₁ $2.12 · r 8.5% · g 4.0%</code></div><div class="scenario-branches" role="img" aria-label="Two unanswered sensitivity branches compare one percentage point higher growth with one percentage point higher required return"><article><span>Growth challenge</span><strong>g rises to 5.0%</strong><small>Hold r at 8.5%</small></article><b>VERSUS</b><article><span>Risk challenge</span><strong>r rises to 9.5%</strong><small>Hold g at 4.0%</small></article></div></div>
      <div class="deliverable">Calculate both values in Excel. Deliver: larger absolute change + one reason.</div>`,
      'Do not reveal the values yet. Answers: higher growth produces 60.57 dollars, an increase of 13.46 dollars; higher required return produces 38.55 dollars, a decrease of 8.56 dollars. The growth change is larger in absolute value because it narrows the denominator from 4.5 to 3.5 percentage points. Misconception: equal one-point changes must have symmetric effects. Time: 5 minutes.'),

    slide('37-38', 'Sensitivity reveal', 'dark lab-slide', `
      <div class="header-row"><h2>Equal input changes do not create equal valuation changes</h2><div class="eyebrow">Sensitivity reveal</div></div><div class="rule dark-rule"></div>
      <div class="sensitivity-lab" data-interactive="sensitivity"><div class="sliders"><label>Required return <input id="required-return-slider" type="range" min="6.5" max="12" step="0.1" value="8.5"><output id="required-return-value">8.5%</output></label><label>Perpetual growth <input id="growth-slider" type="range" min="1" max="6" step="0.1" value="4"><output id="growth-value">4.0%</output></label></div><div class="lab-result"><span>Modeled value</span><strong id="gordon-output">$47.11</strong><small id="spread-output">r − g = 4.5 percentage points</small></div></div>
      <div class="reveal-comparison"><article><span>g → 5.0%</span><strong>$60.57</strong><small>+$13.46</small></article><article><span>r → 9.5%</span><strong>$38.55</strong><small>−$8.56</small></article></div>`,
      'Reveal the two calculated values, then let students move the sliders. The interactive model prevents g from reaching r, because the constant-growth formula is not economically valid when perpetual growth equals or exceeds the required return. Debrief by asking which assumption deserves the strongest evidence. Both matter, but long-run growth is often the easiest to overstate. Time: 5 minutes.'),

    slide('34-36', 'Multi-stage Excel value', 'cream excel-slide multi-stage-slide', `
      <div class="header-row"><h2>Multi-stage value discounts every dividend and the terminal price</h2><div class="eyebrow">Preserved Excel logic</div></div><div class="rule"></div>
      <div class="excel-sheet wide" role="img" aria-label="Editable Excel-style multi-stage stock valuation discounts three dividends and a terminal price to a seventy-five dollar intrinsic value">
        <div class="excel-ribbon"><span>BUS311_EQUITY_VALUE.xlsx</span><b>Formulas</b><b>Audit</b><strong>Multi-stage DDM</strong></div>
        <div class="formula-row"><span>F6</span><b>ƒx</b><code>=SUM(F2:F5)</code></div>
        <div class="multi-grid"><b>Cash flow</b><b>Amount</b><b>Period</b><b>Excel PV formula</b><b>Present value</b>
          <span>Dividend 1</span><strong>$3.00</strong><span>1</span><code>=-PV($B$7,C2,0,B2)</code><data>$2.68</data>
          <span>Dividend 2</span><strong>$3.24</strong><span>2</span><code>=-PV($B$7,C3,0,B3)</code><data>$2.58</data>
          <span>Dividend 3</span><strong>$3.50</strong><span>3</span><code>=-PV($B$7,C4,0,B4)</code><data>$2.49</data>
          <span>Terminal price</span><strong>$94.48</strong><span>3</span><code>=-PV($B$7,C5,0,B5)</code><data>$67.25</data>
          <span class="total">Intrinsic value</span><strong class="total">$75.00</strong><span></span><code>=SUM(F2:F5)</code><data class="result">$75.00</data>
        </div><div class="input-note">B7 required return = 12.0%</div>
      </div>`,
      'Preserve the original model’s strongest Excel visual and logic. Each cash flow has its own period, and the terminal price shares Year 3 with the third dividend. The present values sum to approximately 75 dollars. Likely misconception: discounting the terminal price for one period because it is entered once. The period comes from timing, not row count. Time: 5 minutes.'),

    slide('52-58', 'Relative valuation cross-check', 'cream relative-slide', `
      <div class="header-row"><h2>A multiple is a market assumption disguised as a shortcut</h2><div class="eyebrow">Coca-Cola cross-check</div></div><div class="rule"></div>
      <div class="relative-bridge" role="img" aria-label="Coca-Cola fiscal 2025 diluted earnings per share of three dollars and four cents multiplied by a course peer multiple of twenty-two times gives an illustrative value of sixty-six dollars and eighty-eight cents">
        <article><span>Public evidence</span><strong>$3.04 EPS</strong><small>FY2025 diluted GAAP EPS</small></article><i>×</i><article><span>Course assumption</span><strong>22.0× P/E</strong><small>Illustrative peer multiple</small></article><i>=</i><article class="result"><span>Implied value</span><strong>$66.88</strong><small>Not a market-price forecast</small></article>
      </div><div class="peer-audit"><span>Before using the multiple</span><strong>Match horizon · growth · margins · leverage · accounting quality</strong></div>
      <a class="source-link" href="${cocaCola10K}">Public source for EPS evidence: Coca-Cola 2025 Form 10-K</a>`,
      'The 3.04 dollar diluted EPS is a public fact from the 2025 Form 10-K. The 22 times multiple is a course assumption. Their product is 66.88 dollars. Ask why the result differs from the 47.11 dollar DDM value. The models embed different assumptions; the gap is a research question, not proof that one formula failed. Time: 4 minutes.'),

    slide('5-10,15-19', 'Going public changes the financing system', 'dark section-slide image-slide', `
      <img class="section-image" src="assets/valuation-hero.webp" alt="Corporate financing and valuation analysis displayed on monitors"><div class="section-overlay"></div><div class="signal-bar"></div>
      <div class="eyebrow">Primary offering</div><h2>The offer price is only one part of the IPO decision</h2><p>Proceeds, ownership, leverage, and disclosure all change at once.</p>`,
      'Transition from valuing a share to designing an offering. A company cares about the offer price, but also about how many shares are issued, how proceeds are used, who owns the company afterward, and whether the financing plan improves strategic capacity. Time: 1 minute.'),

    slide('5-10,15-18,20-27', 'IPO process and evidence', 'cream ipo-slide', `
      <div class="header-row"><h2>An IPO joins valuation, disclosure, demand, and capital allocation</h2><div class="eyebrow">Public offering workflow</div></div><div class="rule"></div>
      <div class="ipo-flow" role="img" aria-label="IPO workflow moves from underwriter selection to prospectus evidence, investor demand, offer pricing, and public trading">
        <article><span>Structure</span><strong>Select underwriters</strong><small>Design and distribute the offer.</small></article><i>→</i><article><span>Disclose</span><strong>File the prospectus</strong><small>Business, risks, financials, offering terms.</small></article><i>→</i><article><span>Test demand</span><strong>Build the book</strong><small>Collect indications of interest.</small></article><i>→</i><article><span>Allocate</span><strong>Price and trade</strong><small>Primary proceeds, then secondary discovery.</small></article>
      </div><div class="market-split"><article><span>Primary market</span><strong>Issuer receives proceeds</strong></article><article><span>Secondary market</span><strong>Investors exchange ownership</strong></article></div>
      <a class="source-link" href="${secIpoGuide}">Public source: SEC Investor Bulletin on IPOs</a>`,
      'Use the SEC investor bulletin to anchor the public process: investment banks manage and sell the IPO, and investors receive prospectus information about the issuer and offering. Clarify primary versus secondary markets. The issuer receives cash when new shares are sold; later exchange trading transfers ownership among investors. Time: 5 minutes.'),

    slide('15-19,40-48,59-64', 'IPO ratio effects', 'cream ipo-case-slide', `
      <div class="header-row"><h2>New equity can reduce leverage before earnings catch up</h2><div class="eyebrow">Apex IPO classroom case · 4 minutes</div></div><div class="rule"></div>
      <div class="apex-balance"><div class="case-inputs"><span>Teaching assumptions</span><p>Pre-IPO debt <strong>$300M</strong></p><p>Pre-IPO equity <strong>$200M</strong></p><p>Net income <strong>$30M</strong></p><p>Offer <strong>20M shares × $20</strong></p><p>Use <strong>$200M debt paydown + $200M growth capex</strong></p></div>
        <div class="ratio-shift" role="img" aria-label="Apex debt to equity falls from one point five times to zero point one seven times while unchanged net income causes return on equity to fall from fifteen percent to five percent"><article><span>Debt / equity</span><strong>1.50× → 0.17×</strong><small>$100M debt ÷ $600M equity</small></article><article><span>ROE if income is unchanged</span><strong>15.0% → 5.0%</strong><small>$30M ÷ $600M equity</small></article></div></div>
      <div class="deliverable">Deliver: one benefit, one dilution concern, and one operating milestone that would justify the offer.</div>`,
      'Students should calculate 400 million dollars of gross proceeds. Paying down 200 million reduces debt to 100 million; issuing equity raises book equity from 200 million to 600 million. Debt-to-equity falls to about 0.17 times. If net income stays at 30 million, ROE falls to 5 percent. The benefit is capacity and lower leverage; the concern is dilution until growth investment earns a return. Time: 4 minutes.'),

    slide('18-19,39-64', 'Decision exercise', 'dark decision-slide', `
      <div class="header-row"><h2>Build a valuation range that another analyst can audit</h2><div class="eyebrow">Decision standard · teams · 7 minutes</div></div><div class="rule dark-rule"></div>
      <div class="decision-chain" role="img" aria-label="Decision standard flows from public evidence to calculation, critical assumption, and recommendation">
        <article><span>Evidence</span><strong>$2.12 dividend · $3.04 EPS</strong><small>Name source, period, units, retrieval date.</small></article><i>→</i><article><span>Calculation</span><strong>$47.11 DDM · $66.88 P/E</strong><small>Show Excel formulas.</small></article><i>→</i><article><span>Assumption</span><strong>r · g · peer multiple</strong><small>Name the breakpoint.</small></article><i>→</i><article><span>Recommendation</span><strong>Defend the range</strong><small>State what evidence could reverse it.</small></article>
      </div>
      <div class="decision-task"><span>Required deliverable</span><strong>A four-sentence CFO brief: evidence → calculation → assumption → recommendation</strong></div>
      <div class="choice-check inverse" data-interactive="decision"><button type="button" data-correct="false">Use $66.88 because it is higher</button><button type="button" data-correct="false">Average the values without explaining why</button><button type="button" data-correct="true">Report a range and defend the model assumptions</button><button class="check-button" type="button" data-action="check-choice">Check standard</button><output aria-live="polite">Choose the most defensible standard.</output></div>`,
      'Exact standard: the response must name the public evidence with period and units; show both calculations; identify the required-return, growth, and peer-multiple assumptions; and recommend a defensible range with a reversal condition. Best choice: report the range and defend assumptions. A strong brief says the evidence supports a 47 to 67 dollar teaching range, but a higher required return or weaker peer fit would lower it. Time: 7 minutes.'),

    slide('39-40,64', 'Decision reveal and close', 'dark close-slide', `
      <div class="signal-bar"></div><div class="eyebrow">Reveal · exit ticket · 5 minutes</div><h2>The recommendation is the audit trail</h2>
      <div class="final-standard"><article><span>Evidence</span><strong>Traceable</strong></article><article><span>Calculation</span><strong>Reproducible</strong></article><article><span>Assumption</span><strong>Stress-tested</strong></article><article><span>Recommendation</span><strong>Conditional</strong></article></div>
      <div class="model-answer">“Public dividend and EPS evidence supports an illustrative $47–$67 range. The range depends on 8.5% required return, 4.0% perpetual growth, and a 22× peer multiple; weaker growth or peer fit would lower it. Use the range as a research conclusion, not a buy/sell instruction.”</div>
      <div class="exit-actions" data-interactive="exit"><button type="button" data-exit="evidence">I can audit the evidence</button><button type="button" data-exit="model">I can reproduce the model</button><button type="button" data-exit="decision">I can defend the range</button></div><output id="exit-feedback" aria-live="polite">Choose the step you can defend, then name your next evidence request.</output>
      <a class="source-link light" href="${sec10KGuide}">Public research guide: SEC · How to Read a 10-K</a>`,
      'Reveal the model brief and grade the chain rather than agreement with a single price. The response distinguishes facts from course assumptions and names reversal conditions. Ask students to choose the stage they can defend and name one next evidence request—cash-flow trend, payout capacity, peer selection, or risk-free-rate basis. Close: valuation credibility comes from the audit trail. Time: 5 minutes.')
  ]
};
