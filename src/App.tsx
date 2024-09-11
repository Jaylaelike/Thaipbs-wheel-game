import  { useState, useCallback } from 'react';
import { Loader2, Upload } from 'lucide-react';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const parsedEmployees = lines.slice(1).map(line => {
            const [timestamp, firstname, employeeId, department, learningChannel] = line.split(',').map(item => item.trim());
            if (!timestamp || !firstname || !employeeId || !department) {
              throw new Error('Invalid CSV format');
            }
            return { timestamp, firstname, employeeId, department, learningChannel: learningChannel || 'N/A' };
          }).filter(employee => employee.employeeId);

          if (parsedEmployees.length === 0) {
            throw new Error('No valid employees found in CSV');
          }

          setEmployees(parsedEmployees);
          setError(null);
        } catch (err) {
          setError(err.message);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const spinWheel = useCallback(() => {
    if (employees.length === 0) {
      setError('Please upload a CSV file first');
      return;
    }

    setIsSpinning(true);
    setSelectedEmployee(null);
    setError(null);

    const randomIndex = Math.floor(Math.random() * employees.length);
    const chosenEmployee = employees[randomIndex];

    setTimeout(() => {
      setSelectedEmployee(chosenEmployee);
      setIsSpinning(false);
    }, 2000);
  }, [employees]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">สุ่มผู้โชคดี</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 mb-2">
            อัพโหลดไฟล์ CSV
          </label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดหรือลากและวาง</p>
                <p className="text-xs text-gray-500">ไฟล์ CSV (ข้อมูลพนักงาน)</p>
              </div>
              <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
        <div className="mb-6 min-h-40 flex flex-col items-center justify-center">
          {isSpinning ? (
            <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
          ) : selectedEmployee ? (
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">{selectedEmployee.firstname}</p>
              <p className="text-sm text-gray-600">รหัสพนักงาน: {selectedEmployee.employeeId}</p>
              <p className="text-sm text-gray-600">ส่วนงาน: {selectedEmployee.department}</p>
              <p className="text-sm text-gray-600">ช่องทางการเรียน: {selectedEmployee.learningChannel}</p>
              <p className="text-xs text-gray-500 mt-2">เวลา: {selectedEmployee.timestamp}</p>
            </div>
          ) : (
            <p className="text-gray-500">{employees.length > 0 ? 'หมุนวงล้อ!' : 'อัพโหลด CSV เพื่อเริ่ม'}</p>
          )}
        </div>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <button
          onClick={spinWheel}
          disabled={isSpinning || employees.length === 0}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? 'กำลังหมุน...' : 'หมุน'}
        </button>
      </div>
    </div>
  );
};

export default App;