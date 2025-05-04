import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import ResponseMessages from '../../ResponseMessages';
import Loading from "../../Loading";

export default function PurchaseOrderSelected(props) {

  const token = sessionStorage.getItem("token") || "";
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [loading, setLoading] = useState(true);
  const [data, setPO] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/purchase-order-selected/${props.selectedPO}`,
            {
              headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`  },
            }
          );
          setPO(response.data);

        
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      };
  
      fetchData();
    }, [props.selectedPO]);

   // Upload PDF to backend
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
  
       
          const formData = new FormData();
          const fileName = `Bill-${data.id || 'details'}.pdf`;

          const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

          formData.append('project_id', data.project_id);
          formData.append('doc_type', 'Purchase Order');
          formData.append('doc_path[]',pdfFile);
          formData.append('doc_referenced_id', data.id); 
  
          axios.post('http://127.0.0.1:8000/api/new-document', formData, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data',
              },
          })
          .then(() => {
              alert('PDF downloaded and stored successfully.');
              pdf.save(fileName); 
          })
          .catch((err) => {
              console.error(err);
              alert('Failed to upload PDF.');
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
    <>
        <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />  
        <div className="flex p-1 items-end">
          <button onClick={downloadPDF} className=" bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > Download PDF </button>
        </div>

      <div id="bill" className="p-4 max-w-5xl mx-auto">
        
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-2">
          <h2 className="text-2xl font-bold mb-4">Purchase Order: {data.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><span className="font-medium">Status:</span> {data.status}</div>
            <div><span className="font-medium">Delivery Date:</span> {data.delivery_date}</div>
            <div><span className="font-medium">Created By :</span> {data.creator.name}</div>
            <div><span className="font-medium">Supplier:</span> {data.supplier_name}</div>
            <div><span className="font-medium">Supplier Phone:</span> {data.supplier_phone}</div>
            <div><span className="font-medium">Created At:</span> {new Date(data.created_at).toLocaleString()}</div>

          </div>
        </div>

        {/* Cost Items */}
        <div className="bg-white shadow rounded-2xl p-3">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Cost Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                    <th className="py-2 px-4">#</th>
                    <th className="py-2 px-4">Item Name</th>
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4">Unit</th>
                    <th className="py-2 px-4">Unit Price (LKR)</th>
                    <th className="py-2 px-4">Total Amount (LKR)</th>
                </tr>
                </thead>
                <tbody>
                {data.cost_items.map((item, index) => (
                    <tr key={item.id} className="border-t text-gray-700 hover:bg-gray-50">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{item.item_name}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">{item.unit}</td>
                    <td className="py-2 px-4">{parseFloat(item.unit_price).toLocaleString()}</td>
                    <td className="py-2 px-4 font-semibold">
                        {parseFloat(item.total_amount).toLocaleString()}
                    </td>
                    </tr>
                ))}

                <tr>
                  <td colSpan={7} className="text-right font-semibold text-gray-700">
                    Total Amount LKR:{" "}
                    {data.cost_items    
                    .reduce((sum, item) => sum + parseFloat(item.total_amount), 0)
                    .toLocaleString("en-LK", {
                    
                        minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>

  
    </>
  )
}
