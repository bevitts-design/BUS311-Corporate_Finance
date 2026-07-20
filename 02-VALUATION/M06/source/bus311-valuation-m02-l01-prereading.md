---
course: BUS311
lesson_id: valuation-m02-l01
title: "Bond Valuation, Interest Rates, and YTM"
outcomes: [LO4, LO5]
status: draft
factset_required: true
---

# Bond Valuation, Interest Rates, and YTM

## Why this matters

A bond is a dated package of cash flows valued with TVM. This lesson uses **Meridian Industrial Corp.** as a decision context. The goal is not merely to reproduce a formula; it is to explain what the result means for a financial decision and what evidence could change the conclusion.

## Learning objectives

- Price coupon bonds
- Interpret yield to maturity
- Explain interest-rate and credit risk

## Bond cash flows

### Coupon stream

The coupon rate determines contractual payments from par value. It does not change merely because market yields move.

### Principal repayment

The final cash flow includes both the last coupon and principal. Credit risk affects whether investors expect the promised amount to arrive.

### Price is present value

A bond price equals the PV of coupons plus the PV of principal. The required yield reflects current base rates, maturity, liquidity, taxes, and credit risk.

## Price and yield move oppositely

### Premium bond

Investors pay more because the contract offers coupons richer than newly issued comparable debt. The premium amortizes as maturity approaches.

### Discount bond

A lower price raises the return earned from coupons plus the pull toward par. Price must adjust because the contractual coupon cannot.

## Risk and corporate impact

### Duration intuition

More value arriving far in the future increases sensitivity to discount-rate changes. Duration provides a compact measure of that exposure.

### Credit spread

Spreads compensate for expected loss, uncertainty, liquidity, and risk aversion. Widening spreads reduce existing bond prices even if Treasury yields do not move.

### Debt changes ratios

The use of proceeds matters. Refinancing short-term debt differs from funding uncertain expansion, even when the bond terms are identical.

## Worked example

**Excel:** `=-PV(6%/2,10*2,1000*5%/2,1000)`

**Manual logic:** PV of 20 coupons + PV of $1,000 principal

**Expected conclusion:** $925.61 when YTM exceeds the coupon rate.

Use the MRID workbook to connect pricing mechanics to the issuer’s post-offering ratios and CFO recommendation.

## FactSet application

Before using a FactSet value, record the field name, company, fiscal period, units, currency, and retrieval date. Reconcile material inputs to the company filing or FactSet definition. A correct-looking formula built from mismatched periods or units is not a valid analysis.

## Decision questions

1. Why do bond prices fall when required yields rise?
1. How should MRID’s use of proceeds affect your financing recommendation?

## Key takeaways

- Price equals discounted coupons plus principal.
- Yield and price move inversely.
- Debt terms and use of proceeds shape risk.

## Before class

- Review the learning objectives and define every bold term in your own words.
- Open the linked lesson workbook when one is provided.
- Confirm that you can access FactSet before class.
- Bring one question about an assumption, data definition, or decision trade-off.
