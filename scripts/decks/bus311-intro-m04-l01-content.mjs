const slide = (sources, label, classes, body, note) => ({ sources, label, classes, body, note });

const figmaSource = 'https://investor.figma.com/news-events/news/news-details/2026/Figma-Announces-Fourth-Quarter-and-Fiscal-Year-2025-Financial-Results/default.aspx';
const coreweaveSource = 'https://investors.coreweave.com/news/news-details/2026/CoreWeave-Reports-Strong-Fourth-Quarter-and-Fiscal-Year-2025-Results/default.aspx';
const redditSource = 'https://investor.redditinc.com/news-events/news-releases/news-details/2026/Reddit-Reports-Fourth-Quarter-and-Full-Year-2025-Results-Announces-1-Billion-Share-Repurchase-Program/default.aspx';

export const ratioM04Deck = {
  id: 'intro-m04-l01',
  title: 'Ratio Analysis and Corporate Performance',
  slides: [
    slide('1', 'Ratio analysis and corporate performance', 'dark title-slide image-slide', `
      <img class="hero-image" src="../../assets/lesson-media/heroes/foundations.webp" alt="Corporate finance team reviewing financial statements and market charts in a modern boardroom">
      <div class="hero-overlay"></div><div class="signal-bar"></div>
      <div class="title-copy"><div class="eyebrow">BUS311 · Intro M04</div><h1>Ratio Analysis and Corporate Performance</h1><p>Turn financial statements into a driver-based recommendation.</p><div class="title-meta"><span>Professor Bethany Evitts</span><span>Fall 2026</span></div></div>`,
      'Open with the question: if two firms report strong growth, do they deserve the same performance judgment? Frame ratios as diagnostic questions about liquidity, operating efficiency, profitability, and financing—not as a scoreboard. Tell students the class ends with a short executive recommendation. Time: 1 minute.'),

    slide('2', 'The lesson route', 'cream route-slide', `
      <div class="header-row"><h2>Follow one business from statements to a decision</h2><div class="eyebrow">Lesson route</div></div><div class="rule"></div>
      <div class="route" role="img" aria-label="Calculate one business dashboard, explain its return, compare company economics, and defend a decision">
        <article><span>Class example</span><strong>Calculate</strong><small>Build a consistent ratio dashboard.</small></article><i>→</i>
        <article><span>DuPont lab</span><strong>Explain</strong><small>Separate operating and financing drivers.</small></article><i>→</i>
        <article><span>Company cases</span><strong>Compare</strong><small>Test why business models matter.</small></article><i>→</i>
        <article><span>CFO brief</span><strong>Defend</strong><small>Choose a next step with evidence.</small></article>
      </div>`,
      'Preview the sequence once: first build a dashboard for one classroom business, then explain its ROE, compare real-company economics, and defend a decision. Students will keep returning to the same classroom inputs. Move promptly to what a strong answer looks like. Time: 1 minute.'),

    slide('3', 'Learning goals', 'cream goals-slide', `
      <div class="header-row"><h2>A strong answer makes the number useful</h2></div><div class="rule"></div>
      <div class="goal-flow" role="img" aria-label="Success means an auditable formula, a defensible driver explanation, and a conditional recommendation">
        <article><span>Formula integrity</span><strong>Show the inputs</strong><small>Match the period, units, and denominator.</small><p class="goal-example"><b>Example · annual net margin</b>$12,000 net income ÷ $120,000 revenue = <em>10%</em></p></article><b>→</b>
        <article><span>Driver logic</span><strong>Explain the cause</strong><small>Distinguish margin, asset use, and financing.</small><p class="goal-example"><b>Investigate the driver</b>Did pricing improve, costs fall, or a one-time gain lift profit?</p></article><b>→</b>
        <article><span>Decision quality</span><strong>Name the limit</strong><small>State what evidence could change your judgment.</small><p class="goal-example"><b>Make a conditional decision</b>Consider expansion only if the margin is repeatable and cash flow can fund it.</p></article>
      </div>`,
      'Use these as success criteria rather than another agenda. A strong response lets another analyst reproduce the number, explains a plausible driver, and identifies evidence that could change the conclusion. Walk through the illustrative annual example: $12,000 of net income divided by $120,000 of revenue gives a 10% net margin. Those totals establish the ratio but cannot identify its cause. Pricing, cost changes, and one-time gains are hypotheses to investigate, not conclusions from the ratio alone. A conditional expansion recommendation needs evidence of recurring earnings and available cash. Preview the reasoning without teaching a second calculation. Time: 1 minute.'),

    slide('4', 'Ratios turn statements into questions', 'cream question-slide', `
      <div class="header-row"><h2>Every ratio should answer a business question</h2><div class="eyebrow">Statements → signal → decision</div></div><div class="rule"></div>
      <div class="question-machine" role="img" aria-label="Income statement and balance sheet feed a ratio, which feeds a driver question and then a management decision">
        <article class="statement-node"><span>Financial statements</span><strong>What happened?</strong><small>Revenue · profit · assets · debt · cash</small></article><i>→</i>
        <article class="ratio-node"><span>Ratio</span><strong>What relationship matters?</strong><small>Margin · turnover · coverage · return</small></article><i>→</i>
        <article class="decision-node"><span>Driver</span><strong>Why did it change?</strong><small>Operations · efficiency · financing · accounting</small></article>
      </div><div class="decision-banner">A ratio is a compressed question—not a verdict.</div>`,
      'Use one example aloud: ROE relates earnings to shareholder capital, but the decision question is whether the return came from better operations, more efficient asset use, or more leverage. Likely misconception: a higher ratio is automatically better. Ask for one ratio where “higher” can signal risk. Time: 3 minutes.'),

    slide('5,6,7,8', 'Four diagnostic families', 'dark family-slide', `
      <div class="header-row"><h2>Four lenses describe one operating system</h2><div class="eyebrow">Diagnostic map</div></div><div class="rule dark-rule"></div>
      <div class="family-map" role="img" aria-label="Four connected ratio families surround corporate performance: liquidity, efficiency, profitability, and leverage">
        <article class="liquidity"><span>Liquidity</span><strong>Can we meet near-term claims?</strong><code>Current assets ÷ current liabilities</code></article>
        <article class="efficiency"><span>Efficiency</span><strong>How hard do assets work?</strong><code>Revenue ÷ average assets</code></article>
        <div class="family-core"><span>Corporate performance</span><strong>Driver-based judgment</strong></div>
        <article class="profitability"><span>Profitability</span><strong>What remains after costs?</strong><code>Income ÷ revenue or capital</code></article>
        <article class="leverage"><span>Leverage</span><strong>Who financed the asset base?</strong><code>Debt ÷ assets</code></article>
      </div>`,
      'Walk clockwise through the four families. Liquidity and leverage emphasize the balance sheet; profitability emphasizes flows; efficiency connects flows with average stocks. Emphasize that the families interact: leverage can raise ROE while increasing fixed claims, and excess liquidity can reduce asset turnover. Time: 4 minutes.'),

    slide('12', 'Definition discipline', 'dark evidence-slide', `
      <div class="header-row"><h2>Reliable ratios start with consistent inputs</h2><div class="eyebrow">Evidence audit</div></div><div class="rule dark-rule"></div>
      <div class="audit-console" role="img" aria-label="A ratio evidence audit checks definition, period, units, source, and denominator before comparison">
        <div class="audit-center"><span>ROE</span><strong>Can this calculation be trusted?</strong></div>
        <article><span>Definition</span><strong>GAAP or adjusted?</strong></article><article><span>Period</span><strong>Quarter, TTM, or fiscal year?</strong></article>
        <article><span>Units</span><strong>Dollars, thousands, or millions?</strong></article><article><span>Source</span><strong>Filed value and retrieval date?</strong></article>
        <article><span>Denominator</span><strong>Average or ending balance?</strong></article>
      </div>`,
      'Apply these five checks to the classroom calculation before building the dashboard. Save business-model and peer selection for the company cases. The most common errors are mixing a quarterly numerator with an annual denominator, using end-of-period equity instead of average equity, and comparing a non-GAAP margin with a GAAP margin. FactSet accelerates retrieval but does not remove the definition audit. Time: 3 minutes.'),

    slide('13,17', 'Build ROE in Excel', 'cream excel-slide', `
      <div class="header-row"><h2>Excel should make the denominator visible</h2><div class="eyebrow">Function-first model</div></div><div class="rule"></div>
      <div class="excel-sheet" role="img" aria-label="Editable Excel-style worksheet showing return on equity calculated with average beginning and ending equity">
        <div class="excel-ribbon"><span>M04 STARTER · CLASS PRACTICE</span><b>Home</b><b>Formulas</b><strong>Return on Equity</strong></div>
        <div class="formula-row"><span>E9</span><b>ƒx</b><code>=B7/AVERAGE(B13:B14)</code></div>
        <div class="excel-grid"><span></span><b>A</b><b>B</b><b>Meaning</b><strong>7</strong><label>Net income</label><data class="input">$12,000</data><small>period flow</small><strong>13</strong><label>Beginning equity</label><data class="input">$28,000</data><small>opening stock</small><strong>14</strong><label>Ending equity</label><data class="input">$32,000</data><small>closing stock</small><strong></strong><label>Average equity</label><data>$30,000</data><small>AVERAGE(B13:B14)</small><strong>E9</strong><label>Your ROE formula</label><data class="result">40.0%</data><small>Class Practice tab</small></div>
      </div>`,
      'Open the starter workbook on Class Practice. The projected formula uses the actual workbook cells: net income B7, equity B13:B14, and student answer E9. Introduce the Excel formula before manual arithmetic. Net income is a flow across the period; equity is a point-in-time stock, so average beginning and ending equity aligns the denominator with the period. Likely misconception: using ending equity because it is the newest value. Ask what large midyear issuance could still make the simple average imperfect. Time: 4 minutes.'),

    slide('13,14,15,16', 'Activity: build the ratio dashboard', 'cream activity-slide', `
      <div class="header-row"><h2>Build five signals from one operating story</h2><div class="eyebrow">Pairs · 5 minutes</div></div><div class="rule"></div>
      <div class="activity-layout"><div class="case-data"><span>Class exercise data</span><div><b>Revenue</b><strong>$120,000</strong></div><div><b>COGS</b><strong>$48,000</strong></div><div><b>Net income</b><strong>$12,000</strong></div><div><b>Average assets</b><strong>$80,000</strong></div><div><b>Beginning / ending equity</b><strong>$28,000 / $32,000</strong></div><div><b>Current assets / liabilities</b><strong>$36,000 / $18,000</strong></div><div><b>Total debt / ending assets</b><strong>$44,000 / $88,000</strong></div></div>
        <div class="activity-steps"><article><span>Open</span><strong>M04 starter → Class Practice</strong><small>Enter formulas in E5:E9.</small></article><article><span>Build</span><strong>Current ratio, gross margin, asset turnover, debt ratio, and ROE</strong><small>Use the supplied inputs in B5:B14.</small></article><article><span>Deliver</span><strong>One promising signal + one question</strong><small>Be ready to defend both.</small></article></div></div>
      <div class="choice-check" data-interactive="denominator"><button type="button" data-correct="false">ROE uses ending equity only</button><button type="button" data-correct="true">ROE uses average equity</button><button type="button" data-correct="false">ROE uses total assets</button><button class="check-button" type="button" data-action="check-choice">Check denominator</button><output aria-live="polite">Select the denominator before checking.</output></div>`,
      'Answers: current ratio 2.00x; gross margin 60.0%; asset turnover 1.50x; debt ratio 50.0%; ROE 40.0% using average equity of 30,000. Strong signal: gross margin or ROE. Risk signal: half the asset base is debt-financed, and ROE may be leverage-assisted. Likely misconception: a 40 percent ROE proves excellent operations. Debrief by asking what additional data would separate operations from financing. Time: 5 minutes.'),

    slide('18', 'Reveal the dashboard', 'dark reveal-slide', `
      <div class="header-row"><h2>The dashboard is a starting point—not the recommendation</h2><div class="eyebrow">Reveal and debrief</div></div><div class="rule dark-rule"></div>
      <div class="dashboard" role="img" aria-label="Ratio dashboard showing current ratio 2.0 times, gross margin 60 percent, asset turnover 1.5 times, debt ratio 50 percent, and return on equity 40 percent">
        <article><span>Liquidity</span><strong>2.00×</strong><small>Current ratio</small></article><article><span>Gross economics</span><strong>60.0%</strong><small>Gross margin</small></article><article><span>Efficiency</span><strong>1.50×</strong><small>Asset turnover</small></article><article class="risk"><span>Financing</span><strong>50.0%</strong><small>Debt ratio</small></article><article class="focus"><span>Shareholder return</span><strong>40.0%</strong><small>ROE</small></article>
      </div><div class="reveal-question">Which operating driver created the 40% ROE—and how much came from leverage?</div>`,
      'Reveal after pairs commit. The correct debrief is not “performance is strong.” The current ratio and gross margin describe liquidity and gross economics, but require context before being judged healthy, but ROE needs decomposition. Ask students to identify what the dashboard cannot show: prior-period trend, peer benchmarks, interest coverage, cash conversion, and whether one-time items affected income. Time: 3 minutes.'),

    slide('13,14,15,16', 'Gross margin and net margin answer different questions', 'cream margin-bridge', `
      <div class="header-row"><h2>The same business has 60% gross margin and 10% net margin</h2><div class="eyebrow">Same class example</div></div><div class="rule"></div>
      <div class="margin-waterfall" role="img" aria-label="Revenue of 120000 less cost of goods sold of 48000 gives gross profit of 72000. Remaining net expenses of 60000 leave net income of 12000.">
        <article><span>Revenue</span><strong>$120,000</strong><small>Sales before expenses</small></article><i>−</i><article><span>Cost of goods sold</span><strong>$48,000</strong><small>Direct product costs</small></article><i>=</i><article class="highlight"><span>Gross profit</span><strong>$72,000</strong><small>$72,000 ÷ $120,000 = <b>60%</b></small></article>
      </div><div class="margin-bottom"><span>Then subtract $60,000 of remaining net expenses</span><b>↓</b><strong>$12,000 net income ÷ $120,000 revenue = 10%</strong><small>Operating costs, interest, taxes, and other net items come after gross profit.</small></div>
      <div class="decision-banner">DuPont uses net margin: the earnings left for shareholders.</div>`,
      'Keep the classroom business and revenue denominator unchanged. Gross profit is 120,000 minus 48,000, or 72,000; dividing by revenue gives 60%. Net income is 12,000, so the remaining net expense total is 60,000 and net margin is 10%. That residual is inferred from the provided totals; the exercise does not specify its individual components. Ask which margin belongs in ROE decomposition. Answer: net margin, because ROE also uses net income. Time: 2 minutes.'),

    slide('10,16,17,18', 'DuPont reads the engine behind ROE', 'cream dupont-slide', `
      <div class="header-row"><h2>ROE is the product of operations, efficiency, and leverage</h2><div class="eyebrow">Three-step DuPont</div></div><div class="rule"></div>
      <div class="dupont-flow" role="img" aria-label="Net margin of 10 percent multiplied by asset turnover of 1.5 times and equity multiplier of 2.67 times equals return on equity of 40 percent">
        <article><span>Net margin</span><strong>10.0%</strong><code>Net income ÷ revenue</code><small>Operations</small></article><b>×</b><article><span>Asset turnover</span><strong>1.50×</strong><code>Revenue ÷ average assets</code><small>Efficiency</small></article><b>×</b><article class="risk"><span>Equity multiplier</span><strong>2.67×</strong><code>Average assets ÷ average equity</code><small>Leverage</small></article><b>=</b><article class="result"><span>ROE</span><strong>40.0%</strong><code>10% × 1.5 × (80 / 30)</code><small>Shareholder return</small></article>
      </div><div class="decision-banner">Same example: 10% × 1.50 × ($80,000 ÷ $30,000) = 40.0% ROE.</div>`,
      'Use the net margin just established in the margin bridge. The displayed 2.67 multiplier is rounded; calculate with 80,000 / 30,000 throughout. Calculate the identity aloud: 10 percent net margin times 1.50 asset turnover times a 2.67 equity multiplier equals approximately 40 percent ROE. The direct calculation and DuPont result reconcile. Likely misconception: leverage is always bad. Clarify that leverage can be useful when cash flows cover fixed claims; the risk is treating leverage-driven ROE as operating improvement. Time: 5 minutes.'),

    slide('23', 'Stress the DuPont drivers', 'cream lab-slide', `
      <div class="header-row"><h2>Small driver changes can move ROE sharply</h2><div class="eyebrow">Pairs · 4 minutes</div></div><div class="rule"></div>
      <div class="dupont-lab" data-interactive="dupont"><div class="sliders"><label>Net margin <input id="margin-slider" type="range" min="4" max="16" step="1" value="10"><output id="margin-value">10%</output></label><label>Asset turnover <input id="turnover-slider" type="range" min="0.8" max="2.2" step="0.1" value="1.5"><output id="turnover-value">1.5×</output></label><label>Equity multiplier <input id="leverage-slider" type="range" min="1.2" max="3.2" step="any" value="2.6666666666666665"><output id="leverage-value">2.67×</output></label></div><div class="lab-result"><span>Modeled ROE</span><strong id="roe-output">40.0%</strong><small id="roe-driver">Base case: all three drivers contribute.</small></div></div>
      <div class="deliverable">Keep ROE near 40%: try higher margin with lower leverage. Record both driver sets and explain the financing-risk difference. <button type="button" id="reset-dupont">Reset class example</button></div><p class="precision-note">Starting multiplier = $80,000 ÷ $30,000; display rounded to 2.67×.</p>`,
      'Start from the exact classroom inputs: net margin 10%, turnover 1.50, and equity multiplier 80,000 / 30,000, giving 40.0% ROE. Work in pairs: record the starting drivers, then raise margin and lower leverage while holding ROE near 40%. For example, 12% margin, 1.50 turnover, and approximately 2.22 leverage give about 40%; 16% margin, 1.50 turnover, and approximately 1.67 leverage do too. Values are rounded for display; calculations retain the full input. Lower leverage reduces financing exposure, but higher margin still needs a credible business explanation. Reset restores the class example. Deliver two driver sets plus the tradeoff. Time: 4 minutes.'),

    slide('9,10,11', 'Choose the business model before the peer', 'cream model-slide', `
      <div class="header-row"><h2>Recent IPOs show why “tech company” is not a peer group</h2><div class="eyebrow">Business model first</div></div><div class="rule"></div>
      <div class="model-metric-heading">FY2025 GAAP net margin · Net income ÷ revenue</div>
      <div class="model-cards">
        <article><span>Figma · NYSE FIG</span><strong>Software platform</strong><b class="model-ratio negative">−118.4%</b><small>IPO-related stock compensation deepened the reported loss.</small><a class="source-link" href="${figmaSource}">Figma FY2025 results</a></article>
        <article><span>Reddit · NYSE RDDT</span><strong>Audience platform</strong><b class="model-ratio positive">24.1%</b><small>Advertising scale and monetization supported profitability.</small><a class="source-link" href="${redditSource}">Reddit FY2025 results</a></article>
        <article><span>CoreWeave · Nasdaq CRWV</span><strong>AI infrastructure</strong><b class="model-ratio negative">−22.7%</b><small>Infrastructure costs and interest expense weighed on profit.</small><a class="source-link" href="${coreweaveSource}">CoreWeave FY2025 results</a></article>
      </div><div class="compare-strip"><span>Same ratio · same year</span><b>≠</b><strong>Same economics or benchmark</strong></div>`,
      'All three values use fiscal 2025 GAAP net income divided by revenue, rounded to one decimal place. Figma: -1,250.463 / 1,055.788 = -118.4%; Reddit: 530 / 2,203 = 24.1%; CoreWeave: -1,167 / 5,131 = -22.7% (inputs in millions). A negative margin means a net loss per dollar of revenue; a loss can exceed revenue when costs and charges exceed sales. Figma recognized $975.7 million of IPO-related stock compensation; CoreWeave reported $1.229 billion of net interest expense. Ask which business needs the most physical infrastructure and why net margin alone cannot rank operating quality. Answer: CoreWeave; business model, financing, and unusual expenses differ. These are diagnostic signals, not peer targets. Next examine the drivers in order: Reddit, Figma, then CoreWeave. Time: 3 minutes.'),

    slide('current', 'Reddit: scale changed the margin story', 'cream case-slide reddit-slide', `
      <div class="header-row"><h2>Reddit’s 2025 results connect scale with a stronger earnings signal</h2><div class="eyebrow">Platform IPO · FY2025</div></div><div class="rule"></div>
      <div class="growth-bridge" role="img" aria-label="Reddit fiscal 2025 revenue grew 69 percent to 2.2 billion dollars and net income reached 530 million dollars, or 24.1 percent of revenue">
        <article><span>Revenue growth</span><strong>69%</strong><small>to $2.2B</small></article><i>→</i><article><span>Net income</span><strong>$530M</strong><small>24.1% net margin</small></article><i>→</i><article><span>Question</span><strong>Durable?</strong><small>Test user growth, ad economics, and cash conversion</small></article>
      </div><a class="source-link" href="${redditSource}">Source: Reddit FY2025 results · February 5, 2026</a>`,
      'Reddit reported 2025 revenue growth of 69 percent to 2.2 billion dollars and net income of 530 million dollars, equal to 24.1 percent of revenue. The ratio story improved with scale, but the next step is still a driver test: user activity, monetization, revenue mix, and cash conversion. Likely misconception: one profitable year establishes a mature benchmark. Time: 3 minutes.'),

    slide('current', 'Figma: one event can distort a margin', 'cream case-slide figma-slide', `
      <div class="header-row"><h2>Figma’s IPO year shows why GAAP margin needs a driver note</h2><div class="eyebrow">Recent IPO · FY2025</div></div><div class="rule"></div>
      <div class="case-contrast"><article><span>Revenue</span><strong>$1.056B</strong><small>Up 41% year over year</small></article><article class="risk"><span>GAAP operating margin</span><strong>−122%</strong><small>Included IPO-related stock compensation</small></article><article><span>Operating cash-flow margin</span><strong>24%</strong><small>$250.7M operating cash flow</small></article></div>
      <div class="driver-note"><strong>Why net margin was −118.4%:</strong><span>$975.7M of IPO-related stock compensation. Operating and cash-flow margins isolate different parts of the story.</span></div>
      <a class="source-link" href="${figmaSource}">Source: Figma FY2025 results · February 18, 2026</a>`,
      'Figma reported 2025 revenue of 1.056 billion dollars, GAAP operating margin of negative 122 percent, and operating cash-flow margin of 24 percent. The company attributed 975.7 million dollars of one-time stock-based compensation to its IPO. Ask: should we ignore GAAP? No. Use GAAP, explain the driver, and compare cash flow and recurring economics without pretending compensation is free. Time: 4 minutes.'),

    slide('current', 'CoreWeave: growth, backlog, and financing tell different stories', 'dark case-slide coreweave-slide', `
      <div class="header-row"><h2>CoreWeave proves that growth and profit can move in opposite directions</h2><div class="eyebrow">AI infrastructure IPO · FY2025</div></div><div class="rule dark-rule"></div>
      <div class="case-balance" role="img" aria-label="CoreWeave fiscal 2025 evidence balances 5.131 billion dollars of revenue and 66.8 billion dollars of backlog against a 22.7 percent net loss margin (23 percent rounded in the release) and 1.229 billion dollars of net interest expense">
        <div class="growth-side"><article><span>Revenue</span><strong>$5.131B</strong></article><article><span>Revenue backlog</span><strong>$66.8B</strong></article></div><div class="balance-pivot">Scale must fund capacity</div><div class="risk-side"><article><span>Net loss margin</span><strong>−22.7%</strong></article><article><span>Net interest expense</span><strong>$1.229B</strong></article></div>
      </div><a class="source-link light" href="${coreweaveSource}">Source: CoreWeave FY2025 results · February 26, 2026</a>`,
      'CoreWeave reported 2025 revenue of 5.131 billion dollars, a 22.7 percent net loss margin (23 percent rounded in the release), 1.229 billion dollars of net interest expense, and 66.8 billion dollars of revenue backlog. Do not equate backlog with recognized revenue or cash. Ask which ratios deserve priority: interest coverage, debt-to-assets, asset turnover, operating cash conversion, and customer concentration alongside growth. Time: 4 minutes.'),

    slide('11,12,19,20,21,22', 'Peer selection is part of the analysis', 'cream matrix-slide', `
      <div class="header-row"><h2>Choose peers by economics before comparing ratios</h2><div class="eyebrow">Benchmark matrix</div></div><div class="rule"></div>
      <div class="peer-matrix" role="img" aria-label="Peer selection matrix places software and advertising platforms on the asset-light side and AI infrastructure on the asset-intensive side, with mature firms above recent IPOs">
        <div class="axis-y"><span>Mature public history</span><span>Recent IPO effects</span></div><div class="axis-x"><span>Asset-light</span><span>Asset-intensive</span></div>
        <div class="matrix-grid"><article class="figma"><strong>Figma</strong><small>Software · IPO effects</small></article><article class="reddit"><strong>Reddit</strong><small>Platform · scaling margins</small></article><article class="coreweave"><strong>CoreWeave</strong><small>AI infrastructure · financed capacity</small></article><div class="empty">Find peers with similar revenue model, capital intensity, maturity, and accounting definitions.</div></div>
      </div>`,
      'Use the matrix as a peer-screen, not a valuation chart. Figma and Reddit are more asset-light than CoreWeave, but their revenue models also differ. Recent IPOs may show unusual stock-compensation, share-count, and capital-structure effects. Ask students for four peer filters: revenue model, capital intensity, maturity, and accounting definition. Time: 4 minutes.'),

    slide('24', 'Interest coverage makes the financing constraint visible', 'cream coverage-bridge', `
      <div class="header-row"><h2>Interest coverage asks whether operating profit covers interest</h2><div class="eyebrow">Financing risk</div></div><div class="rule"></div>
      <div class="coverage-equation" role="img" aria-label="Illustrative EBIT of 80000 divided by annual interest expense of 100000 equals interest coverage of 0.8 times">
        <article><span>Annual EBIT</span><strong>$80,000</strong><small>Earnings before interest and taxes</small></article><b>÷</b><article><span>Annual interest expense</span><strong>$100,000</strong><small>Cost of borrowing for the same year</small></article><b>=</b><article class="risk"><span>Interest coverage</span><strong>0.8×</strong><small>EBIT covers 80% of interest</small></article>
      </div><div class="decision-banner">Below 1.0×: investigate cash, payment timing, and refinancing.</div><p class="precision-note">Illustrative financing example. EBIT is not cash flow; this ratio excludes principal repayments.</p>`,
      'Introduce this new hypothetical financing example separately from the original classroom dashboard. Define EBIT before calculating 80,000 / 100,000 = 0.8 times. At one times, EBIT equals interest; below one times, operating profit is insufficient to cover interest expense. This is a warning that merits investigation, not proof of immediate default. EBIT is not cash flow, and interest coverage does not test principal repayments. The next decision activity will use the same 0.8 coverage signal with a business model and two competing signals. Time: 2 minutes.'),

    slide('22,25', 'Write the recommendation as an evidence chain', 'cream recommendation-slide', `
      <div class="header-row"><h2>A decision-ready recommendation names evidence, driver, risk, and next test</h2><div class="eyebrow">CFO brief</div></div><div class="rule"></div>
      <div class="recommendation-chain" role="img" aria-label="A recommendation chain moves from ratio evidence to the operating or financing driver, then risk, then the next evidence test">
        <article><span>Evidence</span><strong>Two ratios</strong><small>Use definition and period.</small></article><i>→</i><article><span>Driver</span><strong>What changed?</strong><small>Margin · turnover · leverage</small></article><i>→</i><article><span>Risk</span><strong>What could reverse it?</strong><small>Liquidity · debt · one-time item</small></article><i>→</i><article><span>Next test</span><strong>What evidence?</strong><small>Trend · peer · cash flow · footnote</small></article>
      </div><div class="sentence-frame">“Performance appears ___ because ___; however, ___ could reverse the conclusion, so we should verify ___.”</div>`,
      'Model one example: “Performance appears operationally stronger because margin and turnover improved; however, leverage also increased, so we should verify interest coverage and the debt-maturity schedule.” Require a conclusion that is conditional rather than vague. Likely misconception: listing ratios without stating the decision implication. Time: 3 minutes.'),

    slide('24', 'Activity: resolve a ratio conflict', 'dark activity-slide conflict-slide', `
      <div class="header-row"><h2>Which signal should the CFO investigate first?</h2><div class="eyebrow">Guided teams · 4 minutes</div></div><div class="rule dark-rule"></div>
      <p class="scenario-context">Hypothetical equipment-rental business: debt-funded fleet expansion; customers pay over time, while loan payments are due monthly.</p><div class="conflict-cards"><article><span>Growth</span><strong>Revenue +70%</strong><small>Demand appears strong.</small></article><article><span>Return</span><strong>ROE 38%</strong><small>Shareholder return appears high.</small></article><article class="risk"><span>Financing</span><strong>Interest coverage 0.8×</strong><small>EBIT ÷ interest expense</small></article></div>
      <div class="activity-contract"><span><b>Decide</b> Choose the first follow-up question.</span><span><b>Defend</b> Use two ratios and one business-model fact.</span><span><b>Deliver</b> One priority + evidence-based reason.</span></div>
      <div class="choice-check dark-check" data-interactive="conflict"><button type="button" data-correct="false">Celebrate growth first</button><button type="button" data-correct="false">Treat ROE as operating proof</button><button type="button" data-correct="true">Test debt service and the leverage driver</button><button class="check-button" type="button" data-action="check-choice">Check priority</button><output aria-live="polite">Choose the first investigation priority.</output></div>`,
      'This is a separate hypothetical equipment-rental scenario, not an additional fact about the companies just discussed. Teams choose an investigation priority and support it with two ratios plus the mismatch between customer receipts and monthly debt payments. Best first priority: debt service and the leverage driver. Coverage of 0.8 means EBIT covers only 80% of interest. The 38% ROE does not prove leverage caused the return; inspect equity, earnings, and timing. Do not infer insolvency from a single ratio. Ask what cash balances or contractual receipts could soften the concern. Collect one priority and reason before revealing. Time: 4 minutes.'),

    slide('24', 'Reveal: no ratio wins by itself', 'cream reveal-slide conflict-reveal', `
      <div class="header-row"><h2>The first question is whether the firm can finance the growth</h2><div class="eyebrow">Reveal and debrief</div></div><div class="rule"></div>
      <div class="evidence-chain" role="img" aria-label="Revenue growth and high return on equity feed a leverage check, and interest coverage below one triggers a liquidity and refinancing investigation">
        <article><span>Attractive signal</span><strong>Revenue +70%</strong></article><i>+</i><article><span>Ambiguous signal</span><strong>ROE 38%</strong></article><i>→</i><article class="risk"><span>Risk signal</span><strong>Coverage 0.8×</strong></article><i>→</i><article class="question"><span>Next evidence</span><strong>Cash · maturities · covenants</strong></article>
      </div><div class="decision-banner">Monthly debt payments make cash timing the first follow-up question.</div>`,
      'Reveal the chain after teams commit. Growth and ROE remain useful, but coverage below one changes the immediate priority. The correct conclusion is not automatic rejection; it is a targeted financing investigation. Ask one team to defend the risk view and another to state what evidence would make the growth plan financeable. Time: 3 minutes.'),

    slide('24', 'Activity: deliver the CFO brief', 'dark activity-slide brief-slide', `
      <div class="header-row"><h2>Defend a recommendation that can survive one follow-up question</h2><div class="eyebrow">Individual · 5 minutes</div></div><div class="rule dark-rule"></div>
      <p class="scenario-context">Return to Class Practice: use E5:E9 and the DuPont bridge. Write your brief in A21.</p><div class="brief-grid"><article><span>Use</span><strong>Two ratios from Class Practice</strong><small>At least one must be a risk or constraint signal.</small></article><article><span>Explain</span><strong>One DuPont driver</strong><small>Margin, turnover, or leverage.</small></article><article><span>Stress</span><strong>One reversal condition</strong><small>What evidence would change your recommendation?</small></article></div>
      <div class="brief-deliverable"><span>Required deliverable</span><strong>A two-sentence CFO brief + one follow-up data request</strong></div>`,
      'Students now write in Class Practice!A21 individually on the original classroom dashboard, not the hypothetical equipment-rental conflict. Write a two-sentence brief using two ratios, one DuPont driver, and one condition that could reverse the judgment; add one specific data request. Evidence available: current ratio 2.00, gross margin 60%, net margin 10%, turnover 1.50, debt ratio 50%, and ROE 40%. A defensible response recognizes positive earnings while testing leverage and debt-service capacity. These levels alone do not establish superiority without a trend or peer. Invite two different conclusions and assess the evidence chain. Time: 5 minutes.'),

    slide('25', 'Three safeguards', 'cream recap-slide', `
      <div class="header-row"><h2>Trust a ratio only after three audits</h2><div class="eyebrow">Close the loop</div></div><div class="rule"></div>
      <div class="audit-loop" role="img" aria-label="Three connected audits check formula integrity, driver logic, and benchmark fit before a ratio is used in a decision">
        <article><span>Formula integrity</span><strong>Match period, units, and denominator.</strong></article><i>→</i><article><span>Driver logic</span><strong>Separate margin, efficiency, and leverage.</strong></article><i>→</i><article><span>Benchmark fit</span><strong>Compare the right business model and maturity.</strong></article><i>↺</i>
      </div><div class="deliverable">After class: compare the two retailers. Complete the eight CORE ratio rows, expense test, and written recommendation. Other ratios are optional.</div>`,
      'Assign the two-retailer comparison after class: Student Calculations CORE rows 6, 10, 12, 14, 17, 18, 22, and 23; DuPont & Driver B20 and B29; Checks & Recommendation A19. This is a deliberate transfer to new supplied data. No FactSet retrieval is required. Ask students to restate each safeguard without reading. Formula integrity prevents silent spreadsheet errors; driver logic prevents leverage from masquerading as operating improvement; benchmark fit prevents a software platform from being judged against AI infrastructure economics. Time: 2 minutes.'),

    slide('26,27', 'Exit ticket', 'dark close-slide', `
      <div class="signal-bar"></div><div class="eyebrow">Individual exit check · 2 minutes</div><h2>Does higher ROE prove better operations?</h2>
      <div class="exit-frame">Net margin and asset turnover stay unchanged. The equity multiplier rises. ROE increases.</div>
      <div class="exit-actions" data-interactive="exit"><button type="button" data-exit="operations">Operations improved</button><button type="button" data-exit="financing">Financing changed</button><button type="button" data-exit="unclear">The driver cannot be identified</button></div><output id="exit-feedback" aria-live="polite">Choose the driver, then write one sentence explaining the risk.</output>
      <div class="next-band"><span>Next</span><strong>Value cash flows that arrive at different times.</strong></div>`,
      'Use this as an individual transfer check, not another CFO brief. Correct choice: financing changed. With margin and asset turnover fixed, the higher equity multiplier accounts for the ROE increase. This is not evidence of improved operations. A strong risk sentence says the larger assets-to-equity ratio may increase financing exposure and calls for debt and coverage evidence; it does not assume every liability is interest-bearing debt. Collect the explanation before discussing the answer. Preview comparing cash flows across time. Time: 2 minutes.')
  ]
};
