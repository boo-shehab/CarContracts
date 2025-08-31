import { useEffect, useRef, useState } from 'react';
import InputField from '../Form/InputField';
import RadioInput from '../Form/RadioInput';
import CustomDatePicker from '../Form/DateFiled/CustomDatePicker';

export interface paymentInformationData {
  paymentType: 'CASH' | 'INSTALLMENT';
  totalAmount: number | '';
  downPayment: number | '';
  numberOfInstallments?: number | '';
  installmentPeriodDays?: number | '';
  firstInstallmentDate?: string | '';
  remainingAmount: number | '';
    installment?:
      | [
          {
            amount: number | '';
            dueDate: string | '';
          },
        ]
      | [];
}

interface PaymentInformationProps {
  formData: paymentInformationData;
  setFormData: (data: any) => void;
}

function PaymentInformation({ formData, setFormData }: PaymentInformationProps) {
  const [setLastChanged] = useState<'total' | 'down' | 'remaining' | any>(null);
  const userEditedInstallment = useRef(false);

  // Auto update related fields when values change
  useEffect(() => {
    const total = Number(formData.totalAmount) || 0;
    const down = Number(formData.downPayment) || 0;
    const remaining = total - down;

    setFormData((prev: any) => ({
      ...prev,
      remainingAmount: remaining,
    }));
  }, [formData.totalAmount, formData.downPayment]);
  useEffect(() => {
    if (
      formData.paymentType === 'INSTALLMENT' &&
      !userEditedInstallment.current
    ) {
      const targetLength = Number(formData.numberOfInstallments) || 0;
      const totalAmount = Number(formData.totalAmount) || 0;
      const downPayment = Number(formData.downPayment) || 0;
      const remainingAmountOriginal = totalAmount - downPayment;
      const minUnit = 250;

      const rawBase = remainingAmountOriginal / targetLength;
      const baseAmount = Math.floor(rawBase / minUnit) * minUnit;
      const distributedTotal = baseAmount * targetLength;
      const remainder = remainingAmountOriginal - distributedTotal;
      const extraUnits = Math.floor(remainder / minUnit);

      const newPayments: Array<{ amount: number | ''; dueDate: string | '' }> = [];

      const baseDate = formData.firstInstallmentDate
        ? new Date(formData.firstInstallmentDate)
        : new Date();

      const intervalDays = Number(formData.installmentPeriodDays) || 30;

      for (let i = 0; i < targetLength; i++) {
        const extra = i < extraUnits ? minUnit : 0;

        const due = new Date(baseDate);
        due.setDate(baseDate.getDate() + i * intervalDays);

        newPayments.push({
          amount: baseAmount + extra,
          dueDate: due.toISOString().split('T')[0],
        });
      }

      // 🔄 نحسب المجموع الجديد ونحدث remainingAmount بعد توزيع الأقساط
      const newSum = newPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const newRemaining = totalAmount - downPayment - newSum;

      setFormData((prev: any) => ({
        ...prev,
        installment: newPayments,
        remainingAmount: newRemaining,
      }));
    }

    userEditedInstallment.current = false;
  }, [
    formData.paymentType,
    formData.numberOfInstallments,
    formData.remainingAmount,
    formData.firstInstallmentDate,
    formData.installmentPeriodDays,
    formData.totalAmount,
    formData.downPayment,
  ]);


  useEffect(() => {
  if (
    formData.paymentType === 'INSTALLMENT' &&
    formData.firstInstallmentDate &&
    formData.installmentPeriodDays &&
    Array.isArray(formData.installment)
  ) {
    const baseDate = new Date(formData.firstInstallmentDate);
    const period = Number(formData.installmentPeriodDays);

    const updated = formData.installment.map((payment, index) => {
      const due = new Date(baseDate);
      due.setDate(baseDate.getDate() + index * period);
      return {
        ...payment,
        dueDate: due.toISOString().split('T')[0],
      };
    });

    setFormData((prev: any) => ({ ...prev, installment: updated }));
  }
}, [
  formData.firstInstallmentDate,
  formData.installmentPeriodDays,
  formData.numberOfInstallments,
  formData.paymentType,
]);

  const handleNumberInput = (value: string) => {
    if (value === '') return value;

    // Only digits allowed
    if (!/^\d+$/.test(value)) return null;

    // Allow '0' on its own
    if (value === '00') return value.slice(0, 1);

    // negative numbers are not allowed
    if (value.startsWith('-')) return null;

    // if value starts with '0' and is longer than 1 character, remove leading zeros
    if (value.startsWith('0') && value.length > 1) {
      value = value.replace(/^0+/, '');
    }

    return value;
  };

  const handleInputChange = (value: string, key: string, nestedKey?: string, index?: number) => {
    const cleanedValue = handleNumberInput(value);

    if (cleanedValue !== null) {
      setFormData((prev: any) => {
        if (nestedKey && typeof index === 'number') {
          // For payments array (installmentNumber)
          const newPayments = [...prev.installmentPayment.payments];
          newPayments[index][nestedKey] = cleanedValue;
          return {
            ...prev,
            installmentPayment: {
              ...prev.installmentPayment,
              payments: newPayments,
            },
          };
        } else if (nestedKey) {
          // For nested keys like installmentPayment.numberOfInstallments or installmentPeriod
          return {
            ...prev,
            installmentPayment: {
              ...prev.installmentPayment,
              [nestedKey]: cleanedValue,
            },
          };
        } else {
          // For top-level keys
          return {
            ...prev,
            [key]: cleanedValue,
          };
        }
      });
      setLastChanged(key as any);
    }
    
  };
  
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 my-4">
      <p className="text-2xl text-neutral-500 font-normal">طريقة البيع</p>
      <div className="mt-4">
        <RadioInput
          label=""
          value={formData.paymentType}
          onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
          name="paymentType"
          options={[
            { value: 'CASH', label: 'نقد' },
            { value: 'INSTALLMENT', label: 'اقساط' },
          ]}
        />

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.totalAmount}
            className="w-full"
            name="totalAmount"
            onChange={(e) => {
              handleInputChange(e.target.value, 'totalAmount');
              setLastChanged('total');
            }}
            label="المبلغ الكلي"
            placeholder="ادخل المبلغ الكلي"
            type="number"
          />
          <InputField
            value={formData.downPayment}
            name="downPayment"
            onChange={(e) => {
              handleInputChange(e.target.value, 'downPayment');
              setLastChanged('down');
            }}
            label="المبلغ المدفوع"
            placeholder="ادخل المبلغ المدفوع"
            type="number"
          />
          <InputField
            value={formData.remainingAmount}
            name="remainingAmount"
            onChange={(e) => {
              handleInputChange(e.target.value, 'remainingAmount');
              setLastChanged('remaining');
            }}
            label="المبلغ المتبقي"
            placeholder="ادخل المبلغ المتبقي"
            type="number"
          />
          {formData.paymentType === 'INSTALLMENT' && (
            <InputField
              value={formData.numberOfInstallments}
              name="numberOfInstallments"
              onChange={(e) => handleInputChange(e.target.value, 'numberOfInstallments')}
              label="عدد الاقساط"
              placeholder="ادخل عدد الاقساط"
              type="number"
            />
          )}
        </div>
        {formData.paymentType === 'INSTALLMENT' && (
          <div>
            <div className="flex items-center gap-2 text-2xl mb-4">
              <span>فترة التقسيط كل</span>
              <InputField
                value={formData.installmentPeriodDays}
                name="installmentPeriodDays"
                onChange={(e) => handleInputChange(e.target.value, 'installmentPeriodDays')}
                type="number"
              />
              <span>يوم</span>
            </div>
            <div>
              {formData.installment?.map((payment, index) => (
                <div key={index} className="">
                  <span className="text-xl font-bold">الدفعة {index + 1}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <CustomDatePicker
                      value={payment.dueDate}
                      label="تاريخ الدفع"
                      onChange={(date: any) => {
                        const newPayments = [...formData.installment ? formData.installment : []];
                        newPayments[index].dueDate = date.target.value.toISOString().split('T')[0];
                        setFormData({
                          ...formData,
                          installment: newPayments,
                        });
                      }}
                      name={`dueDate-${index}`}
                    />
                    <InputField
                      value={payment.amount}
                      name={`AMOUNT-${index}`}
                      label="المبلغ المطلوب"
                      leftIcon={<span className="text-primary-500 bg-transparent">د.ع </span>}
                      type="number"
                      onChange={(e) => {
                        userEditedInstallment.current = true; // 🔴 أعلِم أن المستخدم تدخل يدوياً

                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        const newPayments = [...formData.installment ? formData.installment : []];
                        newPayments[index].amount = value;

                        const total = Number(formData.totalAmount) || 0;
                        const paid = Number(formData.downPayment) || 0;
                        const sumInstallments = newPayments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
                        const remaining = total - paid - sumInstallments;

                        setFormData({
                          ...formData,
                          installment: newPayments,
                          remainingAmount: remaining,
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentInformation;
