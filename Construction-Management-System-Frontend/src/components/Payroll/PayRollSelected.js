import React, { useState, useEffect,useRef } from "react";
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import ResponseMessages from '../ResponseMessages';
import Loading from "../Loading";

export default function PayRollSelected(props) {

  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [loading, setLoading] = useState(true);
  const [payroll, setPayroll] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/payroll-selected/${props.selectedPayRoll}`,
              {
                headers: {  Authorization: `Bearer ${sessionStorage.getItem('token')}` },
              }
            );
            setPayroll(response.data);

          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        };
    
        fetchData();
      }, [props.selectedPayRoll]);


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
            const fileName = `Bill-${payroll.id || 'details'}.pdf`;

            const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

            formData.append('project_id', payroll.project_id);
            formData.append('doc_type', 'PayRoll');
            formData.append('doc_path[]',pdfFile);
            formData.append('doc_referenced_id', payroll.id); 
    
            axios.post('http://127.0.0.1:8000/api/new-document', formData, {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem('token')}` ,
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

    <div  id="bill" className="max-w-xl mx-auto mt-2 bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payroll Invoice</h2>
          <p className="text-sm text-gray-500">#INV-{payroll.user.name}</p> 
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Worked Date:</p>
          <p className="font-medium">{payroll.worked_date}</p>
        </div>
      </div>

      {/* Divider */}
      <hr className="mb-6" />

      {/* Payroll Details */}
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Wage Type</span>
          <span className="font-medium">{payroll.wagetype}</span>
        </div>
        <div className="flex justify-between">
          <span>Wage Rate</span>
          <span className="font-medium">Rs. {parseFloat(payroll.wage_rate).toFixed(2)} /hr</span>
        </div>
        <div className="flex justify-between">
          <span>Worked Hours</span>
          <span className="font-medium">{parseFloat(payroll.worked_hours).toFixed(2)} hrs</span>
        </div>
        <div className="flex justify-between">
          <span>Status</span>
          <span className={`font-medium ${payroll.status === 'Pending' ? 'text-yellow-600' : 'text-green-600'}`}>
            {payroll.status}
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6" />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold text-gray-800">
        <span>Total Earned</span>
        <span>Rs. {parseFloat(payroll.total_earned).toFixed(2)}</span>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        Created at: {new Date(payroll.created_at).toLocaleString()}
      </div>
    </div>

    </div>
  )
}
