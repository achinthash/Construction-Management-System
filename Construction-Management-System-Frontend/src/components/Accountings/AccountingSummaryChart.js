import React from 'react'
import BillSummary from '../Bills/BillSummary';
import PurchaseOrderSummary from './PurchaseOrders/PurchaseOrderSummary'
import PayrollSummary from '../Payroll/PayrollSummary';

export default function AccountingSummaryChart() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-center ">Accounting Summary</h2>


      <BillSummary />

      <PurchaseOrderSummary />

      <PayrollSummary />


    </div>
  )
}
