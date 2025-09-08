import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";

// Types
interface DroppedItem {
  id: string;
  fieldId: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ContractData {
  [key: string]: any;
}

// Helper to get nested values like "seller.fullName"
function getValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "";
}

function ContractPrintPage() {
  const { sellerName } = useParams<{ sellerName: string }>();
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [items, setItems] = useState<DroppedItem[]>([]);
  const [contractData, setContractData] = useState<ContractData>({});

  useEffect(() => {
    const fetchData = async () => {

      // Load layout from localStorage
      // const savedBg = localStorage.getItem("contractBg");
      // const savedInputs = localStorage.getItem("contractInputs");
      
        const response = await axios.get('/templates/company');
        const savedBg = response.data.data[response.data.data.length - 1].imageUrl;
        const savedInputs = response.data.data[response.data.data.length - 1].fields;
  
      if (savedBg) setBgImage(savedBg);
      if (savedInputs) {
        try {
          setItems(savedInputs);
        } catch (error) {
          console.error("Failed to parse saved inputs:", error);
        }
      }
  
      // TODO: fetch real contract by sellerName
      const responseContract = await axios.get('/contracts?sellerName=' + sellerName);
      const contract = responseContract.data.data[0];
      setContractData(contract || {});
      // setContractData({
      //   contractDate: "2025-09-05",
      //   contractNumber: "CNT-12345",
      //   seller: {
      //     fullName: sellerName,
      //     phone: "07701234567",
      //     nationalId: "S123456",
      //     address: "بغداد - الكرادة",
      //   },
      //   buyer: {
      //     fullName: "علي احمد",
      //     phone: "07801234567",
      //     nationalId: "B987654",
      //     address: "بغداد - المنصور",
      //   },
      //   car: {
      //     model: "Toyota Camry",
      //     plateNumber: "12-34567",
      //     color: "أبيض",
      //     year: "2022",
      //     chassisNumber: "CH1234567890",
      //   },
      //   paymentPlan: {
      //     status: "مدفوع جزئيًا",
      //     paidAmount: "10,000,000 IQD",
      //     remainingAmount: "5,000,000 IQD",
      //     paymentType: "نقدًا",
      //   },
      // });
    }
    fetchData();
  }, [sellerName]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div
        className="relative border border-gray-300 bg-white shadow-lg"
        style={{ width: 794, height: 1123 }}
      >
        {bgImage && (
          <img
            src={bgImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="absolute text-sm font-semibold text-gray-800"
            style={{
              top: item.y,
              left: item.x,
              width: item.width,
              height: item.height,
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              padding: "4px",
            }}
          >
            {getValue(contractData, item.fieldId) || item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContractPrintPage;
