const html = (parts) => parts.join('');

const header = (title, eyebrow) => html([
  "<div class='header-row'><h2>", title, "</h2><span class='eyebrow'>", eyebrow, "</span></div>",
  "<div class='rule'></div>"
]);

const slide = (sourceSlides, label, classes, body, note) => ({
  slides: sourceSlides,
  label,
  classes,
  body,
  note
});

export const npvM08L01Deck = {
  title: 'Net Present Value and Capital Budgeting',
  slides: [
    slide('9', 'Title', 'dark title-slide photo-led', html([
      "<img class='photo-fill' src='assets/generated/harborside-capital-budgeting-hero.png' alt='Hospital leaders reviewing a capital investment beside a medical imaging suite'>",
      "<div class='photo-scrim'></div><div class='gradient-bar'></div>",
      "<div class='title-copy'><div class='eyebrow'>BUS311 · Valuation · M08</div>",
      "<h1>Capital budgeting turns strategy into a cash-flow decision.</h1>",
      "<p>Net present value, competing metrics, and the judgment behind the model</p></div>"
    ]), "Open with the hospital image. A large investment is never just a spreadsheet line: it commits capital, operating capacity, and managerial credibility. By the end, students should be able to build the cash flows, calculate value, and defend the recommendation."),

    slide('11,13', 'Opening decision', 'cream decision-opening', html([
      header('Would you commit $3.6 million today?', 'Opening vote'),
      "<div class='decision-fork' role='img' aria-label='Harborside can invest now in an imaging suite, wait for more evidence, or reject the project'>",
      "<article class='fund'><b>FUND</b><strong>Capture demand now</strong><span>Capacity, revenue, clinical access</span></article>",
      "<div class='decision-core'><span>Harborside Medical Center</span><strong>New imaging suite</strong><small>$3.6M today</small></div>",
      "<article class='wait'><b>WAIT</b><strong>Buy information</strong><span>Demand, reimbursement, utilization</span></article>",
      "</div><p class='instruction'>Vote first. Then name the single assumption that would change your answer.</p>"
    ]), "Take a quick show-of-hands vote: fund, wait, or reject. Do not resolve it yet. Ask students which assumption they are implicitly making. This creates the need for a disciplined cash-flow model."),

    slide('10-26', 'Agenda', 'cream agenda-slide', html([
      header('Three questions organize the decision', 'Today'),
      "<div class='three-path' role='img' aria-label='The lesson moves from cash flows to decision metrics to judgment'>",
      "<article><b>01</b><strong>What cash flows change?</strong><span>Build the project, not the accounting story.</span></article><i>→</i>",
      "<article><b>02</b><strong>What does the project earn?</strong><span>Let NPV lead; use IRR, PI, and payback carefully.</span></article><i>→</i>",
      "<article><b>03</b><strong>What could break the case?</strong><span>Stress-test timing, scale, and fragile assumptions.</span></article>",
      "</div>"
    ]), "Preview the learning arc. We will first define relevant cash flows, then compare metrics, then add managerial judgment. The sequence mirrors how an investment committee should work."),

    slide('10', 'Learning objectives', 'cream objectives-slide', html([
      header('You will leave able to defend a capital decision', 'Learning outcomes'),
      "<div class='objective-orbit' role='img' aria-label='Four skills surround the final capital recommendation'>",
      "<div class='orbit-core'>Defend the recommendation</div>",
      "<article class='o1'><b>01</b><strong>Build</strong><span>Incremental after-tax cash flows</span></article>",
      "<article class='o2'><b>02</b><strong>Value</strong><span>NPV and Excel syntax</span></article>",
      "<article class='o3'><b>03</b><strong>Compare</strong><span>IRR, PI, and payback</span></article>",
      "<article class='o4'><b>04</b><strong>Stress-test</strong><span>Rate, timing, and assumptions</span></article>",
      "</div>"
    ]), "Connect the four skills. The point is not memorizing four metrics; it is producing one recommendation that survives questions."),

    slide('11,12', 'Valuation bridge', 'cream bridge-slide', html([
      header('The asset changes; the valuation logic does not', 'Bridge from M06–M07'),
      "<div class='valuation-bridge' role='img' aria-label='Bond and stock valuation logic flows into project valuation'>",
      "<article><span>Bond</span><strong>Contractual cash flows</strong><small>Discount at required yield</small></article><i>→</i>",
      "<article><span>Stock</span><strong>Expected owner cash flows</strong><small>Discount at required return</small></article><i>→</i>",
      "<article class='accent'><span>Project</span><strong>Incremental operating cash flows</strong><small>Discount at project risk</small></article>",
      "</div><p class='bridge-line'>Value today = present value of future cash flows − investment today</p>"
    ]), "Remind students that bonds and stocks already taught the central logic. Capital budgeting applies it inside the firm, where the difficult part is often defining the cash flows rather than doing the discounting."),

    slide('11-15', 'Section one', 'dark section', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Part 1 of 3</div>",
      "<h2>Build the cash flows before you calculate the answer.</h2>",
      "<p>Relevant means incremental, after-tax, and caused by the project.</p>"
    ]), "Transition to Part 1. Slow down here: the quality of NPV depends on the quality of the cash-flow forecast."),

    slide('11,13,18,24', 'Corporate contexts', 'cream context-slide', html([
      header('Capital budgeting sits behind the biggest corporate commitments', 'Real-company context'),
      "<div class='context-triptych'>",
      "<article class='disney'><span>Disney Experiences</span><strong>≈ $60B over 10 years</strong><p>Capacity, attendance, pricing, and timing</p></article>",
      "<article class='microsoft'><span>Microsoft AI infrastructure</span><strong>≈ $80B in FY2025</strong><p>Utilization, energy, chips, and obsolescence</p></article>",
      "<article class='walmart'><span>Walmart automation</span><strong>Network-scale investment</strong><p>Throughput, labor, reliability, and rollout pace</p></article>",
      "</div><p class='source-strip'>Company announcements provide the context; classroom cash flows remain illustrative.</p>"
    ]), "These examples make capital budgeting tangible. Disney discussed roughly sixty billion dollars of Experiences investment over about ten years. Microsoft described approximately eighty billion dollars of AI-enabled data-center investment in fiscal 2025. Walmart has documented a multi-year supply-chain automation program. We are not claiming their internal NPV assumptions; we are identifying the drivers an analyst would need."),

    slide('13-15', 'Harborside case', 'cream harborside-slide', html([
      header('Harborside starts with an operating story, not a formula', 'Core case'),
      "<div class='case-canvas'>",
      "<div class='case-visual'><svg viewBox='0 0 720 480' role='img' aria-label='Hospital imaging capacity expands from a constrained scanner to a larger service line'><rect x='30' y='70' width='240' height='330' rx='24'/><circle cx='150' cy='190' r='72'/><circle cx='150' cy='190' r='34'/><path d='M270 235 H430'/><path d='M400 205 L430 235 L400 265'/><rect class='new' x='430' y='35' width='250' height='400' rx='24'/><circle class='new-ring' cx='555' cy='180' r='88'/><circle class='new-ring' cx='555' cy='180' r='42'/><path class='pulse' d='M485 340 h42 l18-34 24 72 24-50 18 12 h52'/></svg></div>",
      "<div class='case-drivers'><article><span>Investment today</span><strong>$3.60M</strong><small>Equipment, installation, training</small></article><article><span>Operating value</span><strong>5 years</strong><small>Imaging margin and capacity savings</small></article><article><span>End-of-life value</span><strong>$0.35M</strong><small>Resale value in Year 5</small></article></div>",
      "</div>"
    ]), "Introduce the illustrative Harborside case. The total upfront investment is 3.6 million dollars. The project produces five years of after-tax operating cash flow and a 350-thousand-dollar salvage value in Year 5."),

    slide('15', 'Cash flow detective', 'cream activity-slide cashflow-activity', html([
      header('Which cash flows belong in the model?', 'Interactive · 4 minutes'),
      "<div class='cashflow-grid' data-interactive='cashflow'>",
      "<button type='button' data-correct='false'>Feasibility study paid last year</button>",
      "<button type='button' data-correct='true'>Equipment + installation today</button>",
      "<button type='button' data-correct='true'>Incremental imaging contribution</button>",
      "<button type='button' data-correct='false'>Interest on the project loan</button>",
      "<button type='button' data-correct='true'>Lost contribution from displaced space</button>",
      "<button type='button' data-correct='true'>Year 5 resale value</button>",
      "</div><div class='activity-actions'><button class='check-button' type='button' data-action='check-cashflows'>Check choices</button><output id='cashflow-feedback'>Select every incremental cash flow.</output></div>"
    ]), "Students work with a partner and select the relevant cash flows. The feasibility study is sunk. Financing costs are captured in the discount rate, so do not subtract interest again. Include the investment, operating contribution, opportunity cost, and resale value."),

    slide('11-15', 'Incremental cash flows', 'cream cashflow-map-slide', html([
      header('Relevant cash flow asks one counterfactual question', 'With project vs. without project'),
      "<div class='counterfactual' role='img' aria-label='Incremental cash flow is the difference between the firm with the project and without the project'>",
      "<article><span>WITH PROJECT</span><strong>Imaging revenue</strong><strong>Operating costs</strong><strong>Working capital</strong><strong>Salvage value</strong></article>",
      "<div class='minus'>−</div>",
      "<article><span>WITHOUT PROJECT</span><strong>Current capacity</strong><strong>Displaced services</strong><strong>Avoided capital</strong><strong>Existing cash flows</strong></article>",
      "<div class='equals'>=</div><div class='incremental'><span>MODEL</span><strong>Incremental after-tax cash flow</strong></div>",
      "</div><p class='instruction'>Exclude sunk costs. Include opportunity costs and side effects.</p>"
    ]), "Use the counterfactual language: with the project minus without the project. This prevents students from treating every accounting line as a project cash flow."),

    slide('12', 'NPV equation', 'dark formula-slide', html([
      "<div class='eyebrow'>Net present value</div><h2>NPV converts every project cash flow into value today.</h2>",
      "<div class='formula-display'><code>NPV = −C₀ + C₁/(1+r)¹ + C₂/(1+r)² + … + Cₙ/(1+r)ⁿ</code></div>",
      "<div class='formula-keys'><span><b>C₀</b> investment now</span><span><b>Cₜ</b> incremental cash flow</span><span><b>r</b> opportunity cost of capital</span><span><b>n</b> project horizon</span></div>"
    ]), "Read the equation as a story: pay the investment now, bring each future incremental cash flow back at a risk-appropriate required return, then add everything."),

    slide('14,15', 'Cash flow timeline', 'cream timeline-slide', html([
      header('Every material cash flow gets its own place in time', 'Harborside · $ millions'),
      "<div class='cash-timeline' role='img' aria-label='Harborside cash flow timeline from Year 0 through Year 5'>",
      "<div class='time-line'></div>",
      "<article class='outflow'><time>Year 0</time><i></i><strong>−$3.60</strong><span>Equipment + launch</span></article>",
      "<article><time>Year 1</time><i></i><strong>$0.95</strong><span>Operating CF</span></article>",
      "<article><time>Year 2</time><i></i><strong>$1.05</strong><span>Operating CF</span></article>",
      "<article><time>Year 3</time><i></i><strong>$1.15</strong><span>Operating CF</span></article>",
      "<article><time>Year 4</time><i></i><strong>$1.20</strong><span>Operating CF</span></article>",
      "<article class='terminal'><time>Year 5</time><i></i><strong>$1.60</strong><span>$1.25 CF + $0.35 salvage</span></article>",
      "</div>"
    ]), "Walk left to right and explicitly show all six positions. The Year 5 amount includes operating cash flow plus salvage. Keeping each period visible prevents the common mistake of burying terminal value or misplacing the initial outlay."),

    slide('12,14,15', 'Excel and manual math', 'cream calculation-slide', html([
      header('Excel syntax comes first; manual math explains it', 'Worked example'),
      "<div class='excel-math'>",
      "<article class='excel-panel'><span>EXCEL</span><code>=NPV(B3,C6:G6)+B6</code><small>Future cash flows only go inside NPV. Add Year 0 separately.</small></article>",
      "<article class='manual-panel'><span>MANUAL</span><code>−3.60 + 0.95/1.09 + 1.05/1.09² + 1.15/1.09³ + 1.20/1.09⁴ + 1.60/1.09⁵</code></article>",
      "</div><div class='syntax-warning'><strong>Common error</strong><span>Putting the initial investment inside Excel's NPV function discounts Year 0 when it should not.</span></div>"
    ]), "Demonstrate the Excel pattern before the manual equation, then connect them. Excel's NPV function assumes the first value occurs one period from today; Year 0 must be added separately."),

    slide('12,14,15', 'NPV result', 'cream result-slide', html([
      header('At 9%, Harborside creates about $0.93 million today', 'Decision'),
      "<div class='value-waterfall' role='img' aria-label='Present value of future cash flows minus the initial investment equals positive net present value'>",
      "<article><span>PV of future cash flows</span><strong>$4.53M</strong></article><i>−</i>",
      "<article><span>Investment today</span><strong>$3.60M</strong></article><i>=</i>",
      "<article class='result'><span>NPV</span><strong>+$0.93M</strong><small>Fund under the base case</small></article>",
      "</div><p class='instruction'>Positive NPV is necessary. Defensible assumptions are the second test.</p>"
    ]), "The base-case present value of future cash flows is about 4.53 million dollars. Subtracting the 3.6 million dollar investment produces NPV of roughly 0.93 million. State the decision, then immediately ask whether the assumptions are credible."),

    slide('12,14,15,23', 'Rate shock lab', 'cream activity-slide rate-lab-slide', html([
      header('How much discount-rate risk can the project absorb?', 'Interactive NPV lab'),
      "<div class='rate-lab' data-interactive='rate'>",
      "<div class='rate-control'><label for='rate-slider'>Required return <output id='rate-value'>9%</output></label><input id='rate-slider' type='range' min='5' max='22' step='1' value='9'><div class='rate-scale'><span>5%</span><span>22%</span></div></div>",
      "<div class='npv-gauge'><div class='gauge-zero'></div><div id='npv-bar' class='npv-bar'></div><strong id='npv-value'>+$0.93M</strong><span id='npv-decision'>Positive NPV · fund</span></div>",
      "</div><p class='instruction'>Move the hurdle rate. Find the rate where the investment decision flips.</p>"
    ]), "Have students move the slider and find the approximate break-even rate. The project crosses zero around 17.7 percent, which previews IRR. Emphasize that the discount rate is not a knob to force approval; it should reflect opportunity cost and project risk."),

    slide('16-23', 'Section two', 'dark section', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Part 2 of 3</div>",
      "<h2>Supporting metrics can clarify the decision—or distort it.</h2>",
      "<p>Understand what each metric measures before trusting its ranking.</p>"
    ]), "Transition to the metrics. NPV remains the value criterion. IRR, payback, and PI answer different questions and can become dangerous when treated as substitutes."),

    slide('16,17,18', 'IRR definition', 'cream irr-slide', html([
      header("IRR is the project's break-even discount rate", 'Internal rate of return'),
      "<div class='irr-bridge' role='img' aria-label='IRR is the rate that reduces project net present value to zero'>",
      "<article><span>PROJECT CASH FLOWS</span><strong>Harborside case</strong><small>−3.60, 0.95, 1.05, 1.15, 1.20, 1.60</small></article><i>→</i>",
      "<div class='irr-core'><span>SOLVE FOR r</span><strong>NPV = 0</strong></div><i>→</i>",
      "<article class='result'><span>IRR</span><strong>≈ 17.7%</strong><small>Compare with the required return</small></article>",
      "</div><div class='dark-panel'><code>=IRR(B6:G6)</code><span>Accept when IRR exceeds the hurdle rate for a conventional, independent project.</span></div>"
    ]), "IRR is the rate at which the NPV profile crosses zero. Harborside's illustrative IRR is about 17.7 percent. This is useful, but it is not a dollar measure of value created."),

    slide('23', 'NPV profile', 'cream profile-slide', html([
      header('The NPV profile shows why IRR is a crossover—not a value total', 'NPV vs. required return'),
      "<div class='profile-layout'><svg class='npv-profile' viewBox='0 0 1120 600' role='img' aria-label='Harborside NPV declines as the required return rises and crosses zero near 17.7 percent'><line class='axis' x1='100' y1='500' x2='1060' y2='500'/><line class='axis' x1='100' y1='70' x2='100' y2='500'/><line class='zero' x1='100' y1='390' x2='1060' y2='390'/><path class='curve' d='M140 130 C330 185 500 250 650 315 C780 365 900 415 1020 468'/><circle class='dot' cx='795' cy='390' r='12'/><text x='815' y='375'>IRR ≈ 17.7%</text><text x='130' y='105'>NPV +</text><text x='920' y='465'>NPV −</text><text x='850' y='555'>Required return →</text></svg>",
      "<div class='profile-takeaway'><span>WHAT CHANGES?</span><strong>A higher required return reduces today's value of future cash flows.</strong><small>The cash flows do not change; the valuation hurdle does.</small></div></div>"
    ]), "Trace the curve. At low discount rates, distant cash flows retain more present value. As the rate rises, NPV falls. The zero crossing is the IRR."),

    slide('16,18,23', 'Scale conflict', 'cream scale-conflict-slide', html([
      header('A higher IRR can create less shareholder value', 'Mutually exclusive projects'),
      "<div class='project-race'>",
      "<article><span>FAST UPGRADE</span><strong>IRR 50%</strong><b>NPV +$0.36M</b><small>Invest $1.0M → receive $1.5M in Year 1</small></article>",
      "<div class='versus'>VS</div>",
      "<article class='winner'><span>FULL PLATFORM</span><strong>IRR 40%</strong><b>NPV +$1.36M</b><small>Invest $5.0M → receive $7.0M in Year 1</small></article>",
      "</div><p class='decision-banner'>At a 10% hurdle rate, choose the lower-IRR project because it creates $1.00M more value.</p>"
    ]), "This is the scale problem. The smaller project has the more impressive percentage return, but the larger project creates more total value. For mutually exclusive choices, NPV wins."),

    slide('21,22', 'Payback trap', 'cream payback-slide', html([
      header('Payback stops counting when the most important cash flows may begin', 'Liquidity screen'),
      "<div class='payback-race' role='img' aria-label='Two projects recover the initial investment in three years, but only Project B has large later cash flows'>",
      "<div class='payback-axis'></div>",
      "<article class='row a'><span>Project A</span><b>−3</b><b>+1</b><b>+1</b><b>+1</b><b>0</b><b>0</b></article>",
      "<article class='row b'><span>Project B</span><b>−3</b><b>+1</b><b>+1</b><b>+1</b><b>+2</b><b>+5</b></article>",
      "<div class='year-labels'><span></span><span>Y0</span><span>Y1</span><span>Y2</span><span>Y3</span><span>Y4</span><span>Y5</span></div>",
      "<div class='cutoff'>3-year cutoff</div></div>",
      "<p class='decision-banner'>Same payback. Very different value. Payback ignores timing and cash flows after the cutoff.</p>"
    ]), "Both projects recover the 3-million investment after three years. Payback therefore calls them equivalent. But Project B produces substantial Year 4 and Year 5 cash flows. Use payback only as a rough liquidity or exposure screen."),

    slide('19,20', 'Profitability index', 'cream pi-slide', html([
      header('Profitability index measures value capacity per invested dollar', 'Capital rationing'),
      "<div class='pi-equation'><span>PV of future cash flows</span><i>÷</i><span>|Initial investment|</span><i>=</i><strong>Profitability index</strong></div>",
      "<div class='pi-meaning'><article><b>PI &gt; 1.00</b><span>Positive NPV</span></article><article><b>PI = 1.00</b><span>Break-even value</span></article><article><b>PI &lt; 1.00</b><span>Negative NPV</span></article></div>",
      "<p class='instruction'>Use PI when capital is constrained—but test combinations of indivisible projects.</p>"
    ]), "PI is useful when capital is rationed because it ranks present value created per dollar invested. But for indivisible projects, selecting strictly from the top of the PI ranking can miss the best feasible portfolio."),

    slide('20', 'Capital allocation challenge', 'cream activity-slide allocator-slide', html([
      header('Build the highest-NPV portfolio under a $6.0M cap', 'Interactive · 5 minutes'),
      "<div class='allocator' data-interactive='allocator'>",
      "<button type='button' data-cost='2' data-npv='.55'><span>Solar canopy</span><strong>$2.0M</strong><small>NPV $0.55M · PI 1.275</small></button>",
      "<button type='button' data-cost='3' data-npv='.96'><span>Sterile-processing automation</span><strong>$3.0M</strong><small>NPV $0.96M · PI 1.320</small></button>",
      "<button type='button' data-cost='4' data-npv='1.12'><span>Imaging suite expansion</span><strong>$4.0M</strong><small>NPV $1.12M · PI 1.280</small></button>",
      "</div><div class='allocator-total'><span>Selected investment <b id='allocator-cost'>$0.00M</b></span><span>Total NPV <b id='allocator-npv'>$0.00M</b></span><output id='allocator-feedback'>Choose a feasible portfolio.</output></div>"
    ]), "Students select projects under the 6-million-dollar constraint. The highest-NPV feasible combination is the solar canopy plus imaging suite: 6 million invested and 1.67 million NPV. This beats selecting the highest-PI project first and then the only small project that fits, which produces 1.51 million NPV."),

    slide('22', 'Decision stack', 'cream comparison-slide', html([
      header('Use each metric for the question it actually answers', 'Decision stack'),
      "<div class='metric-stack'>",
      "<article class='primary'><span>PRIMARY</span><strong>NPV</strong><p>How many dollars of value does the project create?</p></article>",
      "<article><span>CHECK</span><strong>IRR</strong><p>What return threshold makes NPV zero?</p></article>",
      "<article><span>CONSTRAINT</span><strong>PI</strong><p>How much PV arrives per invested dollar?</p></article>",
      "<article><span>EXPOSURE</span><strong>Payback</strong><p>How quickly is capital recovered?</p></article>",
      "</div>"
    ]), "Do not ask students to memorize a table. Use the stack: NPV is the decision criterion, while IRR, PI, and payback answer narrower supporting questions."),

    slide('24-26', 'Section three', 'dark section', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Part 3 of 3</div>",
      "<h2>The spreadsheet gives an answer; judgment decides whether to trust it.</h2>",
      "<p>Timing, replacement, uncertainty, and strategic constraints change the recommendation.</p>"
    ]), "Transition from calculation to judgment. A positive base-case NPV is the start of the investment committee conversation, not the end."),

    slide('24', 'Complex decisions', 'cream complex-slide', html([
      header('Some projects require a different comparison frame', 'Advanced applications'),
      "<div class='complex-path'>",
      "<article><b>01</b><strong>Timing</strong><span>Build now or wait?</span><small>Choose the date with the highest NPV today.</small></article><i>→</i>",
      "<article><b>02</b><strong>Unequal lives</strong><span>Five-year vs. ten-year asset?</span><small>Convert cost into equivalent annual cost.</small></article><i>→</i>",
      "<article><b>03</b><strong>Replacement</strong><span>Keep or replace?</span><small>Compare the old asset's avoidable costs with the new asset's EAC.</small></article>",
      "</div>"
    ]), "Explain the three extensions. Investment timing can have option value. Equivalent annual cost puts unequal-life assets on a common annual basis. Replacement analysis focuses on future avoidable cash flows, not book value."),

    slide('13,18,24', 'Automation red team', 'cream automation-slide photo-led', html([
      "<img class='automation-photo' src='assets/generated/automated-distribution-center.png' alt='Automated distribution center with storage systems, conveyors, forklifts, and workers'>",
      "<div class='automation-panel'><div class='eyebrow'>Corporate red team · Walmart context</div><h2>Automation looks compelling—until one assumption breaks.</h2>",
      "<div class='risk-list'><button type='button' data-risk='utilization'>Utilization ramp</button><button type='button' data-risk='labor'>Labor savings</button><button type='button' data-risk='downtime'>Downtime + maintenance</button><button type='button' data-risk='rollout'>Rollout timing</button></div>",
      "<p id='risk-prompt'>Choose the assumption you would challenge first.</p></div>"
    ]), "Walmart has publicly described automated distribution centers and network modernization. Use this as a context, not as a claim about Walmart's internal NPV. Ask teams to pick the first assumption they would diligence. The key point is that utilization and rollout timing can delay benefits while the investment occurs upfront."),

    slide('26', 'Excel activity', 'dark excel-launch-slide', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>In-class Excel activity · VeridianEnergy</div>",
      "<h2>Allocate $18 million across three renewable-energy projects.</h2>",
      "<div class='excel-launch'><article><b>01</b><strong>Calculate</strong><span>NPV with final-year salvage</span></article><article><b>02</b><strong>Compare</strong><span>IRR and profitability index</span></article><article><b>03</b><strong>Recommend</strong><span>Fund the best feasible portfolio</span></article></div>",
      "<p class='deliverable'>Work in pairs. Your recommendation must name the selected project(s), total NPV, and one risk that could reverse the decision.</p>"
    ]), "Launch the existing VeridianEnergy workbook. Remind students that the Excel NPV function receives Year 1 through Year N cash flows and that Year 0 is added separately. Do not reveal the workbook answers on the slide."),

    slide('25', 'Key takeaways', 'cream takeaway-slide', html([
      header('A defensible capital decision has three layers', 'Key takeaways'),
      "<div class='takeaway-layers'><article><b>01</b><strong>Cash-flow integrity</strong><span>Model incremental after-tax cash flows.</span></article><article><b>02</b><strong>Value discipline</strong><span>Let NPV lead when metrics conflict.</span></article><article><b>03</b><strong>Judgment under uncertainty</strong><span>Stress-test the assumptions that drive the answer.</span></article></div>"
    ]), "Synthesize the lesson into three layers. If students remember only one line, use: build the right cash flows, let NPV lead, and attack the fragile assumptions."),

    slide('25,26', 'Exit ticket', 'dark close exit-slide', html([
      "<div class='gradient-bar'></div><div class='eyebrow'>Exit ticket</div>",
      "<h2>Would you fund Harborside now?</h2>",
      "<div class='exit-options' data-interactive='exit'><button type='button' data-exit='fund'>Fund</button><button type='button' data-exit='wait'>Wait</button><button type='button' data-exit='reject'>Reject</button></div>",
      "<p id='exit-feedback'>Defend your choice with one number and one assumption.</p><small>Press N for notes · F for fullscreen</small>"
    ]), "Close by returning to the opening decision. A strong answer cites the 0.93-million-dollar base-case NPV and names a consequential assumption such as utilization, reimbursement, operating cost, or timing. Accept fund, wait, or reject if the reasoning is coherent.")
  ]
};
