// Apex case facts match Tab 1 – Assumptions in the maintained M07 starter.
// Money and shares are expressed in millions here; the workbook uses thousands.
export const apexM07Case = {
  debt:300, bookEquity:245, cash:45, currentAssets:200, accountsPayable:85,
  shortDebt:60, longDebt:240, assets:630, ebit:255, taxRate:0.25,
  debtRate:0.12, preShares:50, newShares:20, offerPrice:20, fees:0,
  debtPaydown:200, capex:200, fcff1:52, wacc:0.09, fcffGrowth:0.04
};
export function apexM07Results(c=apexM07Case){
  const proceeds=c.newShares*c.offerPrice-c.fees;
  const debt=c.debt-c.debtPaydown;
  const shortDebt=Math.max(0,c.shortDebt-c.debtPaydown);
  const equity=c.bookEquity+proceeds;
  const cash=c.cash+proceeds-c.debtPaydown-c.capex;
  const preIncome=(c.ebit-c.debt*c.debtRate)*(1-c.taxRate);
  const postIncome=(c.ebit-debt*c.debtRate)*(1-c.taxRate);
  const shares=c.preShares+c.newShares;
  const ev=c.fcff1/(c.wacc-c.fcffGrowth);
  return {proceeds,debt,shortDebt,equity,cash,preIncome,postIncome,shares,
    preDE:c.debt/c.bookEquity,postDE:debt/equity,
    preCurrent:c.currentAssets/(c.accountsPayable+c.shortDebt),
    postCurrent:(c.currentAssets+cash-c.cash)/(c.accountsPayable+shortDebt),
    preCoverage:c.ebit/(c.debt*c.debtRate),postCoverage:c.ebit/(debt*c.debtRate),
    preROE:preIncome/c.bookEquity,postROE:postIncome/equity,
    preEPS:preIncome/c.preShares,postEPS:postIncome/shares,
    epsHurdle:preIncome/c.preShares*shares,
    oldOwnership:c.preShares/shares,ev,equityValue:ev-c.debt+c.cash,
    valuePerShare:(ev-c.debt+c.cash)/c.preShares};
}
