---
course: BUS311
lesson_id: decisions-m01-l01
title: "Risk, Return, and CAPM"
outcomes: [LO5]
status: draft
factset_required: true
---

# Risk, Return, and CAPM

## Why this matters

Capital budgeting needs a discount rate; risk determines the return investors require. This lesson uses **Boeing** as a decision context. The goal is not merely to reproduce a formula; it is to explain what the result means for a financial decision and what evidence could change the conclusion.

## Learning objectives

- Calculate expected return and volatility
- Interpret diversification and beta
- Estimate required return with CAPM

## Describe return and risk

### Holding-period return

Return measurement must align dates and distributions. Comparing a price-only return with a total return leads to incorrect conclusions.

### Expected return

Expected return is the probability-weighted average outcome, not the most likely outcome. It represents the center of the distribution.

### Volatility

Volatility captures total variability but not the reason for it. Historical estimates are backward-looking and sensitive to measurement window and frequency.

## Diversification changes the question

### Company-specific risk

Product failures, lawsuits, and management shocks may be severe for one company but have smaller effects on a broad portfolio.

### Market risk

Rates, recessions, inflation, and risk appetite affect many assets together. Investors require compensation for this nondiversifiable exposure.

## Beta and required return

### Beta

A beta above one indicates amplified market exposure; below one indicates lower sensitivity. Estimates depend on benchmark, interval, and sample period.

### CAPM

CAPM links beta to the market risk premium. Its assumptions are simplified, so analysts should document sources and test the result against reasonableness.

### Decision use

A corporate average rate may misprice a project that is materially safer or riskier than existing operations. Risk follows the asset, not the funding label.

## Worked example

**Excel:** `=risk_free+beta*(market_return-risk_free)`

**Manual logic:** 4.0% + 1.25 × (10.0% − 4.0%)

**Expected conclusion:** 11.5% required return.

The workbook lets students change beta and the market risk premium, then explain why the required return changes.

## FactSet application

Before using a FactSet value, record the field name, company, fiscal period, units, currency, and retrieval date. Reconcile material inputs to the company filing or FactSet definition. A correct-looking formula built from mismatched periods or units is not a valid analysis.

## Decision questions

1. Why is Boeing volatility not the same as Boeing beta?
1. When should a project use a rate different from the company WACC?

## Key takeaways

- Measure returns on a consistent basis.
- Diversification removes company-specific risk.
- CAPM prices market exposure through beta.

## Before class

- Review the learning objectives and define every bold term in your own words.
- Open the linked lesson workbook when one is provided.
- Confirm that you can access FactSet before class.
- Bring one question about an assumption, data definition, or decision trade-off.
