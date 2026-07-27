---
course: BUS311
lesson_id: valuation-m01-l01
title: "Time Value of Money"
outcomes: [LO4]
status: draft
factset_required: true
---

# Time Value of Money

## Why this matters

Performance measures describe the past; valuation converts future cash into today’s terms. This lesson uses **Berkshire Hathaway** as a decision context. The goal is not merely to reproduce a formula; it is to explain what the result means for a financial decision and what evidence could change the conclusion.

## Learning objectives

- Draw cash-flow timelines
- Solve present and future value
- Match rate and period conventions

## The valuation grammar

### Timeline first

A timeline exposes whether a payment occurs today, at period-end, or at period-beginning. Most TVM errors start before the formula because timing was never made explicit.

### Compounding

Each period earns a return on the original principal and prior accumulated returns. Longer time and higher rates amplify the compounding effect.

### Discounting

The discount rate compensates for time and risk. A higher required return lowers what a future cash flow is worth today.

## Rates and periods must agree

### Periodic rate

For monthly cash flows, use a monthly rate and monthly count unless an effective rate is supplied. Never divide an effective annual rate by twelve without checking its definition.

### Sign convention

Financial functions use directional cash flows. If PV is entered as a cash outflow, FV usually appears as a positive inflow; inconsistent signs create confusing results.

## Cash-flow patterns

### Lump sum

Lump-sum PV and FV are the foundation. Multi-period securities and projects then add together the values of multiple dated cash flows.

### Annuity

Ordinary annuities pay at period-end; annuities due pay at period-beginning. That one-period timing difference changes value.

### Perpetuity

A level perpetuity is cash flow divided by required return, provided the first payment arrives one period from now. Growth requires a separate growing-perpetuity condition.

## Worked example

**Excel:** `=FV(8%,5,0,-10000)`

**Manual logic:** $10,000 × (1.08)^5

**Expected conclusion:** $14,693.28 future value.

Have students solve manually and in Excel, then change only the timing or rate to observe sensitivity.

## FactSet application

Before using a FactSet value, record the field name, company, fiscal period, units, currency, and retrieval date. Reconcile material inputs to the company filing or FactSet definition. A correct-looking formula built from mismatched periods or units is not a valid analysis.

## Decision questions

1. Why does a higher discount rate reduce present value?
1. What mistake occurs when monthly payments use an annual period count?

## Key takeaways

- Draw the timeline before choosing a formula.
- Match rates to periods.
- Treat signs as cash-flow direction.

## Before class

- Review the learning objectives and define every bold term in your own words.
- Open the linked lesson workbook when one is provided.
- Confirm that you can access FactSet before class.
- Bring one question about an assumption, data definition, or decision trade-off.
