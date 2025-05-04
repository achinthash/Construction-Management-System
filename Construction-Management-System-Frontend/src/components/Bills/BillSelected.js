import React, { useState, useEffect,useRef } from "react";
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResponseMessages from '../ResponseMessages';
import Loading from "../Loading";


export default function BillSelected(props) {

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);
    const [loading, setLoading] = useState(true);
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `http://127.0.0.1:8000/api/bill-selected/${props.selectedBill}`,
              {
                headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
              }
            );
            setBills(response.data);
            
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, [props.selectedBill]);


      const downloadPDF = () => {
        const bill = document.getElementById('bill');
        const originalStyle = bill.getAttribute("style");
    
        // Expand div to render full content
        bill.style.maxHeight = 'none';
        bill.style.overflow = 'visible';
    
        html2canvas(bill, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
    
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
            const pdfBlob = pdf.output('blob');
    
            // Upload PDF to backend
            const formData = new FormData();
            const fileName = `Bill-${bills.id || 'details'}.pdf`;

            const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

            formData.append('project_id', bills.project.id);
            formData.append('doc_type', 'bill');
            formData.append('doc_path[]',pdfFile);
            formData.append('doc_referenced_id', bills.id); // Optional
    
            axios.post('http://127.0.0.1:8000/api/new-document', formData, {
                headers: {
                     Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                setSuccessMessage.current('PDF downloaded and stored successfully.');
                pdf.save(fileName);
            })
            .catch((err) => {
                setErrorMessage.current('Failed to upload PDF.');
            })
            .finally(() => {
                if (originalStyle) {
                    bill.setAttribute("style", originalStyle);
                } else {
                    bill.removeAttribute("style");
                }
            });
        });
    };

    

      if (loading) {
        return <Loading />;
      }

  return (
    <div>
        <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
       <div className="flex p-1 items-end">

       <button onClick={downloadPDF} className=" bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > Download PDF </button>

       </div>

        <div id="bill" className=" mx-auto bg-white p-8 rounded-lg shadow-md print:shadow-none print:p-0 print:rounded-none print:bg-white text-sm text-gray-900 max-h-[80vh] overflow-y-auto">
            <div className="mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold mb-2">{bills.title}</h1>
                <div className="text-gray-600">
                <p><strong>Project Name:</strong> {bills.project.name}</p>
                <p><strong>Bill Type:</strong> {bills.bill_type}</p>
                <p><strong>Status:</strong> {bills.status}</p>
                <p><strong>Client:</strong> {bills.payee.name}</p>
                <p><strong>Date:</strong> {new Date(bills.created_at).toLocaleDateString()}</p>

                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Bill Items</h2>
                <table className="w-full border border-gray-300 text-left">
                <thead>
                    <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300">#</th>
                    <th className="p-2 border border-gray-300">Item</th>
                    <th className="p-2 border border-gray-300">Qty</th>
                    <th className="p-2 border border-gray-300">Unit Price</th>
                    <th className="p-2 border border-gray-300">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.items.map((item, index) => (
                    <tr key={item.id}>
                        <td className="p-2 border border-gray-300">{index + 1}</td>
                        <td className="p-2 border border-gray-300">{item.title}</td>
                        <td className="p-2 border border-gray-300">{item.quantity}</td>
                        <td className="p-2 border border-gray-300">Rs. {item.unit_price}</td>
                        <td className="p-2 border border-gray-300">Rs. {item.total}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="flex justify-end mb-4">
                <div className="w-full sm:w-1/2 border-t pt-4 space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {bills.subtotal}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>Rs. {bills.tax}</span>
                </div>
                <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>Rs. {bills.discount}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>Rs. {bills.total}</span>
                </div>
                </div>
            </div>

            {bills.notes && (
                <div className="mt-4 border-t pt-4">
                    <h3 className="font-semibold">Notes</h3>
                    <p className="text-gray-700">{bills.notes}</p>
                </div>
            )}
         </div>
    </div>
  )
}
