const html = (parts) => parts.join('');

const header = (title, eyebrow) => html([
  "<div class='header-row'><h2>", title, "</h2><span class='eyebrow'>", eyebrow, "</span></div>",
  "<div class='rule'></div>"
]);

const note = ({ timing, answer, rationale, misconception, debrief, transition }) =>
  `Timing: ${timing}. Formative answer: ${answer} Rationale: ${rationale} Likely misconception: ${misconception} Debrief question: ${debrief}${transition ? ` Transition: ${transition}` : ''}`;

const slide = (sourceSlides, label, classes, body, teachingNote) => ({
  slides: sourceSlides,
  label,
  classes,
  body,
  note: teachingNote
});

const choiceActions = (group) => html([
  "<div class='activity-actions'><button class='check-button' type='button' data-check='", group, "'>Check</button>",
  "<button class='reset-button' type='button' data-reset='", group, "'>Reset</button>",
  "<output id='", group, "-feedback'>Choose before checking.</output></div>"
]);

export const bondsM06L01Deck = {
  title: 'Bond Valuation, Interest Rates, and YTM',
  slides: [
    slide('1', 'Title', 'dark title-slide', html([
      "<div class='gradient-bar'></div><div class='title-grid'><div class='title-copy'>",
      "<div class='eyebrow'>BUS311 · Valuation · M06</div>",
      "<h1>A bond price is a <em>cash-flow verdict.</em></h1>",
      "<p>Bond valuation, yield, interest-rate risk, and Meridian’s financing decision</p></div>",
      "<div class='bond-emblem' role='img' aria-label='A ten-year bond contract sends semiannual coupons to investors and principal at maturity'>",
      "<div class='issuer'>Meridian<br><small>issuer</small></div><div class='coupon-stream'><i></i><i></i><i></i><i></i><i></i><strong>$27.50 × 20</strong></div><div class='investor'>Investors<br><small>capital providers</small></div>",
      "<div class='principal-arrow'>Year 10 · $1,000 principal</div></div></div>"
    ]), note({timing:'2 minutes', answer:'A bond is a dated contract whose market price equals the present value of promised coupons and principal', rationale:'The image frames valuation as a two-sided financing decision rather than an isolated formula', misconception:'Students may treat the coupon rate as the investor return in every market condition', debrief:'Which cash flows are contractually fixed, and which market input can move today?', transition:'Ask for a prediction before showing any calculation.'})),

    slide('4,10,11,19', 'Opening prediction', 'dark prediction-slide', html([
      "<div class='eyebrow'>Opening prediction · 3 minutes</div><h2>Would investors pay above or below $1,000?</h2>",
      "<div class='prediction-givens'><article><span>Coupon rate</span><strong>5.00%</strong><small>Contractual</small></article><article><span>Market YTM</span><strong>6.00%</strong><small>Required today</small></article><article><span>Maturity</span><strong>10 years</strong><small>Semiannual coupons</small></article></div>",
      "<div class='task-strip'><b>DO</b><span>Vote premium, par, or discount. Discuss with one partner. Produce one sentence linking coupon rate to required yield.</span><b>3 MIN</b></div>",
      "<div class='prediction-buttons' data-prediction='opening'><button type='button'>Premium</button><button type='button'>At par</button><button type='button'>Discount</button></div>"
    ]), note({timing:'3 minutes', answer:'Below par, because the 5 percent coupon is less attractive than the 6 percent yield available on comparable debt', rationale:'Price must fall until the fixed cash flows provide the market-required return', misconception:'Students often say the coupon rises to 6 percent or confuse the quoted YTM with a contractual payment', debrief:'What must adjust when the contract cannot change?', transition:'Do not display the price yet; build the cash-flow model first.'})),

    slide('2', 'Agenda', 'cream agenda-slide', html([
      header('Three decisions organize today’s work', '75 minutes'),
      "<div class='decision-route' role='img' aria-label='Lesson route from mapping bond cash flows to pricing the contract to testing issuer capacity'>",
      "<article><span>MAP</span><strong>What is promised?</strong><small>Coupons, principal, timing, signs</small></article><i>→</i>",
      "<article><span>PRICE</span><strong>What return does the market require?</strong><small>PV, YTM, premium or discount</small></article><i>→</i>",
      "<article><span>DECIDE</span><strong>Can the issuer carry the debt?</strong><small>Duration, spread, ratios, use of proceeds</small></article></div>",
      "<div class='time-route'><span>Opening + cash flows · 18m</span><span>Price + yield · 27m</span><span>Risk + decision · 25m</span><span>Exit · 5m</span></div>"
    ]), note({timing:'2 minutes', answer:'The lesson moves from contract cash flows to market price and finally to a corporate financing recommendation', rationale:'Each stage supplies evidence required by the next; skipping timing makes later conclusions fragile', misconception:'Students may expect bond valuation to end once Excel returns a price', debrief:'Which stage answers an investor question, and which stage answers the CFO question?', transition:'Make the performance expectations explicit.'})),

    slide('3', 'Learning objectives', 'cream objectives-slide', html([
      header('You will leave able to defend a bond decision', 'LO4 · LO5'),
      "<div class='objective-system' role='img' aria-label='Four bond-analysis skills feed a defensible CFO recommendation'>",
      "<div class='objective-core'>Defend the recommendation</div>",
      "<article><strong>Map</strong><span>Every dated cash flow</span></article><article><strong>Price</strong><span>Use Excel PV and RATE</span></article><article><strong>Interpret</strong><span>Premium, discount, YTM</span></article><article><strong>Stress</strong><span>Rates, spread, capacity</span></article></div>"
    ]), note({timing:'2 minutes', answer:'Students must connect accurate cash-flow mechanics to a financing judgment supported by price, yield, and capacity evidence', rationale:'The objectives align calculation skill with interpretation rather than rewarding spreadsheet completion alone', misconception:'A correct formula is not sufficient if the value date, units, or decision implication are missing', debrief:'What would make a technically correct price unusable in a CFO memo?', transition:'Start with the bond contract itself.'})),

    slide('5', 'Cash-flow section', 'dark section', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Bond cash flows</div>",
      "<h2>The contract fixes the cash flows. The market sets their price.</h2>",
      "<p>Map coupon timing and principal before choosing a function.</p>"
    ]), note({timing:'1 minute', answer:'Coupons and principal are contractual; the required yield is the market discount rate applied to them', rationale:'Separating contract terms from market terms prevents the most common conceptual error', misconception:'Students may think a market-rate change rewrites the bond coupon', debrief:'Which variable can change today without changing the legal promise?', transition:'Show both sides of the contract.'})),

    slide('6,7', 'Two-sided contract', 'cream contract-slide', html([
      header('One contract creates opposite cash-flow signs', 'Issuer ↔ investor'),
      "<div class='contract-map' role='img' aria-label='Investor pays price today and receives coupons plus principal; issuer receives proceeds today and pays coupons plus principal'>",
      "<article class='investor-side'><span>INVESTOR</span><strong>−Price today</strong><small>+$25 every six months<br>+$1,000 principal at maturity</small></article>",
      "<div class='contract-arrows'><b>Today →</b><i></i><b>← Future payments</b></div>",
      "<article class='issuer-side'><span>ISSUER</span><strong>+Proceeds today</strong><small>−$25 every six months<br>−$1,000 principal at maturity</small></article></div>",
      "<div class='sign-rule'>Excel requires one side of the transaction to be negative.</div>"
    ]), note({timing:'3 minutes', answer:'Investor and issuer see identical amounts with opposite signs; the final payment includes both the last coupon and principal', rationale:'Cash-flow direction explains why Excel PV or RATE arguments must use opposite signs', misconception:'All-positive cash flows should still produce a positive price', debrief:'Whose perspective will our worksheet use, and which values must carry negative signs?', transition:'Place every payment on a complete timeline.'})),

    slide('6,7', 'Complete cash-flow timeline', 'cream timeline-slide', html([
      header('Every promised payment gets a place in time', 'Teaching bond · investor view'),
      "<div class='twenty-periods' role='img' aria-label='Investor pays the bond price at period zero, receives 25 dollars in periods 1 through 19, and receives 1,025 dollars in period 20'>",
      "<article class='today'><time>0</time><strong>−P</strong></article>",
      ...Array.from({length:19},(_,index)=>`<article><time>${index+1}</time><strong>$25</strong></article>`),
      "<article class='maturity'><time>20</time><strong>$1,025</strong></article></div>",
      "<div class='timeline-key'><span>Periods 1–19 · coupon only</span><span>Period 20 · coupon + principal</span><span>Each period · six months</span></div>"
    ]), note({timing:'4 minutes', answer:'The investor pays price at period zero, receives nineteen 25-dollar coupons, then receives 1,025 dollars in period twenty', rationale:'A complete schedule makes frequency, maturity, and the final principal repayment visible before discounting', misconception:'Students frequently omit the last coupon, place principal in year ten without converting to period twenty, or discount twenty-one payments', debrief:'How many coupon payments occur, and what makes the last one different?', transition:'Translate the timeline directly into Excel inputs.'})),

    slide('8,18', 'Excel function early', 'dark formula-slide', html([
      "<div class='eyebrow'>Excel first</div><h2>PV prices the entire contract in one auditable function.</h2>",
      "<div class='excel-callout'><span>INVESTOR PRICE TODAY</span><code>=-PV(B10,B9,B8,B3)</code><small>rate · periods · coupon · principal</small></div>",
      "<div class='function-translation' role='img' aria-label='Excel PV arguments correspond to periodic yield, number of periods, coupon per period, and face value'>",
      "<span><b>B10</b>3% per half-year</span><i>→</i><span><b>B9</b>20 periods</span><i>→</i><span><b>B8</b>$25 coupon</span><i>→</i><span><b>B3</b>$1,000 principal</span></div>"
    ]), note({timing:'3 minutes', answer:'The price formula is negative PV of periodic yield, total periods, coupon per period, and face value', rationale:'Introducing PV before manual arithmetic gives students a reliable implementation path while preserving the economic meaning of each argument', misconception:'Students may enter annual yield with semiannual periods or make every cash flow positive', debrief:'Which two inputs must be converted to the same six-month unit?', transition:'Build the worksheet with stable cell references.'})),

    slide('13,14', 'Excel inputs', 'cream excel-slide', html([
      header('Keep every assumption visible—and every unit aligned', 'Editable worksheet · inputs'),
      "<div class='excel-window' role='img' aria-label='Excel-style bond pricing worksheet with face value in B3, coupon rate in B4, frequency in B5, years in B6, and annual YTM in B7'>",
      "<div class='excel-title'><span>Home &nbsp; Insert &nbsp; Formulas</span><strong>Teaching_Bond.xlsx</strong></div>",
      "<div class='excel-formula'><span>B12</span><b>fx</b><code>=-PV(B10,B9,B8,B3)</code></div>",
      "<div class='sheet-grid bond-sheet'><b></b><b>A</b><b>B</b><b>Units</b>",
      "<span>3</span><strong>Face value</strong><em class='input-cell'>$1,000</em><em>Dollars at maturity</em>",
      "<span>4</span><strong>Annual coupon rate</strong><em class='input-cell'>5.00%</em><em>Nominal annual</em>",
      "<span>5</span><strong>Payments per year</strong><em class='input-cell'>2</em><em>Semiannual</em>",
      "<span>6</span><strong>Years to maturity</strong><em class='input-cell'>10</em><em>Years</em>",
      "<span>7</span><strong>Annual YTM</strong><em class='input-cell'>6.00%</em><em>Nominal annual</em>",
      "<span>8</span><strong>Coupon per period</strong><em class='formula-cell'>=B3*B4/B5</em><em>$25.00</em>",
      "<span>9</span><strong>Total periods</strong><em class='formula-cell'>=B6*B5</em><em>20</em>",
      "<span>10</span><strong>Yield per period</strong><em class='formula-cell'>=B7/B5</em><em>3.00%</em></div></div>"
    ]), note({timing:'4 minutes', answer:'B8 is 25 dollars, B9 is 20 periods, and B10 is 3 percent per semiannual period', rationale:'The worksheet separates annual contract terms from periodic valuation inputs and keeps units visible beside every value', misconception:'Ten years means ten PV periods or the annual coupon is 50 dollars every six months', debrief:'Which cells change when payment frequency changes from two to four?', transition:'Decompose price so the function is not a black box.'})),

    slide('8,15,16,17', 'Price components', 'cream component-slide', html([
      header('Price is the sum of two present values', 'As of today · dollars per bond'),
      "<div class='price-components' role='img' aria-label='Present value of coupons of 371 dollars and 94 cents plus present value of principal of 553 dollars and 68 cents equals a bond price of 925 dollars and 61 cents'>",
      "<article><span>PV OF 20 COUPONS</span><strong>$371.94</strong><code>$25 × annuity factor</code></article><i>+</i>",
      "<article><span>PV OF PRINCIPAL</span><strong>$553.68</strong><code>$1,000 ÷ 1.03²⁰</code></article><i>=</i>",
      "<article class='result'><span>PRICE TODAY</span><strong>$925.61</strong><small>Per $1,000 face-value bond</small></article></div>",
      "<div class='value-date'>Value date: today · Units: dollars per bond · Decision clue: price below par</div>"
    ]), note({timing:'4 minutes', answer:'Coupon PV is 371.94 dollars, principal PV is 553.68 dollars, and total price is 925.61 dollars today per bond', rationale:'The decomposition preserves the manual logic only where it explains what PV is adding', misconception:'The 1,000-dollar principal is not discounted because it is guaranteed or coupon PV alone is the bond price', debrief:'Which component dominates this ten-year bond, and how would a longer maturity change that balance?', transition:'Let students complete the prediction before confirming the classification.'})),

    slide('10,11,14-18', 'Price classification attempt', 'cream activity-slide', html([
      header('Classify the bond before the reveal', 'Partner calculation · 4 minutes'),
      "<div class='activity-brief'><b>WHAT</b><span>Use the visible worksheet inputs to classify the bond.</span><b>HOW</b><span>Calculate or reason with one partner, then click one choice.</span><b>PRODUCE</b><span>Price class + one-sentence explanation.</span><b>TIME</b><span>4 minutes</span></div>",
      "<div class='choice-board' data-choice-group='price-class'><button type='button' data-correct='false'><span>PREMIUM</span><strong>Price &gt; $1,000</strong></button><button type='button' data-correct='false'><span>PAR</span><strong>Price = $1,000</strong></button><button type='button' data-correct='true'><span>DISCOUNT</span><strong>Price &lt; $1,000</strong></button></div>",
      choiceActions('price-class')
    ]), note({timing:'4 minutes', answer:'Discount; 925.61 dollars is 74.39 dollars below par because the 5 percent coupon is below the 6 percent market-required yield', rationale:'The attempt requires both numerical classification and causal explanation before the conclusion is shown', misconception:'A lower price is bad for the investor in every context or discount means the issuer pays a lower borrowing cost', debrief:'Why does paying less today raise the return on fixed future cash flows?', transition:'Reveal the full interpretation and connect price to yield.'})),

    slide('10,11,19', 'Price classification reveal', 'dark reveal-slide', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Reveal and debrief</div><h2>The market discounts a below-market coupon.</h2>",
      "<div class='reveal-equation'><span>5.00% coupon</span><i>&lt;</i><span>6.00% required YTM</span><b>→</b><strong>$925.61</strong><small>$74.39 below par</small></div>",
      "<p>Value date: today · Unit: dollars per bond · Implication: price falls until expected return reaches the market requirement.</p>"
    ]), note({timing:'3 minutes', answer:'The bond sells for 925.61 dollars, a 74.39-dollar discount to par', rationale:'Because contractual cash flows cannot change, the current price must fall to make those cash flows yield 6 percent', misconception:'The discount is a one-time bargain unrelated to borrowing cost or the coupon will reset upward', debrief:'If market YTM fell to exactly 5 percent, where must price move?', transition:'Formalize the inverse price-yield relationship.'})),

    slide('9', 'Price and yield section', 'dark section', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Price and yield</div><h2>Required return moves. Contractual cash flows do not.</h2><p>Price absorbs the adjustment.</p>"
    ]), note({timing:'1 minute', answer:'Bond price and required yield move in opposite directions when promised cash flows are fixed', rationale:'This is the central comparative-static relationship for fixed-income valuation', misconception:'Price and yield should move together because both measure return', debrief:'Which side of the PV equation changes when market rates move?', transition:'Make the inverse mechanism visible.'})),

    slide('4,8-11', 'Inverse relationship', 'cream inverse-slide', html([
      header('Price moves opposite yield because the promise is fixed', 'Mechanism'),
      "<div class='inverse-engine' role='img' aria-label='When market yield rises, discounting becomes stronger and bond price falls; when market yield falls, discounting becomes weaker and bond price rises'>",
      "<article class='yield-up'><span>MARKET YIELD ↑</span><strong>New bonds pay more</strong><small>Old fixed coupons need a lower entry price.</small></article><div class='fixed-promise'><b>FIXED</b><strong>$25 × 20<br>+$1,000</strong></div><article class='yield-down'><span>MARKET YIELD ↓</span><strong>Old coupons look richer</strong><small>Investors bid the contract above par.</small></article>",
      "<div class='price-down'>PRICE ↓</div><div class='price-up'>PRICE ↑</div></div>"
    ]), note({timing:'4 minutes', answer:'Higher required yield produces a lower price; lower required yield produces a higher price', rationale:'Investors compare the fixed contract with current alternatives, so price adjusts until expected returns align', misconception:'A yield increase means the issuer immediately pays larger coupons on an existing fixed-rate bond', debrief:'Who gains from a rate increase after issuance if the investor must sell immediately?', transition:'Let students stress the same contract without changing its cash flows.'})),

    slide('24', 'Yield sensitivity lab', 'cream sensitivity-slide', html([
      header('Stress one input; keep the contract fixed', 'Interactive sensitivity'),
      "<div class='sensitivity-lab'><div class='rate-control'><label for='yield-slider'>Annual YTM <output id='yield-value'>6.0%</output></label><input id='yield-slider' type='range' min='4' max='8' step='0.5' value='6'><div class='rate-scale'><span>4%</span><span>5% coupon</span><span>8%</span></div><button type='button' class='reset-button' data-reset-yield>Reset to 6%</button></div>",
      "<div class='price-gauge' role='img' aria-label='Interactive bond price response to annual yield'><span>PRICE TODAY</span><strong id='yield-price'>$925.61</strong><small id='yield-class'>Discount · $74.39 below par</small><div class='par-line'>PAR · $1,000</div><div id='price-marker' class='price-marker'></div></div></div>",
      "<div class='task-strip light'><b>DO</b><span>Move YTM across 4%–8%. State the yield where price equals par and the direction of price change.</span><b>3 MIN</b></div>"
    ]), note({timing:'3 minutes', answer:'Price equals par at a 5 percent YTM; prices are above par below 5 percent and below par above 5 percent', rationale:'Only yield changes, so students can isolate the inverse relationship and identify the par threshold', misconception:'Price should equal par at maturity only, never today, or the coupon payment changes with the slider', debrief:'Why is 5 percent the exact crossing point?', transition:'Freeze the interactive into an auditable curve.'})),

    slide('24', 'Price-yield curve', 'cream curve-slide', html([
      header('The price–yield curve is inverse—and curved', 'Teaching bond · dollars per bond'),
      "<div class='curve-wrap'><svg class='price-curve' viewBox='0 0 1200 560' role='img' aria-label='Bond price declines from 1,081.76 dollars at 4 percent yield to 796.15 dollars at 8 percent yield and equals 1,000 dollars at 5 percent'>",
      "<path class='axis' d='M100 50 V480 H1120'/><path class='par-grid' d='M100 200 H1120'/><text x='1120' y='190' text-anchor='end'>PAR $1,000</text>",
      "<polyline class='curve-line' points='140,90 370,200 600,300 830,382 1060,450'/>",
      "<g><circle cx='140' cy='90' r='12'/><text x='140' y='65' text-anchor='middle'>$1,081.76</text><text x='140' y='520' text-anchor='middle'>4%</text></g>",
      "<g><circle cx='370' cy='200' r='12'/><text x='370' y='175' text-anchor='middle'>$1,000.00</text><text x='370' y='520' text-anchor='middle'>5%</text></g>",
      "<g><circle cx='600' cy='300' r='12'/><text x='600' y='275' text-anchor='middle'>$925.61</text><text x='600' y='520' text-anchor='middle'>6%</text></g>",
      "<g><circle cx='830' cy='382' r='12'/><text x='830' y='357' text-anchor='middle'>$857.88</text><text x='830' y='520' text-anchor='middle'>7%</text></g>",
      "<g><circle cx='1060' cy='450' r='12'/><text x='1060' y='425' text-anchor='middle'>$796.15</text><text x='1060' y='520' text-anchor='middle'>8%</text></g></svg>",
      "<div class='curve-insight'><strong>Convexity</strong><span>Equal yield changes do not create equal dollar price changes.</span></div></div>"
    ]), note({timing:'4 minutes', answer:'The price declines from 1,081.76 dollars at 4 percent to 796.15 dollars at 8 percent, crossing par at 5 percent', rationale:'The curve shows both the inverse direction and convex shape using independently calculated prices', misconception:'A one-percentage-point yield move always changes price by the same number of dollars', debrief:'Compare the price gain from 5 to 4 percent with the loss from 5 to 6 percent; what do you notice?', transition:'Show how premium and discount prices converge toward par.'})),

    slide('10,11', 'Pull to par', 'cream pull-to-par-slide', html([
      header('Premium and discount prices converge to par', 'Assuming no default and unchanged yield'),
      "<div class='pull-to-par' role='img' aria-label='Premium bond price slopes down to par while discount bond price slopes up to par at maturity'>",
      "<div class='par-axis'>PAR · $1,000</div><div class='premium-path'><span>Premium</span><b>$1,081.76</b></div><div class='discount-path'><span>Discount</span><b>$925.61</b></div><div class='maturity-pin'>Maturity</div></div>",
      "<div class='comparison-strip'><span>Coupon &gt; YTM → premium</span><span>Coupon = YTM → par</span><span>Coupon &lt; YTM → discount</span></div>"
    ]), note({timing:'3 minutes', answer:'With yield unchanged and promised payment expected, both premium and discount prices move toward 1,000 dollars as maturity approaches', rationale:'The final principal payment anchors the maturity value at par', misconception:'A premium remains permanently above par or pull to par guarantees a total gain regardless of purchase price', debrief:'Why must a 1,081-dollar bond lose premium over time even if it never defaults?', transition:'Reverse the model to solve for yield from observed price.'})),

    slide('18', 'YTM as internal rate', 'cream ytm-slide', html([
      header('YTM is the single rate that reconciles price and promised cash flows', 'Yield to maturity'),
      "<div class='ytm-loop' role='img' aria-label='Observed price and promised cash flows feed an internal rate calculation that returns yield to maturity'>",
      "<article><span>OBSERVE</span><strong>Price today</strong><small>$925.61</small></article><i>+</i><article><span>MAP</span><strong>Promised cash flows</strong><small>$25 × 20 + $1,000</small></article><i>→</i><article class='ytm-result'><span>SOLVE</span><strong>YTM</strong><small>6.00% nominal annual</small></article></div>",
      "<div class='assumption-band'>YTM summarizes the promised-return path if held to maturity and payments arrive as promised.</div>"
    ]), note({timing:'3 minutes', answer:'YTM is the internal rate that equates the observed price with the present value of promised coupons and principal', rationale:'It is a market-implied return measure, not a contractual payment rate', misconception:'YTM is guaranteed even if the issuer defaults, the bond is sold early, or coupons are reinvested at different rates', debrief:'Which assumptions make realized return differ from quoted YTM?', transition:'Use RATE to solve the same cash-flow equation in reverse.'})),

    slide('18', 'YTM Excel attempt', 'cream activity-slide excel-choice-slide', html([
      header('Which Excel formula solves YTM from price?', 'Individual → partner · 3 minutes'),
      "<div class='activity-brief compact'><b>WHAT</b><span>Select the formula that solves the periodic return.</span><b>HOW</b><span>Choose alone, compare with a partner, then check.</span><b>PRODUCE</b><span>Formula + annualized yield.</span><b>TIME</b><span>3 minutes</span></div>",
      "<div class='formula-choices' data-choice-group='ytm-formula'><button type='button' data-correct='false'><code>=PV(B10,B9,B8,B3)</code><span>Prices the bond</span></button><button type='button' data-correct='true'><code>=RATE(B9,B8,-B12,B3)*B5</code><span>Solves and annualizes YTM</span></button><button type='button' data-correct='false'><code>=B4/B12</code><span>Current yield only</span></button></div>",
      choiceActions('ytm-formula')
    ]), note({timing:'3 minutes', answer:'RATE(B9,B8,-B12,B3) times B5 returns 6.00 percent nominal annual YTM', rationale:'RATE solves the periodic internal rate; multiplying by payment frequency converts it to the quoted nominal annual convention', misconception:'Coupon divided by price equals YTM or the PV function can solve for an unknown rate without iteration', debrief:'Why is current yield incomplete for a discount bond?', transition:'Reveal the worksheet result and interpret units.'})),

    slide('18,19', 'YTM Excel reveal', 'cream excel-slide', html([
      header('RATE recovers the market-required yield', 'Editable worksheet · result'),
      "<div class='excel-window compact-window' role='img' aria-label='Excel-style worksheet using RATE with twenty periods, a 25-dollar coupon, a negative 925.61-dollar price, and 1,000-dollar principal to return 6 percent annual YTM'>",
      "<div class='excel-title'><span>Formulas</span><strong>Teaching_Bond.xlsx</strong></div><div class='excel-formula'><span>B14</span><b>fx</b><code>=RATE(B9,B8,-B12,B3)*B5</code></div>",
      "<div class='sheet-grid rate-sheet'><b></b><b>A</b><b>B</b><b>Meaning</b>",
      "<span>9</span><strong>Periods</strong><em>20</em><em>Semiannual</em>",
      "<span>8</span><strong>Coupon</strong><em>$25.00</em><em>Investor inflow</em>",
      "<span>12</span><strong>Price today</strong><em class='input-cell'>−$925.61</em><em>Investor outflow</em>",
      "<span>3</span><strong>Principal</strong><em>$1,000</em><em>Maturity inflow</em>",
      "<span>14</span><strong>Annual YTM</strong><em class='result-cell'>6.00%</em><em>Nominal annual</em></div></div>",
      "<div class='value-date'>As of today · Nominal annual YTM with semiannual compounding · Decision implication: the discount lifts expected return above the 5% coupon.</div>"
    ]), note({timing:'3 minutes', answer:'The formula returns 6.00 percent nominal annual YTM with semiannual compounding', rationale:'Opposite signs reflect the investor paying price today and receiving future cash flows; multiplying the periodic rate by two matches bond-market quotation convention', misconception:'The 3 percent periodic rate is the quoted annual YTM or EAR equals the nominal YTM', debrief:'What would the effective annual yield be, and why is it slightly above 6 percent?', transition:'Add a disciplined evidence workflow before applying the model to a company.'})),

    slide('12', 'Evidence workflow', 'dark evidence-slide', html([
      "<div class='eyebrow'>Evidence discipline</div><h2>A bond number is usable only when its definition travels with it.</h2>",
      "<div class='evidence-pipeline' role='img' aria-label='Evidence pipeline records security, field definition, value date, units, currency, supplier, and retrieval date before the value enters Excel'>",
      "<article><span>IDENTIFY</span><strong>Security + issuer</strong><small>CUSIP or exact issue</small></article><i>→</i><article><span>DEFINE</span><strong>Field + convention</strong><small>Coupon, price, YTM, spread</small></article><i>→</i><article><span>DATE</span><strong>Value date + period</strong><small>Settlement and maturity</small></article><i>→</i><article><span>LABEL</span><strong>Units + currency</strong><small>Per $100 or per $1,000</small></article><i>→</i><article><span>RECORD</span><strong>Supplier + retrieval</strong><small>Auditable source trail</small></article></div>",
      "<p>Record the field, definition, period, units, currency, supplier, and retrieval date.</p>"
    ]), note({timing:'3 minutes', answer:'A usable market input includes security identity, field definition, value date, period, units, currency, supplier, and retrieval date', rationale:'Bond fields differ by convention and date; unlabeled values can make a correct formula economically wrong', misconception:'A value copied from a professional platform is self-explanatory and does not need reconciliation', debrief:'What error occurs if one source reports price per 100 of par and the worksheet expects dollars per 1,000?', transition:'Move from valuation mechanics to risk and issuer capacity.'})),

    slide('20', 'Risk section', 'dark section', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Risk and corporate impact</div><h2>Price risk belongs to investors. Debt capacity belongs to the issuer.</h2><p>Rates, credit spread, and use of proceeds shape the decision.</p>"
    ]), note({timing:'1 minute', answer:'Interest-rate and credit changes move investor value, while the issuer must still manage fixed payments and balance-sheet capacity', rationale:'The section separates market-price risk from corporate financing risk before bringing them back together', misconception:'Only investors face bond risk because the coupon is fixed for the issuer', debrief:'Which risk can raise the issuer cost at the next financing event?', transition:'Introduce duration as a timing-based sensitivity measure.'})),

    slide('21', 'Duration intuition', 'cream duration-slide', html([
      header('More value arriving later means more rate sensitivity', 'Duration intuition'),
      "<div class='duration-scale' role='img' aria-label='A short high-coupon bond concentrates value earlier and is less sensitive; a long low-coupon bond concentrates value later and is more sensitive'>",
      "<article class='short-bond'><span>SHORTER · HIGHER COUPON</span><div class='cash-density early'></div><strong>Value arrives earlier</strong><small>Lower duration · smaller price response</small></article>",
      "<div class='sensitivity-axis'><span>LESS</span><i></i><span>MORE</span></div>",
      "<article class='long-bond'><span>LONGER · LOWER COUPON</span><div class='cash-density late'></div><strong>Value arrives later</strong><small>Higher duration · larger price response</small></article></div>"
    ]), note({timing:'4 minutes', answer:'Longer maturity and lower coupon generally increase duration and price sensitivity to yield changes', rationale:'Both features shift a larger share of present value toward distant payments', misconception:'Duration is simply the bond maturity date or a high coupon always means higher risk because more cash is paid', debrief:'Why does receiving cash earlier reduce the damage from a rate increase?', transition:'Test the intuition before revealing the answer.'})),

    slide('21', 'Duration attempt', 'cream activity-slide', html([
      header('Which bond loses more when yields rise 1%?', 'Pair vote · 3 minutes'),
      "<div class='activity-brief compact'><b>WHAT</b><span>Choose the bond with the larger price decline.</span><b>HOW</b><span>Compare timing and coupon with one partner.</span><b>PRODUCE</b><span>Choice + duration rationale.</span><b>TIME</b><span>3 minutes</span></div>",
      "<div class='duration-choices' data-choice-group='duration-choice'><button type='button' data-correct='false'><span>BOND A</span><strong>5 years · 8% coupon</strong><small>More cash arrives early</small></button><button type='button' data-correct='true'><span>BOND B</span><strong>20 years · 3% coupon</strong><small>More value waits for maturity</small></button></div>",
      choiceActions('duration-choice')
    ]), note({timing:'3 minutes', answer:'Bond B, the twenty-year 3 percent coupon bond, loses more when yields rise', rationale:'Its cash-flow-weighted timing is later, creating higher duration and a larger price response', misconception:'Bond A is riskier because its coupon is numerically larger or both bonds react equally to the same yield shock', debrief:'Which design feature of Bond B creates the sensitivity?', transition:'State the reveal as a general risk rule.'})),

    slide('21', 'Duration reveal', 'dark reveal-slide', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Reveal and debrief</div><h2>Long maturity + low coupon is the rate-risk amplifier.</h2>",
      "<div class='risk-amplifier' role='img' aria-label='Long maturity and low coupon combine to push value later and amplify price sensitivity'>",
      "<span>Long maturity</span><i>+</i><span>Low coupon</span><i>→</i><strong>Higher duration</strong><i>→</i><b>Larger price move</b></div>",
      "<p>Decision implication: compare duration—not price alone—when a portfolio or issuer faces rate risk.</p>"
    ]), note({timing:'2 minutes', answer:'Bond B has higher duration and therefore the larger price loss for the same yield increase', rationale:'Its value is concentrated farther in the future, so discount-rate changes compound across more time', misconception:'Duration predicts an exact price change for any yield shock without approximation error or convexity', debrief:'When might convexity make the duration estimate less accurate?', transition:'Separate Treasury-rate risk from issuer-specific credit spread.'})),

    slide('22', 'Credit spread', 'cream spread-slide', html([
      header('Corporate yield stacks a benchmark rate and a credit spread', 'Required return'),
      "<div class='yield-stack' role='img' aria-label='Corporate bond yield equals Treasury benchmark plus credit spread; a wider spread raises required yield and lowers price'>",
      "<article class='treasury'><span>BASE RATE</span><strong>Treasury yield</strong><small>Time value + macro rates</small></article><i>+</i><article class='spread'><span>ISSUER PREMIUM</span><strong>Credit spread</strong><small>Expected loss · uncertainty · liquidity · risk aversion</small></article><i>=</i><article class='corporate'><span>REQUIRED RETURN</span><strong>Corporate YTM</strong><small>Discount rate for the bond</small></article></div>",
      "<div class='spread-consequence'>Spread widens → required YTM rises → existing bond price falls</div>"
    ]), note({timing:'4 minutes', answer:'Corporate YTM equals a benchmark rate plus issuer credit spread; wider spread lowers the price of existing fixed cash flows', rationale:'Credit spreads compensate for expected loss, uncertainty, liquidity, and risk aversion beyond the base rate', misconception:'A stable Treasury yield means corporate bond prices cannot fall', debrief:'What issuer news could widen spread even when the Federal Reserve does nothing?', transition:'Apply the spread mechanism to a downgrade scenario.'})),

    slide('22,24', 'Credit shock', 'cream shock-slide', html([
      header('A downgrade can cut price even when Treasury yields do not move', 'Credit shock'),
      "<div class='shock-flow' role='img' aria-label='Meridian downgrade widens credit spread by 1.5 percentage points, raises required yield, and lowers bond price'>",
      "<article><span>MERIDIAN DOWNGRADE</span><strong>BBB+ → BBB−</strong></article><i>→</i><article><span>CREDIT SPREAD</span><strong>+150 bps</strong></article><i>→</i><article><span>REQUIRED YTM</span><strong>↑</strong></article><i>→</i><article class='price-hit'><span>EXISTING PRICE</span><strong>↓</strong></article></div>",
      "<div class='decision-banner'>Investors bear the immediate mark-to-market loss; Meridian faces a higher cost when refinancing or issuing again.</div>"
    ]), note({timing:'3 minutes', answer:'The wider credit spread raises required yield and lowers the existing bond price even if the Treasury benchmark is unchanged', rationale:'Issuer-specific risk is part of the discount rate and transfers value between current holders and new buyers', misconception:'Only default itself affects price or the existing coupon automatically increases after a downgrade', debrief:'Who bears today’s price loss, and when does Meridian feel the higher borrowing cost?', transition:'Bring the analysis back to Meridian’s live offering assumptions.'})),

    slide('13,18,19,23,24', 'Meridian pricing', 'cream meridian-slide', html([
      header('Meridian’s 5.5% coupon prices just below par at a 5.8% YTM', 'Workbook application'),
      "<div class='meridian-model'><div class='bond-ticket' role='img' aria-label='Meridian ten-year BBB plus bond with 1,000-dollar par, 5.5 percent coupon, and 5.8 percent market yield'><span>MERIDIAN INDUSTRIAL CORP.</span><strong>10-year senior unsecured</strong><div><b>$1,000</b><small>par per bond</small></div><div><b>5.50%</b><small>coupon</small></div><div><b>5.80%</b><small>market YTM</small></div><p>200,000 bonds · semiannual payments</p></div>",
      "<div class='meridian-results'><article><span>PRICE TODAY</span><strong>$977.48</strong><small>$22.52 discount per bond</small></article><article><span>TOTAL PROCEEDS</span><strong>$195.50M</strong><small>vs. $200.00M face amount</small></article><article><span>ANNUAL COUPONS</span><strong>$11.00M</strong><small>5.5% × $200M face</small></article></div></div>",
      "<div class='value-date'>Illustrative offering date · Units shown explicitly · Decision implication: a small yield premium creates a $4.50M proceeds shortfall versus face.</div>"
    ]), note({timing:'4 minutes', answer:'Meridian price is 977.48 dollars per bond, total proceeds are 195.50 million dollars, and annual coupon payments are 11.00 million dollars', rationale:'The 5.8 percent required yield exceeds the 5.5 percent coupon, so the issue sells at a 22.52-dollar discount per bond', misconception:'Issuing 200 million dollars of face value guarantees 200 million dollars of cash proceeds', debrief:'What must the CFO do if the project requires a full 200 million dollars of cash?', transition:'Show why use of proceeds matters as much as the bond terms.'})),

    slide('23', 'Use of proceeds', 'cream proceeds-slide', html([
      header('The same bond can create different corporate outcomes', 'Use of proceeds'),
      "<div class='proceeds-tree' role='img' aria-label='Meridian can use bond proceeds to refinance short-term debt, fund capital expenditure, or mix both uses, producing different liquidity, leverage, and coverage outcomes'>",
      "<div class='proceeds-core'><span>$200M face</span><strong>What does Meridian do with the cash?</strong></div>",
      "<article class='refi'><span>REFINANCE</span><strong>Retire short-term debt</strong><small>Liquidity improves · maturity extends · leverage stays high</small></article>",
      "<article class='capex'><span>CAPEX</span><strong>Buy manufacturing capacity</strong><small>Asset base grows · execution risk rises · coverage tightens</small></article>",
      "<article class='mixed'><span>MIXED</span><strong>Split refinancing + capex</strong><small>Balances liquidity with operating upside</small></article></div>"
    ]), note({timing:'4 minutes', answer:'Refinancing improves liquidity and maturity structure; capex adds operating upside and execution risk; mixed use balances both but does not erase leverage', rationale:'Debt terms alone cannot determine corporate value because asset deployment changes future cash flows and ratios', misconception:'A debt-for-debt swap automatically reduces total leverage or capex immediately generates enough EBITDA to cover interest', debrief:'Which scenario depends most on forecast credibility rather than mechanical balance-sheet change?', transition:'Compare the modeled ratio evidence before choosing.'})),

    slide('23,25', 'Ratio comparison', 'cream ratio-slide', html([
      header('Every $200M scenario breaches at least one leverage guardrail', 'Meridian · pro forma ratios'),
      "<div class='ratio-table' role='img' aria-label='Meridian ratio comparison shows pre-offering and three use-of-proceeds scenarios against leverage and coverage benchmarks'>",
      "<div class='table-head'><strong>Metric</strong><strong>Benchmark</strong><strong>Pre</strong><strong>Refinance</strong><strong>Capex</strong><strong>Mixed</strong></div>",
      "<div><span>Debt / Equity</span><span>&lt; 1.5×</span><b>0.70×</b><b>1.40×</b><b class='bad'>1.61×</b><b>1.40×</b></div>",
      "<div><span>Debt / EBITDA</span><span>&lt; 3.0×</span><b>1.68×</b><b class='bad'>3.37×</b><b class='bad'>3.42×</b><b class='bad'>3.17×</b></div>",
      "<div><span>Interest coverage</span><span>&gt; 3.0×</span><b>7.50×</b><b>4.31×</b><b>3.61×</b><b>4.36×</b></div>",
      "<div><span>Net debt / EBITDA</span><span>&lt; 2.5×</span><b>1.33×</b><b class='bad'>3.02×</b><b class='bad'>3.11×</b><b class='bad'>2.84×</b></div></div>",
      "<div class='ratio-insight'>Mixed is the least strained full-size deployment—but no scenario clears the debt/EBITDA and net-debt guardrails.</div>"
    ]), note({timing:'5 minutes', answer:'Mixed has the best combination among the full-size scenarios, but all three exceed the 3.0-times debt-to-EBITDA benchmark and all exceed 2.5-times net debt to EBITDA', rationale:'A comparative winner can still be unacceptable in absolute risk terms', misconception:'The best column must be approved or improved current ratio proves the firm has stronger total debt capacity', debrief:'Would you recommend the least-bad scenario or resize the financing first?', transition:'Let students make the CFO call before revealing the formative recommendation.'})),

    slide('23,25', 'CFO decision attempt', 'cream activity-slide cfo-slide', html([
      header('What should Meridian’s CFO recommend?', 'Team decision · 5 minutes'),
      "<div class='activity-brief compact'><b>WHAT</b><span>Choose the financing action.</span><b>HOW</b><span>Teams cite price, two ratios, and one risk trigger.</span><b>PRODUCE</b><span>Three-sentence CFO recommendation.</span><b>TIME</b><span>5 minutes</span></div>",
      "<div class='cfo-choices' data-choice-group='cfo-choice'><button type='button' data-correct='false'><span>REFINANCE ALL</span><strong>Proceed as proposed</strong></button><button type='button' data-correct='false'><span>CAPEX ALL</span><strong>Fund growth now</strong></button><button type='button' data-correct='false'><span>MIXED USE</span><strong>Issue full $200M</strong></button><button type='button' data-correct='true'><span>RESIZE + STAGE</span><strong>Use mixed priorities with guardrails</strong></button></div>",
      choiceActions('cfo-choice')
    ]), note({timing:'5 minutes', answer:'Resize or stage the offering, prioritize mixed refinancing and capex, and condition deployment on leverage and operating milestones', rationale:'Full-size scenarios breach debt-to-EBITDA and net-debt-to-EBITDA guardrails even though coverage remains above 3 times', misconception:'The highest interest coverage scenario is automatically optimal or a modest issue-price discount is the primary risk', debrief:'Which single monitoring trigger would give the CFO the earliest warning that the plan is failing?', transition:'Reveal the recommendation as a conditional decision rather than a universal answer.'})),

    slide('23,25', 'CFO decision reveal', 'dark reveal-slide', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Reveal and debrief</div><h2>Resize first. Then stage a mixed-use plan.</h2>",
      "<div class='recommendation-path' role='img' aria-label='Recommended financing path resizes the issue, prioritizes refinancing and high-confidence capital expenditure, and monitors leverage and coverage triggers'>",
      "<article><span>RESIZE</span><strong>Avoid automatic $200M face issuance</strong></article><i>→</i><article><span>STAGE</span><strong>Refinance + fund only high-confidence capex</strong></article><i>→</i><article><span>MONITOR</span><strong>Debt/EBITDA ≤ 3.0× · coverage ≥ 3.0×</strong></article></div>",
      "<p>Formative judgment: mixed use is the best full-size comparison, but “best” is not the same as “acceptable.”</p>"
    ]), note({timing:'3 minutes', answer:'The formative recommendation is to resize and stage a mixed-use financing rather than approve any full-size scenario as proposed', rationale:'The model preserves liquidity benefits and selective capex upside while recognizing that leverage thresholds are breached', misconception:'The ratio benchmarks are absolute laws or the recommendation is a private answer key rather than a defensible formative judgment', debrief:'What new evidence could justify restoring the full 200-million-dollar issue?', transition:'Use discussion to surface alternative recommendations that remain evidence-based.'})),

    slide('25', 'Discussion', 'cream discussion-slide', html([
      header('Defend the decision—not just the calculation', 'Whole-class debrief · 6 minutes'),
      "<div class='discussion-path'><article><span>INVESTOR LENS</span><strong>Why do bond prices fall when required yields rise?</strong><small>Use fixed cash flows and opportunity cost.</small></article><article><span>ISSUER LENS</span><strong>How should Meridian’s use of proceeds change the recommendation?</strong><small>Use leverage, coverage, and execution risk.</small></article></div>",
      "<div class='task-strip light'><b>DO</b><span>Two groups defend different recommendations. Each must cite one price result, two ratios, and one monitoring trigger.</span><b>6 MIN</b></div>"
    ]), note({timing:'6 minutes', answer:'Investor price adjusts because promised cash flows are fixed; issuer recommendation depends on whether proceeds improve future cash capacity enough to justify leverage', rationale:'The two lenses connect market valuation to corporate policy without collapsing them into one metric', misconception:'A correct bond price determines the issuer decision or ratios can be interpreted without considering use of proceeds', debrief:'Which argument from another group would change your recommendation?', transition:'Close with three transferable rules.'})),

    slide('26', 'Takeaways', 'cream takeaway-slide', html([
      header('Three rules make bond analysis decision-ready', 'Close the loop'),
      "<div class='takeaway-loop' role='img' aria-label='Decision-ready bond analysis loops through mapping cash flows, pricing at market yield, and testing issuer capacity'>",
      "<article><span>MAP</span><strong>Date every coupon and principal payment.</strong></article><i>→</i><article><span>PRICE</span><strong>Match Excel rate, periods, signs, and value date.</strong></article><i>→</i><article><span>DECIDE</span><strong>Stress yield, spread, ratios, and use of proceeds.</strong></article><b>↺</b></div>"
    ]), note({timing:'3 minutes', answer:'Map every cash flow, price with aligned Excel inputs, then test market and corporate risk before recommending', rationale:'These rules transfer to bond purchases, new issues, refinancing, and debt-capacity analysis', misconception:'Bond analysis is complete after computing a single price or YTM', debrief:'Which rule would have prevented your most likely error today?', transition:'Use the exit ticket to produce one concise decision statement.'})),

    slide('27,28', 'Exit ticket', 'dark exit-slide', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Exit ticket · 5 minutes</div><h2>Finish one sentence a CFO could use.</h2>",
      "<div class='exit-sentence'>Meridian should <button type='button' data-exit='resize'>resize and stage</button><button type='button' data-exit='proceed'>proceed as proposed</button> because <strong id='exit-evidence'>choose an action, then add price + ratio evidence</strong>.</div>",
      "<div class='exit-requirements'><span>What: one recommendation</span><span>How: individual submission</span><span>Time: 5 minutes</span><span>Deliverable: action + two numbers + risk trigger</span></div>",
      "<div class='up-next'><span>UP NEXT</span><strong>Value equity claims with dividends, growth, and market multiples.</strong></div>"
    ]), note({timing:'5 minutes', answer:'A strong response recommends resizing and staging, cites 977.48 dollars per bond plus at least two ratio results, and names a leverage or coverage trigger', rationale:'The sentence forces amount, units, evidence, risk, and decision into one executive-ready statement', misconception:'The exit ticket needs only a number or a generic statement that debt is risky', debrief:'What is the single strongest piece of evidence in your sentence, and why?', transition:'Invite final questions only after students have written the decision.'}))
  ]
};
