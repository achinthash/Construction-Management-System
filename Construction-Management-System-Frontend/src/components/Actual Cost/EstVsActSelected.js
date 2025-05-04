import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

import ResponseMessages from '../ResponseMessages';
import Loading from "../Loading";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function EstVsActSelected(props) {

    const token = sessionStorage.getItem("token") || "";
    const [loading, setLoading] = useState(true);
    const [estimated, setPO] = useState([]);

    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/estimation-actual-selected/${props.selectedEstVact}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setPO(response.data);

          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, [props.selectedEstVact]);


      const estTotal = parseFloat(estimated.total_cost);
      const actTotal = estimated.actual_cost ? parseFloat(estimated.actual_cost.total_cost) : 0;

      const difference = actTotal - estTotal;
    
      const getStatusBadge = () => {
        if (difference > 0) return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Over Budget</span>;
        if (difference < 0) return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Under Budget</span>;
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">On Budget</span>;
      };


      // download and updload pdf
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
            const fileName = `Estimation vs Actual Cost-${estimated.id || 'details'}.pdf`;

            const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

            formData.append('project_id', estimated.project_id);
            formData.append('doc_type', 'Estimation vs Actual Cost');
            formData.append('doc_path[]',pdfFile);
            formData.append('doc_referenced_id', estimated.id); 
    
            axios.post('http://127.0.0.1:8000/api/new-document', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
    return (
        <Loading />
    );
}

  return (
    <div>

      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

      <div className="flex p-1 items-end">
        <button onClick={downloadPDF} className=" bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" > Download PDF </button>
      </div>


    <div  id="bill" className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-2xl border space-y-6 max-h-[80vh] overflow-y-auto ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{estimated.title}</h2>
        {getStatusBadge()}
      </div>

      {/* Info Section */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Description:</strong> {estimated.description}</p>
        <p><strong>Task:</strong> {estimated.task?.name}</p>
        <p><strong>Project:</strong> {estimated.project?.name}</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimated */}
        <div className="bg-gray-50 p-5 rounded-xl border space-y-2">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Estimated Cost</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex justify-between"><span>Cost Type:</span><span>{estimated.cost_type}</span></div>
            <div className="flex justify-between"><span>Unit:</span><span>{estimated.unit}</span></div>
            <div className="flex justify-between"><span>Quantity:</span><span>{estimated.quantity}</span></div>
            <div className="flex justify-between"><span>Unit Price:</span><span>Rs. {parseFloat(estimated.unit_price).toFixed(2)}</span></div>
            <div className="flex justify-between font-bold"><span>Total Cost:</span><span>Rs. {estTotal.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Actual */}
        <div className="bg-gray-50 p-5 rounded-xl border space-y-2">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Actual Cost</h3>
          {estimated.actual_cost ? (
    <div className="text-sm text-gray-700 space-y-1">
      <div className="flex justify-between"><span>Cost Type:</span><span>{estimated.actual_cost.cost_type}</span></div>
      <div className="flex justify-between"><span>Unit:</span><span>{estimated.actual_cost.unit}</span></div>
      <div className="flex justify-between"><span>Quantity:</span><span>{estimated.actual_cost.quantity}</span></div>
      <div className="flex justify-between"><span>Unit Price:</span><span>Rs. {parseFloat(estimated.actual_cost.unit_price).toFixed(2)}</span></div>
      <div className="flex justify-between font-bold"><span>Total Cost:</span><span>Rs. {parseFloat(estimated.actual_cost.total_cost).toFixed(2)}</span></div>
    </div>
  ) : (
    <div className="text-sm text-gray-500 italic">Actual cost data not available.</div>
  )}
        </div>
      </div>

      {/* Cost Difference Section */}
      <div className="mt-4 pt-4 border-t text-sm text-gray-700 space-y-2">
        <div className="flex justify-between"><span>Reason:</span>   <span>{estimated.actual_cost ? estimated.actual_cost.reason : "N/A"}</span> </div>
        <div className="flex justify-between font-semibold">
          <span>Cost Difference:</span>
          <div className="flex justify-between font-semibold">
    <span>Cost Difference:</span>
    <span className={
      !estimated.actual_cost ? "text-gray-400"
        : difference > 0 ? "text-red-600"
        : difference < 0 ? "text-green-600"
        : "text-blue-600"
    }>
      {!estimated.actual_cost
        ? "N/A"
        : difference === 0
        ? 'Rs. 0.00'
        : `Rs. ${Math.abs(difference).toFixed(2)} ${difference > 0 ? 'Over' : 'Saved'}`}
    </span>
  </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t text-xs text-gray-500 text-center">
        Created: {new Date(estimated.created_at).toLocaleString()} &nbsp;|&nbsp;
        Updated: {new Date(estimated.updated_at).toLocaleString()}
      </div>
    </div>
    </div>
  )
}
