import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import { Field } from "./types";

const ContractPrintDesigner = () => {
  const [availableFields, setAvailableFields] = useState<Field[]>([
  { id: "contractDate", label: "تاريخ العقد" },
  { id: "contractNumber", label: "رقم العقد" },
  { id: "seller.fullName", label: "اسم البائع" },
  { id: "seller.phone", label: "هاتف البائع" },
  { id: "seller.nationalId", label: "رقم هوية البائع" },
  { id: "seller.address", label: "عنوان البائع" },
  { id: "buyer.fullName", label: "اسم المشتري" },
  { id: "buyer.phone", label: "هاتف المشتري" },
  { id: "buyer.nationalId", label: "رقم هوية المشتري" },
  { id: "buyer.address", label: "عنوان المشتري" },
  { id: "car.model", label: "موديل السيارة" },
  { id: "car.plateNumber", label: "رقم اللوحة" },
  { id: "car.color", label: "لون السيارة" },
  { id: "car.year", label: "سنة الصنع" },
  { id: "car.chassisNumber", label: "رقم الشاصي" },
  { id: "paymentPlan.status", label: "حالة الدفع" },
  { id: "paymentPlan.paidAmount", label: "المبلغ المدفوع" },
  { id: "paymentPlan.remainingAmount", label: "المبلغ المتبقي" },
  { id: "paymentPlan.paymentType", label: "طريقة الدفع" },
]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar fields={availableFields} />
        <Canvas
          availableFields={availableFields}
          setAvailableFields={setAvailableFields}
        />
      </div>
    </DndProvider>
  );
};

export default ContractPrintDesigner;
