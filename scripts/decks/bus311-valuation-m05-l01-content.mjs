const slide = (slides, label, classes, body, note) => ({ slides, label, classes, body, note });

export const tvmM05L01Deck = {
  title: 'Time Value of Money',
  slides: [
    slide('1', 'Time value of money', 'dark title-slide', `
      <div class="gradient-bar"></div>
      <div class="title-grid">
        <div class="title-copy"><div class="eyebrow">BUS311 · Valuation M05</div><h1>A dollar’s job depends on <em>when</em> it arrives</h1><p>Move cash through time, audit the Excel model, and defend the decision.</p></div>
        <div class="clock-orbit" role="img" aria-label="Cash moves around a clock from today to a future date and back to present value"><span class="now">TODAY</span><span class="future">FUTURE</span><b>FV →</b><b>← PV</b><i></i></div>
      </div>`,
      'Open with the clock visual. Ask students for one business decision where timing changes value: acquiring equipment, reserving cash for a debt maturity, funding a pension, or choosing payment terms. Frame the lesson as decision discipline, not formula memorization. Time: 2 minutes.'),

    slide('2', 'The 75-minute decision path', 'cream roadmap-slide', `
      <div class="header-row"><h2>The class moves from timing to judgment</h2><div class="eyebrow">75-minute route</div></div><div class="rule"></div>
      <div class="route" role="img" aria-label="Lesson route from a cash timing prediction through timelines, Excel functions, rate alignment, sensitivity, and cash-flow patterns">
        <article><span>Opening · 5 min</span><strong>Predict</strong><small>Is future cash actually better?</small></article><i>→</i>
        <article><span>Foundations · 18 min</span><strong>Map</strong><small>Timeline, compounding, discounting</small></article><i>→</i>
        <article><span>Model · 27 min</span><strong>Build</strong><small>FV, signs, rates, sensitivity</small></article><i>→</i>
        <article><span>Transfer · 20 min</span><strong>Choose</strong><small>Lump sum, annuity, perpetuity</small></article><i>→</i>
        <article><span>Close · 5 min</span><strong>Defend</strong><small>State the value and the assumption</small></article>
      </div>`,
      'Preview the route and the time boxes. The two student deliverables are a formula-audited Excel result and a short decision statement that names the assumption most likely to change the answer. Keep transitions crisp so the final pattern activity receives the full twenty minutes. Time: 2 minutes.'),

    slide('3', 'Learning goals', 'cream goal-slide', `
      <div class="header-row"><h2>By the end, you can audit a valuation before trusting it</h2><div class="eyebrow">LO4</div></div><div class="rule"></div>
      <div class="goal-system" role="img" aria-label="A timeline feeds an Excel model, which feeds a decision recommendation">
        <article class="timeline-goal"><span>See the cash</span><strong>Draw the timeline</strong><small>Dates · direction · frequency</small></article><b>→</b>
        <article class="model-goal"><span>Translate the timeline</span><strong>Use PV and FV</strong><small>Rate · periods · signs · type</small></article><b>→</b>
        <article class="decision-goal"><span>Explain the result</span><strong>Defend the choice</strong><small>Value date · assumption · sensitivity</small></article>
      </div>`,
      'Read these as observable performance goals. A correct Excel output is not sufficient if the rate and periods are inconsistent or if the student cannot say what the result means on a common valuation date. Ask students which stage currently feels least comfortable. Time: 1 minute.'),

    slide('4', 'Prediction: cash today or later?', 'dark choice-slide', `
      <div class="eyebrow">Prediction setup · Berkshire Hathaway teaching scenario</div><h2>Choose one payment—before you know the discount rate</h2>
      <div class="cash-choice"><article><span>Available now</span><strong>$10,000</strong><small>Today</small></article><div class="versus">OR</div><article class="later"><span>Promised later</span><strong>$14,000</strong><small>Five years from today</small></article></div>
      <div class="question-band">Which is worth more on today’s date?</div>`,
      'Do not reveal the break-even rate. Take a quick show of hands for cash today, cash later, or cannot decide. Emphasize that the dollar amounts alone do not establish value because they are measured at different dates. The company reference supplies a real capital-allocation context; the payment amounts are a clearly labeled teaching scenario. Time: 2 minutes.'),

    slide('4', 'Student attempt: find the missing assumption', 'cream activity-slide', `
      <div class="header-row"><h2>Make the choice conditional, not absolute</h2><div class="eyebrow">Individual → pair · 3 minutes</div></div><div class="rule"></div>
      <div class="attempt-board"><div class="attempt-question"><span>Your task</span><strong>Write the one assumption needed to compare the payments.</strong></div><div class="attempt-steps"><article><b>Think</b><p>Choose now, later, or “it depends.”</p></article><article><b>Pair</b><p>Name the missing input and explain why it matters.</p></article><article><b>Deliver</b><p>One sentence with a decision rule.</p></article></div></div>
      <div class="deliverable">Required deliverable: “Choose ___ when the required return is ___.”</div>`,
      'Listen for discount rate, opportunity cost, or required return. Likely misconception: inflation is the only reason money has time value. Clarify that the decision rate can also include risk and the return available on alternatives. Do not accept “today is always better” without a rate-based condition. Debrief by asking one pair from each choice. Time: 3 minutes.'),

    slide('4', 'Reveal: the discount rate decides', 'cream reveal-slide', `
      <div class="header-row"><h2>The decision flips at a 6.96% annual return</h2><div class="eyebrow">Reveal and debrief</div></div><div class="rule"></div>
      <div class="threshold-scale" role="img" aria-label="A required return scale with the break-even point at 6.96 percent; below it the future 14000 dollars is preferred and above it the current 10000 dollars is preferred"><div class="scale-line"></div><div class="threshold" style="left:58%"><i></i><strong>6.96%</strong><span>Break-even return</span></div><div class="scale-side future-side"><strong>Below 6.96%</strong><span>$14,000 later has greater present value</span></div><div class="scale-side today-side"><strong>Above 6.96%</strong><span>$10,000 today has greater value</span></div></div>
      <div class="formula-band"><code>Break-even r = ($14,000 ÷ $10,000)<sup>1/5</sup> − 1 = 6.96%</code></div>`,
      'Reveal the threshold only after students commit. At exactly 6.96 percent the two choices are economically equivalent. Below it, the future payment discounts to more than ten thousand dollars; above it, to less. Likely misconception: the later amount wins because fourteen thousand exceeds ten thousand. Debrief: what business evidence would justify the required return? Time: 2 minutes.'),

    slide('5', 'Timeline first', 'dark section', `<div class="gradient-bar"></div><div class="eyebrow">The valuation grammar</div><h2>Put cash on dates before putting numbers in Excel</h2><p>Timing errors are model errors.</p>`,
      'Transition from the opening choice to the core valuation grammar. State the rule: every TVM calculation should begin with the valuation date, the cash-flow dates, and the direction of each cash flow. Ask students to watch for those three items on every quantitative slide. Time: 1 minute.'),

    slide('6', 'A timeline makes the contract visible', 'cream timeline-slide', `
      <div class="header-row"><h2>A timeline turns a payment promise into model inputs</h2><div class="eyebrow">Dates before formulas</div></div><div class="rule"></div>
      <div class="timeline" role="img" aria-label="A five-year cash-flow timeline showing negative ten thousand dollars today and positive fourteen thousand dollars at year five"><div class="timeline-line"></div>
        <article class="outflow"><time>Today · t=0</time><i></i><strong>−$10,000</strong><span>Cash invested</span></article>
        <article><time>Year 1</time><i></i><span>No cash flow</span></article><article><time>Year 2</time><i></i><span>No cash flow</span></article><article><time>Year 3</time><i></i><span>No cash flow</span></article><article><time>Year 4</time><i></i><span>No cash flow</span></article>
        <article class="inflow"><time>Year 5 · t=5</time><i></i><strong>+$14,000</strong><span>Cash received</span></article>
      </div><div class="timeline-audit"><span>Valuation date: today</span><span>Spacing: annual</span><span>Direction: outflow → inflow</span></div>`,
      'Trace the timeline from left to right. The initial payment is at time zero and therefore is not discounted. The promised receipt is five annual periods away. Likely misconception: counting the endpoints and entering six periods. Ask: how many compounding intervals lie between today and Year 5? Five. Time: 3 minutes.'),

    slide('7', 'Compounding moves value forward', 'cream compound-slide', `
      <div class="header-row"><h2>Compounding pays a return on prior returns</h2><div class="eyebrow">Move cash forward</div></div><div class="rule"></div>
      <div class="growth-bars" role="img" aria-label="Ten thousand dollars grows at eight percent to fourteen thousand six hundred ninety-three dollars over five years">
        <article style="--h:46%"><span>Today</span><i></i><strong>$10,000</strong></article><article style="--h:53%"><span>Year 1</span><i></i><strong>$10,800</strong></article><article style="--h:61%"><span>Year 2</span><i></i><strong>$11,664</strong></article><article style="--h:70%"><span>Year 3</span><i></i><strong>$12,597</strong></article><article style="--h:81%"><span>Year 4</span><i></i><strong>$13,605</strong></article><article style="--h:94%"><span>Year 5</span><i></i><strong>$14,693</strong></article>
      </div><div class="concept-rule"><code>FV = PV × (1 + r)<sup>n</sup></code><span>Time and return amplify each other.</span></div>`,
      'Point to the widening dollar increments. At eight percent, the first year adds eight hundred dollars; the fifth year adds more than one thousand dollars because the base has grown. This is interest on interest. Ask students whether the bars would form a straight line at zero percent. Yes: no compounding. Time: 2 minutes.'),

    slide('8', 'Discounting moves value back', 'cream discount-slide', `
      <div class="header-row"><h2>Discounting removes the return required for waiting</h2><div class="eyebrow">Move cash backward</div></div><div class="rule"></div>
      <div class="discount-funnel" role="img" aria-label="Twenty thousand dollars in five years passes backward through an eight percent required return to equal thirteen thousand six hundred twelve dollars today"><div class="future-cash"><span>Year 5</span><strong>$20,000</strong></div><div class="funnel"><span>÷ 1.08</span><span>÷ 1.08</span><span>÷ 1.08</span><span>÷ 1.08</span><span>÷ 1.08</span></div><div class="present-cash"><span>Today</span><strong>$13,611.66</strong></div></div>
      <div class="concept-rule"><code>PV = FV ÷ (1 + r)<sup>n</sup></code><span>A higher required return produces a lower present value.</span></div>`,
      'Read the visual from right to left. Each step removes one year of required return. Explain that the discount rate is an opportunity-cost and risk-adjustment input, not a penalty applied mechanically. Check the arithmetic: twenty thousand divided by 1.08 to the fifth power equals 13,611.66. Time: 2 minutes.'),

    slide('7,8', 'Compounding and discounting are inverse moves', 'dark inverse-slide', `
      <div class="eyebrow">One relationship · two directions</div><h2>Use the direction that lands on the decision date</h2>
      <div class="inverse-flow" role="img" aria-label="Present value moves forward through compounding to future value and future value moves backward through discounting to present value"><article><span>Valuation date</span><strong>PV</strong><small>What is future cash worth today?</small></article><div class="inverse-arrows"><b>COMPOUND →</b><i></i><b>← DISCOUNT</b></div><article><span>Future date</span><strong>FV</strong><small>What will today’s cash become?</small></article></div>`,
      'Ask students to say the destination before naming a formula. If the requested answer is on a future date, compound. If the requested answer is today, discount. This direction test is more reliable than memorizing isolated equations. Quick check: bond price today from future coupons requires discounting. Time: 2 minutes.'),

    slide('13,17', 'Excel starts with FV', 'cream excel-slide', `
      <div class="header-row"><h2>Excel can calculate future value—if the inputs agree</h2><div class="eyebrow">Function first</div></div><div class="rule"></div>
      <div class="excel-sheet" aria-label="Editable worksheet visual for a five-year future-value calculation">
        <div class="excel-ribbon"><span>BUS311_TVM.xlsx</span><b>Home</b><b>Formulas</b><strong>Future Value</strong></div>
        <div class="excel-formula-row"><span class="name-box">B10</span><b>ƒx</b><code>=FV(B5,B6,B7,B4,B8)</code></div>
        <div class="excel-grid fv-grid"><span class="corner"></span><span>A</span><span>B</span><span>C</span><b>1</b><i></i><i></i><i></i><b>2</b><i></i><em class="sheet-title">Berkshire teaching scenario</em><i></i><b>3</b><i></i><i></i><i></i><b>4</b><label>Present value</label><data class="input">−$10,000.00</data><span>cash paid</span><b>5</b><label>Annual rate</label><data class="input">8.00%</data><span>annual</span><b>6</b><label>Periods</label><data class="input">5</data><span>years</span><b>7</b><label>Payment</label><data>0</data><span>lump sum</span><b>8</b><label>Type</label><data>0</data><span>end of period</span><b>9</b><i></i><i></i><i></i><b>10</b><label>Future value</label><data class="result">$14,693.28</data><span>cash received</span></div>
        <div class="excel-status"><span>Rate and periods: annual</span><span>Signs: opposite directions</span><span>Result: Year 5 dollars</span></div>
      </div>`,
      'Introduce the FV function now, before manual arithmetic. Read the arguments from the worksheet rather than from memory: rate in B5, periods in B6, payment in B7, present value in B4, and type in B8. Because the ten thousand dollars is paid out, it is negative; Excel returns a positive receipt. Time: 4 minutes.'),

    slide('11', 'Excel signs show cash-flow direction', 'cream sign-slide', `
      <div class="header-row"><h2>Opposite signs tell Excel the cash changes hands</h2><div class="eyebrow">Cash-flow convention</div></div><div class="rule"></div>
      <div class="sign-exchange" role="img" aria-label="A negative cash outflow today points from the company to the investment and a positive future cash inflow points back to the company"><article class="company"><span>Berkshire</span><strong>Cash owner</strong></article><div class="sign-arrows"><div class="out"><b>−$10,000 today</b><i>→</i></div><div class="in"><i>←</i><b>+$14,693 in Year 5</b></div></div><article class="investment"><span>Investment</span><strong>Cash user</strong></article></div>
      <div class="warning-band">Same-sign inputs usually mean the model is describing two inflows or two outflows—not an exchange.</div>`,
      'Explain signs from the viewpoint of the model owner. The present value is money leaving today, so it is negative. The future value is money returning later, so it is positive. Excel may display a negative result when all entered cash flows have the same sign; that is a diagnostic, not a software defect. Time: 2 minutes.'),

    slide('11', 'Activity: diagnose the sign error', 'cream activity-slide sign-activity', `
      <div class="header-row"><h2>Which formula returns a positive future receipt?</h2><div class="eyebrow">Pairs · 2 minutes</div></div><div class="rule"></div>
      <div class="activity-prompt"><strong>Click one formula, then check.</strong><span>Assume $10,000 leaves today and the investment returns cash in five years.</span></div>
      <div class="formula-options" data-interactive="signs"><button type="button" data-correct="false" aria-pressed="false"><code>=FV(8%,5,0,10000)</code><small>PV entered positive</small></button><button type="button" data-correct="true" aria-pressed="false"><code>=FV(8%,5,0,-10000)</code><small>PV entered as an outflow</small></button><button type="button" data-correct="false" aria-pressed="false"><code>=FV(8%,5,-10000,0)</code><small>Amount entered as a payment</small></button></div>
      <div class="activity-actions"><button type="button" class="check-button" data-action="check-signs">Check choice</button><output id="sign-feedback" aria-live="polite">Required deliverable: formula + one-sentence sign rationale.</output></div>`,
      'Answer: =FV(8%,5,0,-10000). The first option produces a negative future value because Excel sees the present value as cash received today. The third incorrectly treats ten thousand dollars as a recurring annual payment. Likely misconception: a negative sign means the investment loses money. Debrief: negative relative to whose perspective? Time: 2 minutes.'),

    slide('9', 'Rates and periods', 'dark section', `<div class="gradient-bar"></div><div class="eyebrow">Model integrity</div><h2>The rate and the period count must speak the same language</h2><p>Annual with annual. Monthly with monthly.</p>`,
      'Transition to the most common mechanical source of TVM error. State that a correct function with inconsistent units is still a wrong model. The next activity distinguishes a quoted annual rate from the periodic rate actually used in the calculation. Time: 1 minute.'),

    slide('10', 'APR and EAR answer different questions', 'cream rate-map-slide', `
      <div class="header-row"><h2>A quoted annual rate is not always the model’s periodic rate</h2><div class="eyebrow">Read the label</div></div><div class="rule"></div>
      <div class="rate-map" role="img" aria-label="A nominal APR converts to a periodic rate for each month while compounding the periodic rate produces an effective annual rate"><article class="apr"><span>Quoted rate</span><strong>12.00% APR</strong><small>Nominal annual rate</small></article><i>÷ 12</i><article class="periodic"><span>Model rate</span><strong>1.00% per month</strong><small>Use with monthly periods</small></article><i>compound</i><article class="ear"><span>Annual outcome</span><strong>12.68% EAR</strong><small>Actual one-year growth</small></article></div>
      <div class="formula-band light"><code>EAR = (1 + 12% ÷ 12)<sup>12</sup> − 1 = 12.68%</code></div>`,
      'Distinguish nominal APR, periodic rate, and effective annual rate. Dividing by twelve is appropriate for a nominal APR with monthly compounding, not for an already-effective annual rate. The periodic rate belongs with monthly n. Ask students what evidence they need from a source: rate definition and compounding frequency. Time: 3 minutes.'),

    slide('10', 'Activity: match the model units', 'cream activity-slide rate-activity', `
      <div class="header-row"><h2>Build the inputs for a 24-month investment</h2><div class="eyebrow">Pairs · 3 minutes</div></div><div class="rule"></div>
      <div class="activity-prompt"><strong>Choose one complete input pair.</strong><span>Quoted return: 12% nominal APR, compounded monthly. Holding period: 24 months.</span></div>
      <div class="rate-options" data-interactive="rates"><button type="button" data-correct="false" aria-pressed="false"><b>Rate 12%</b><span>n = 2</span></button><button type="button" data-correct="false" aria-pressed="false"><b>Rate 12%</b><span>n = 24</span></button><button type="button" data-correct="true" aria-pressed="false"><b>Rate 1%</b><span>n = 24</span></button><button type="button" data-correct="false" aria-pressed="false"><b>Rate 12.68%</b><span>n = 24</span></button></div>
      <div class="activity-actions"><button type="button" class="check-button" data-action="check-rates">Check pair</button><output id="rate-feedback" aria-live="polite">Required deliverable: the rate, n, and unit attached to each.</output></div>`,
      'Answer: rate equals one percent per month and n equals twenty-four months. Rationale: both inputs describe the same monthly period. Likely misconception: use twelve percent with twenty-four because both numbers appear in the prompt. Debrief by asking how the setup changes if the source gives a 12.68 percent EAR instead. Time: 3 minutes.'),

    slide('10', 'Reveal: matched units produce the right growth', 'cream reveal-slide', `
      <div class="header-row"><h2>At 1% per month, $5,000 grows to $6,348.67</h2><div class="eyebrow">Reveal and debrief</div></div><div class="rule"></div>
      <div class="unit-equation" role="img" aria-label="Five thousand dollars compounded at one percent for twenty-four monthly periods equals six thousand three hundred forty-eight dollars and sixty-seven cents"><article><span>PV</span><strong>−$5,000</strong></article><b>×</b><article><span>Monthly growth</span><strong>(1.01)<sup>24</sup></strong></article><b>=</b><article class="result"><span>FV</span><strong>$6,348.67</strong></article></div>
      <div class="formula-band light"><code>=FV(12%/12,24,0,-5000)</code><span>Rate unit = period-count unit = month</span></div>`,
      'Confirm the result independently: five thousand times 1.01 to the twenty-fourth power equals 6,348.67. Compare with the wildly overstated result from using twelve percent as a monthly rate. Ask: what two labels should appear beside any TVM input? The value and its period unit. Time: 2 minutes.'),

    slide('12', 'Evidence needs an audit trail', 'cream evidence-slide', `
      <div class="header-row"><h2>A rate is usable only when its definition travels with it</h2><div class="eyebrow">Public workflow mockup</div></div><div class="rule"></div>
      <div class="evidence-pipeline" role="img" aria-label="A public data workflow from source to definition to units to retrieval date to model cell"><article><span>Source</span><strong>SEC filing · treasury data · company terms</strong></article><i>→</i><article><span>Definition</span><strong>APR, EAR, yield, or required return?</strong></article><i>→</i><article><span>Units</span><strong>Annual, monthly, currency, scale</strong></article><i>→</i><article><span>As of</span><strong>Retrieval date and market date</strong></article><i>→</i><article class="model"><span>Model cell</span><strong>Documented input</strong></article></div>
      <div class="evidence-note">Record the field, definition, period, units, currency, supplier, and retrieval date.</div>`,
      'Treat the workflow as a platform-neutral audit habit. Do not imply that a source label alone makes an input auditable. Ask students why “interest rate = 8%” is incomplete. They should identify definition, period, and as-of date. Time: 2 minutes.'),

    slide('14,15,16', 'Worked setup: map the future-value decision', 'cream setup-slide', `
      <div class="header-row"><h2>One timeline supplies every FV input</h2><div class="eyebrow">Berkshire teaching scenario</div></div><div class="rule"></div>
      <div class="worked-map"><div class="mini-timeline" role="img" aria-label="Negative ten thousand dollars at time zero compounds at eight percent annually to an unknown future value at year five"><article class="outflow"><span>Today · B4</span><strong>−$10,000</strong></article><div class="arrow-track"><b>8% each year · B5</b><i></i><i></i><i></i><i></i><i></i></div><article class="inflow"><span>Year 5 · B10</span><strong>FV = ?</strong></article></div><div class="input-audit"><article><span>Periods · B6</span><strong>5 years</strong></article><article><span>Payment · B7</span><strong>$0</strong></article><article><span>Type · B8</span><strong>0 · period-end</strong></article></div></div>
      <div class="decision-banner">Question: how much cash must return in Year 5 to equal an 8% annual opportunity?</div>`,
      'Name the cells before calculating. B4 is the present outflow, B5 the annual rate, B6 the number of annual periods, B7 zero because this is a lump sum, and B8 zero for end-of-period convention. The result belongs in B10 and is measured in Year 5 dollars. Time: 3 minutes.'),

    slide('14,15,16,17', 'Student attempt: build the FV formula', 'cream activity-slide formula-build', `
      <div class="header-row"><h2>Write the function from the timeline—not from memory</h2><div class="eyebrow">Individual → pair · 4 minutes</div></div><div class="rule"></div>
      <div class="formula-builder"><div class="formula-shell"><span>=FV(</span><b>rate</b><span>,</span><b>nper</b><span>,</span><b>pmt</b><span>,</span><b>pv</b><span>,</span><b>type</b><span>)</span></div><div class="cell-bank"><code>B4 = −$10,000</code><code>B5 = 8%</code><code>B6 = 5</code><code>B7 = 0</code><code>B8 = 0</code></div></div>
      <div class="attempt-steps compact"><article><b>Write</b><p>Replace each argument with a cell.</p></article><article><b>Audit</b><p>Label the unit and sign.</p></article><article><b>Deliver</b><p>Formula + expected result direction.</p></article></div>`,
      'Answer: =FV(B5,B6,B7,B4,B8). A formula that hard-codes the numbers can calculate correctly but is less auditable and harder to stress-test. Likely misconception: placing present value first because it occurs first in time. Debrief by asking students to predict whether the answer should be positive and larger than ten thousand dollars. Time: 4 minutes.'),

    slide('17,18', 'Reveal: Excel returns the Year 5 value', 'cream excel-slide result-excel', `
      <div class="header-row"><h2>The correct model returns $14,693.28 in Year 5 dollars</h2><div class="eyebrow">Reveal and interpret</div></div><div class="rule"></div>
      <div class="excel-sheet compact-sheet" aria-label="Editable worksheet visual highlighting the FV formula and result">
        <div class="excel-ribbon"><span>BUS311_TVM.xlsx</span><b>Formulas</b><strong>Future Value</strong></div><div class="excel-formula-row"><span class="name-box">B10</span><b>ƒx</b><code>=FV(B5,B6,B7,B4,B8)</code></div>
        <div class="result-sheet"><div><span>PV · B4</span><strong>−$10,000.00</strong></div><i>→</i><div><span>Rate · B5</span><strong>8.00%</strong></div><i>×</i><div><span>Periods · B6</span><strong>5</strong></div><i>→</i><div class="selected"><span>FV · B10</span><strong>$14,693.28</strong></div></div>
        <div class="excel-status"><span>Manual check: $10,000 × 1.08<sup>5</sup></span><span>Answer date: end of Year 5</span></div>
      </div><div class="interpret-strip"><strong>The number is not “profit.”</strong><span>It is the future amount economically equivalent to $10,000 today at an 8% required return.</span></div>`,
      'Reveal the formula and result. The manual check is 10,000 times 1.08 to the fifth power, which equals 14,693.28. Stress that the difference is not automatically accounting profit; it is required future value under the assumed return. Ask students to state the answer date before the amount. Time: 4 minutes.'),

    slide('23', 'Sensitivity shows which assumption matters', 'cream sensitivity-chart-slide', `
      <div class="header-row"><h2>More time makes the required return more consequential</h2><div class="eyebrow">Same cells · varied B5 and B6</div></div><div class="rule"></div>
      <div class="sensitivity-chart" role="img" aria-label="Future value of ten thousand dollars across annual returns from four to twelve percent after three, five, and seven years">
        <div class="y-label">Future value</div><div class="grid-lines"><span>$22k</span><span>$19k</span><span>$16k</span><span>$13k</span><span>$10k</span></div>
        <svg viewBox="0 0 1200 500" aria-hidden="true"><path class="line three" d="M80 406 L330 383 L580 359 L830 334 L1080 308"/><path class="line five" d="M80 374 L330 332 L580 286 L830 236 L1080 183"/><path class="line seven" d="M80 339 L330 274 L580 200 L830 118 L1080 26"/><g class="dots"><circle cx="80" cy="374" r="12"/><circle cx="330" cy="332" r="12"/><circle cx="580" cy="286" r="12"/><circle cx="830" cy="236" r="12"/><circle cx="1080" cy="183" r="12"/></g></svg>
        <div class="x-labels"><span>4%</span><span>6%</span><span>8%</span><span>10%</span><span>12%</span></div><div class="legend"><span class="three">3 years</span><span class="five">5 years</span><span class="seven">7 years</span></div>
      </div>`,
      'Describe the chart as a sensitivity map, not a forecast. Every line uses the same ten-thousand-dollar present value. The slope becomes steeper with more time because the rate compounds over more periods. The five-year values at four, six, eight, ten, and twelve percent are 12,166.53; 13,382.26; 14,693.28; 16,105.10; and 17,623.42. Time: 3 minutes.'),

    slide('23', 'Activity: stress-test the FV model', 'cream activity-slide slider-slide', `
      <div class="header-row"><h2>Find the rate that pushes Year 5 value above $16,000</h2><div class="eyebrow">Pairs · 3 minutes</div></div><div class="rule"></div>
      <div class="slider-lab" data-interactive="sensitivity"><div class="slider-control"><label for="fv-rate">Annual required return</label><input id="fv-rate" type="range" min="4" max="12" step="1" value="8"><output id="fv-rate-value">8%</output></div><div class="slider-result"><span>Year 5 future value</span><strong id="fv-output">$14,693.28</strong><small id="fv-decision">Below the $16,000 threshold</small></div></div>
      <div class="deliverable">Required deliverable: the lowest whole-percent rate that clears $16,000, plus one sentence explaining why.</div>`,
      'Answer: ten percent is the lowest whole-percent rate that produces more than sixteen thousand dollars after five years; the output is 16,105.10. At nine percent the value is 15,386.24. Likely misconception: interpreting the higher required future value as automatically better. Debrief: a higher hurdle makes an investment harder to justify because it must produce more future cash. Time: 3 minutes.'),

    slide('18,23', 'Debrief: sensitivity is a decision test', 'dark debrief-slide', `
      <div class="eyebrow">Interpret the model</div><h2>A result is useful only with its value date and required return</h2>
      <div class="debrief-equation"><article><span>Calculated amount</span><strong>$14,693.28</strong></article><b>+</b><article><span>Value date</span><strong>End of Year 5</strong></article><b>+</b><article><span>Decision assumption</span><strong>8% annual return</strong></article><b>=</b><article class="result"><span>Defensible statement</span><strong>Economic equivalent</strong></article></div>`,
      'Model the complete interpretation: “At an eight percent annual required return, ten thousand dollars today is economically equivalent to 14,693.28 at the end of Year 5.” Ask students what would make the statement incomplete. Missing date, rate, direction, or scenario. Time: 1 minute.'),

    slide('19', 'Cash-flow patterns', 'dark section', `<div class="gradient-bar"></div><div class="eyebrow">Transfer the grammar</div><h2>The shape of the cash flows selects the function</h2><p>One payment, a repeated stream, or a stream with no planned end.</p>`,
      'Transition from the lump-sum model to reusable cash-flow patterns. Emphasize that the timeline still comes first; the pattern simply determines whether a lump-sum function, annuity function, or perpetuity shortcut is appropriate. Time: 1 minute.'),

    slide('20,21,22', 'Choose the function from the pattern', 'cream pattern-tree-slide', `
      <div class="header-row"><h2>Start with the cash-flow shape—not the equation</h2><div class="eyebrow">Pattern decision tree</div></div><div class="rule"></div>
      <div class="pattern-tree" role="img" aria-label="Decision tree selecting lump sum for one dated cash flow, annuity for a finite equal stream, and perpetuity for an equal stream with no end date"><div class="tree-root">How many promised cash flows?</div><div class="tree-branches"><article><span>One dated payment</span><strong>Lump sum</strong><code>PV or FV</code></article><article><span>Equal payments · finite</span><strong>Annuity</strong><code>PV, FV, or PMT</code></article><article><span>Equal payments · no end</span><strong>Perpetuity</strong><code>PV = C ÷ r</code></article></div></div>`,
      'Walk from the question at the top to each branch. A bond is not a pure annuity because it combines a coupon annuity with a lump-sum principal repayment. A growing perpetuity is a separate pattern and requires growth below the required return. Time: 3 minutes.'),

    slide('20', 'A lump sum follows one path', 'cream lump-slide', `
      <div class="header-row"><h2>One future payment needs one discounting path</h2><div class="eyebrow">Apple note teaching example</div></div><div class="rule"></div>
      <div class="lump-path" role="img" aria-label="A twenty-thousand-dollar maturity payment in five years discounted at eight percent to a present value of thirteen thousand six hundred eleven dollars and sixty-six cents"><article class="future"><span>Single maturity payment</span><strong>$20,000</strong><small>Year 5</small></article><div class="discount-steps"><b>÷ 1.08<sup>5</sup></b><i>← discount to today</i></div><article class="present"><span>Equivalent today</span><strong>$13,611.66</strong><small>Today</small></article></div>
      <div class="formula-band light"><code>=PV(8%,5,0,-20000)</code><span>One payment · no recurring PMT</span></div>`,
      'This is a teaching example framed around a single promised payment, not a quote for a specific Apple security. The payment is entered negative so Excel returns a positive present value. Link this directly to bond valuation: principal is a lump sum, while coupons form a separate stream. Time: 3 minutes.'),

    slide('21', 'Prediction: does payment timing matter?', 'dark annuity-predict-slide', `
      <div class="eyebrow">Prediction setup · lease payments</div><h2>Same five $4,000 payments. Which stream is worth more today?</h2>
      <div class="annuity-compare" role="img" aria-label="An ordinary annuity pays four thousand dollars at the end of years one through five while an annuity due pays at the beginning of years zero through four"><article><span>Ordinary annuity</span><div class="cash-dots end"><i></i><i>$4k</i><i>$4k</i><i>$4k</i><i>$4k</i><i>$4k</i></div><small>Payments at period-end</small></article><article><span>Annuity due</span><div class="cash-dots due"><i>$4k</i><i>$4k</i><i>$4k</i><i>$4k</i><i>$4k</i><i></i></div><small>Payments at period-beginning</small></article></div>`,
      'Do not reveal the values. Ask students to predict which stream has greater present value at an eight percent required return and to identify the single timing difference. A show of hands is enough before pair work. Likely misconception: equal totals imply equal values. Time: 2 minutes.'),

    slide('21', 'Student attempt: defend the timing choice', 'cream activity-slide', `
      <div class="header-row"><h2>Explain the direction before calculating</h2><div class="eyebrow">Pairs · 3 minutes</div></div><div class="rule"></div>
      <div class="attempt-board"><div class="attempt-question"><span>Your task</span><strong>Choose ordinary or due, then explain the valuation logic.</strong></div><div class="attempt-steps"><article><b>Compare</b><p>Locate the first payment.</p></article><article><b>Reason</b><p>Count how long each cash flow is discounted.</p></article><article><b>Deliver</b><p>Choice + one timing sentence.</p></article></div></div>
      <div class="deliverable">Required deliverable: “The ___ annuity is worth more because ___.”</div>`,
      'Answer: the annuity due is worth more because every payment arrives one period earlier and is discounted for one fewer period. Accept a timeline explanation before requiring a formula. Debrief with one pair that used time-zero language and one that used the one-fewer-period logic. Time: 3 minutes.'),

    slide('21', 'Reveal: one period earlier raises value', 'cream reveal-slide annuity-reveal', `
      <div class="header-row"><h2>The annuity due is worth $1,277.67 more today</h2><div class="eyebrow">Reveal and debrief</div></div><div class="rule"></div>
      <div class="annuity-results"><article><span>Ordinary annuity · type 0</span><strong>$15,970.84</strong><code>=PV(8%,5,-4000,0,0)</code></article><div class="timing-shift"><b>× 1.08</b><span>Every payment shifts one period earlier</span></div><article class="due"><span>Annuity due · type 1</span><strong>$17,248.51</strong><code>=PV(8%,5,-4000,0,1)</code></article></div>
      <div class="interpret-strip"><strong>Same total cash: $20,000.</strong><span>Different timing creates different present value.</span></div>`,
      'Reveal the two present values. The ordinary annuity is 15,970.84. Multiplying by 1.08 gives the annuity-due value of 17,248.51 because the entire stream moves one period earlier. Likely misconception: type equals the number of payments. Clarify that type zero means end-of-period and type one means beginning-of-period. Time: 3 minutes.'),

    slide('22', 'A perpetuity needs strict conditions', 'cream perpetuity-slide', `
      <div class="header-row"><h2>A perpetuity is simple only when its assumptions are strong</h2><div class="eyebrow">Level cash forever</div></div><div class="rule"></div>
      <div class="perpetuity-system" role="img" aria-label="A five-hundred-thousand-dollar annual cash flow beginning in one year and continuing forever has a present value of six million two hundred fifty thousand dollars at eight percent"><div class="perp-timeline"><span>Today</span><i></i><b>Year 1 · $500k</b><b>Year 2 · $500k</b><b>Year 3 · $500k</b><em>… forever</em></div><div class="perp-formula"><span>Level perpetuity</span><code>PV = C ÷ r</code><strong>$500,000 ÷ 8% = $6.25M</strong></div></div>
      <div class="condition-row"><span>First payment: one period from today</span><span>Cash flow: level</span><span>Required return: stable</span></div>`,
      'State the conditions before using the shortcut. If the first payment is today, add it separately. If cash flow grows, use the growing-perpetuity formula and require growth below the discount rate. Ask why an infinite stream can have finite value: distant payments are heavily discounted. Time: 3 minutes.'),

    slide('20,21,22,24', 'Activity: classify the cash-flow pattern', 'cream activity-slide pattern-activity', `
      <div class="header-row"><h2>Choose the valuation pattern for each business promise</h2><div class="eyebrow">Teams · 4 minutes</div></div><div class="rule"></div>
      <div class="pattern-options" data-interactive="patterns">
        <button type="button" data-correct="lump" aria-pressed="false"><span>Supplier rebate</span><strong>One $2M payment in Year 3</strong><small>Choose: lump · annuity · perpetuity</small></button>
        <button type="button" data-correct="annuity" aria-pressed="false"><span>Equipment lease</span><strong>$450k each year for 6 years</strong><small>Choose: lump · annuity · perpetuity</small></button>
        <button type="button" data-correct="perpetuity" aria-pressed="false"><span>Endowment policy</span><strong>$300k annually with no planned end</strong><small>Choose: lump · annuity · perpetuity</small></button>
      </div><div class="pattern-controls"><div class="choice-buttons"><button type="button" data-pattern="lump">Lump</button><button type="button" data-pattern="annuity">Annuity</button><button type="button" data-pattern="perpetuity">Perpetuity</button></div><button type="button" class="check-button" data-action="check-patterns">Check classifications</button><output id="pattern-feedback" aria-live="polite">Select a scenario, then assign a pattern.</output></div>
      <div class="deliverable">Required deliverable: three classifications and the timeline feature that justifies each.</div>`,
      'Answers: supplier rebate is a lump sum; equipment lease is a finite annuity; endowment policy is a perpetuity. Likely misconception: calling any repeated payment a perpetuity. Require students to identify whether the stream has an end date. Debrief: a coupon bond combines which two patterns? An annuity of coupons plus a lump-sum principal. Time: 4 minutes.'),

    slide('25', 'Three safeguards protect every TVM model', 'cream recap-slide', `
      <div class="header-row"><h2>Trust the result only after three audits</h2><div class="eyebrow">Close the loop</div></div><div class="rule"></div>
      <div class="audit-loop" role="img" aria-label="A three-part audit loop checks the timeline, units, and cash-flow direction before interpreting the result"><article><span>Timeline</span><strong>Where does each cash flow occur?</strong></article><i>→</i><article><span>Units</span><strong>Do rate and periods match?</strong></article><i>→</i><article><span>Direction</span><strong>Do inflows and outflows use opposite signs?</strong></article><i>↺</i></div>
      <div class="decision-banner">Then state the amount, the value date, and the required-return assumption.</div>`,
      'Have students restate each safeguard without looking at their notes. Ask for one example of a plausible-looking output that fails each audit. Reinforce that the final sentence must include amount, date, and rate assumption. Time: 2 minutes.'),

    slide('24,26,27', 'Exit ticket: make the valuation decision-ready', 'dark close exit-slide', `
      <div class="gradient-bar"></div><div class="eyebrow">Exit ticket · 3 minutes</div><h2>Finish one sentence that a CFO could use</h2>
      <div class="exit-prompt">“At ___% per ___, $___ today is equivalent to $___ at ___.”</div>
      <div class="exit-actions" data-interactive="exit"><button type="button" data-exit="timeline">I can map the timeline</button><button type="button" data-exit="excel">I can audit the Excel function</button><button type="button" data-exit="decision">I can defend the decision</button></div>
      <output id="exit-feedback" aria-live="polite">Choose the skill you can defend most clearly, then complete the sentence on paper.</output>
      <div class="next-band"><span>Next</span><strong>Apply TVM to coupon bonds and yield to maturity.</strong></div>`,
      'Required answer components: a periodic rate with its unit, a present amount, a future amount, and the future value date. Ask students to circle the skill they can defend and underline the assumption they would stress-test. Collect the sentence as the deliverable. Preview the next lesson: a coupon bond is an annuity plus a lump sum. Time: 3 minutes.')
  ]
};
