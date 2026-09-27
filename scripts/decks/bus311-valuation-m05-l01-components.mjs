const slide = (slides, label, classes, body, note) => ({ slides, label, classes, body, note });

export const tvmM05L01Deck = {
  title: 'Time Value of Money',
  slides: [
    slide('1', 'Time value of money', 'dark title-slide', `
      <div class="gradient-bar"></div>
      <div class="title-grid">
        <div class="title-copy"><div class="eyebrow">BUS311 · Valuation M05</div><h1>A dollar’s job depends on <em>when</em> it arrives</h1><p>One equipment need. Two ways to pay. One value date.</p></div>
        <div class="clock-orbit" role="img" aria-label="Cash moves around a clock from today to a future date and back to present value"><span class="now">TODAY</span><span class="future">FUTURE</span><b>FV →</b><b>← PV</b><i></i></div>
      </div>`,
      'Open with the equipment decision in the starter workbook: pay cash today or finance the same asset. The clock establishes a common valuation date. Ask students what must be compared before they recommend either path. Time: 1 minute.'),

    slide('2; starter workbook', 'Start activity: equipment case', 'cream scenario-summary-slide', `
      <div class="header-row"><h2>Build the equipment purchase decision</h2><div class="eyebrow">Start activity</div></div><div class="rule"></div>
      <div class="scenario-context"><span>Berkshire Hathaway teaching scenario</span><strong>A wholly owned operation needs equipment now.</strong></div>
      <div class="scenario-options" role="img" aria-label="The operation can pay 80000 dollars today or finance the purchase with 24 beginning-of-month payments of 3150 dollars and an 8000 dollar balloon in Month 24">
        <article><span>Pay cash</span><strong>$80,000</strong><small>Company outflow today</small></article>
        <div class="scenario-or">OR</div>
        <article><span>Finance</span><strong>24 × $3,150</strong><small>Beginning of each month</small><b>+ $8,000 balloon in Month 24</b></article>
      </div>
      <div class="scenario-rate"><span>Financing quote</span><strong>9.6% nominal APR</strong><small>Compounded monthly</small></div>
      <div class="deliverable">Build both payment paths in today’s dollars. Recommend a choice and name an assumption that could reverse it.</div>`,
      'Introduce this as a hypothetical Berkshire Hathaway equipment decision. Launch the starter in one minute, then allow seven minutes for students to begin mapping and comparing the payment paths. Circulate for questions about the financing quote and first-payment timing. Withhold the final present-cost comparison. Time: 8 minutes.'),

    slide('5,6,7,8; starter workbook', 'One timeline check for the starter', 'cream starter-timeline-slide', `
      <div class="header-row"><h2>One timing check sets up the entire workbook</h2><div class="eyebrow">Review once · then model</div></div><div class="rule"></div>
      <div class="starter-timeline" role="img" aria-label="A timeline for cash purchase, beginning-of-month financing payments, and month 24 balloon">
        <b>Company cash flow</b><b>Today · t=0</b><b>Month 1</b><b>Months 2–23</b><b>Month 24</b>
        <span>Cash purchase</span><strong>−$80,000</strong><i>—</i><i>—</i><i>—</i>
        <span>Monthly financing</span><strong>First −$3,150</strong><strong>Next payment</strong><strong>Continue</strong><i>Check the count</i>
        <span>Balloon</span><i>—</i><i>—</i><i>—</i><strong>−$8,000</strong>
      </div>
      <div class="timeline-review"><span>24 payments begin at t=0</span><span>Balloon arrives at Month 24</span><span>Value date for the choice: today</span></div>
      <div class="formula-band light"><code>FV = PV × (1+r)<sup>n</sup></code><code>PV = FV ÷ (1+r)<sup>n</sup></code></div>
      <div class="deliverable">Pairs · 3 minutes · In 1 Timeline-Diagnose, complete B18:H20 and explain which cash flows belong to each function family.</div>`,
      'This is the single explicit timeline review. A beginning-of-month payment stream has its first payment at time zero; 24 payments end at Month 23, while the balloon is a separate Month 24 outflow. Students complete the remaining workbook positions and labels. Later visuals may point back here without another timeline lesson. Time: 3 minutes.')
  ]
};
