---
course: BUS311
lesson_id: valuation-m04-l01
title: "Capital Budgeting and Project Selection"
outcomes: [LO4, LO6]
status: draft
factset_required: true
---

# Capital Budgeting and Project Selection

## Why this matters

Security valuation prices claims; capital budgeting values operating investments. This lesson uses **Harborside Medical Center** as a decision context. The goal is not merely to reproduce a formula; it is to explain what the result means for a financial decision and what evidence could change the conclusion.

## Learning objectives

- Identify incremental project cash flows
- Calculate NPV, IRR, and PI
- Recommend under capital constraints

## Build the cash-flow case

### Incremental only

Exclude allocated costs that will not change. Include opportunity costs, side effects, and changes in working capital caused by the decision.

### Sunk costs

Research or consulting already paid is irrelevant to accept-or-reject analysis. Emotional attachment to sunk cost is a common source of value destruction.

### Terminal effects

End-of-project cash flow may include asset sale proceeds, taxes on gains or losses, cleanup costs, and working-capital recovery.

## Decision measures

### NPV

NPV directly estimates value created in dollars at the required return. For mutually exclusive projects, choose the feasible alternative with the highest positive NPV.

### IRR and PI

IRR is intuitive but can mislead with unusual cash-flow signs or scale differences. Profitability index helps rank value created per constrained investment dollar.

## Risk and recommendation

### Sensitivity

Sensitivity analysis identifies which input has the greatest effect on NPV. It does not assign probabilities, but it focuses due diligence.

### Scenarios

Downside, base, and upside cases capture operating relationships better than independent changes. Each scenario should have a clear business narrative.

### Capital rationing

When capital is limited, rankings must respect project indivisibility, dependencies, strategic constraints, and risk—not just one ratio.

## Worked example

**Excel:** `=NPV(10%,year1:year4)+initial_outlay`

**Manual logic:** PV of future inflows − $500,000 investment

**Expected conclusion:** Accept when calculated NPV is positive and assumptions are defensible.

Use the Harborside workbook to compare NPV, IRR, PI, and narrative risks before writing the recommendation.

## FactSet application

Before using a FactSet value, record the field name, company, fiscal period, units, currency, and retrieval date. Reconcile material inputs to the company filing or FactSet definition. A correct-looking formula built from mismatched periods or units is not a valid analysis.

## Decision questions

1. Why should sunk costs be excluded?
1. When might the highest-IRR project not be the best decision?

## Key takeaways

- Model incremental after-tax cash flows.
- Let NPV lead the decision.
- Use sensitivity to focus judgment.

## Before class

- Review the learning objectives and define every bold term in your own words.
- Open the linked lesson workbook when one is provided.
- Confirm that you can access FactSet before class.
- Bring one question about an assumption, data definition, or decision trade-off.
