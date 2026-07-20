---
course: BUS311
lesson_id: decisions-m02-l01
title: "Cost of Capital and WACC"
outcomes: [LO5, LO6]
status: draft
factset_required: true
---

# Cost of Capital and WACC

## Why this matters

CAPM estimates equity return; WACC combines all long-term capital providers. This lesson uses **Target** as a decision context. The goal is not merely to reproduce a formula; it is to explain what the result means for a financial decision and what evidence could change the conclusion.

## Learning objectives

- Estimate component costs of capital
- Use market-value financing weights
- Apply WACC as a project hurdle rate

## Component costs

### Cost of equity

CAPM is a common estimate, supported by source-documented risk-free rate, beta, and market risk premium. Dividend models can provide a reasonableness check for stable payers.

### Cost of debt

The cost of debt reflects today’s required return on comparable borrowing. Because interest is generally tax-deductible, WACC uses the after-tax debt cost.

### Preferred stock

When material, preferred stock receives its own component cost and market-value weight. It should not be forced into debt or common equity.

## Weights and taxes

### Market-value weights

Book values describe accounting history. WACC normally uses market values because investor-required returns apply to current economic claims.

### After-tax debt

Multiply the pretax debt cost by one minus the marginal tax rate, while recognizing that loss positions or interest limitations can reduce the realized shield.

## Use WACC carefully

### Matching principle

Using one company WACC for every proposal can subsidize risky projects and reject safe ones. Adjust the rate or use comparable pure-play evidence when risk differs.

### Consistent cash flow

The numerator and discount rate must describe the same claim set. Financing cash flows should not be double-counted inside unlevered project cash flows.

### Sensitivity

Because distant cash flows are sensitive to discount rates, show a range and explain which inputs drive it. Do not hide a precise WACC behind rounded assumptions.

## Worked example

**Excel:** `=E_weight*cost_equity+D_weight*cost_debt*(1-tax_rate)`

**Manual logic:** 70% × 10.5% + 30% × 5.8% × (1 − 25%)

**Expected conclusion:** 8.66% WACC.

Use the Target-style workbook to calculate each component, confirm weights sum to 100%, and test the hurdle rate.

## FactSet application

Before using a FactSet value, record the field name, company, fiscal period, units, currency, and retrieval date. Reconcile material inputs to the company filing or FactSet definition. A correct-looking formula built from mismatched periods or units is not a valid analysis.

## Decision questions

1. Why are book-value weights usually inappropriate?
1. What happens when a risky project is discounted at an average company WACC?

## Key takeaways

- Estimate current component costs.
- Use market-value weights.
- Match WACC to cash flow and project risk.

## Before class

- Review the learning objectives and define every bold term in your own words.
- Open the linked lesson workbook when one is provided.
- Confirm that you can access FactSet before class.
- Bring one question about an assumption, data definition, or decision trade-off.
