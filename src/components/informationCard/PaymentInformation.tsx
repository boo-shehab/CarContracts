import { useEffect, useState } from 'react';
import InputField from '../Form/InputField';
import RadioInput from '../Form/RadioInput';
import CustomDatePicker from '../Form/DateFiled/CustomDatePicker';

export interface paymentInformationData {
  paymentMethod: 'cash' | 'installments';
  totalPrice: number | '';
  paidAmount: number | '';
  remainingAmount: number | '';
  installmentPayment: {
    numberOfInstallments: number | '';
    installmentPeriod: number | '';
    payments:
      | [
          {
            installmentNumber: number | '';
            dueDate: string | '';
          },
        ]
      | [];
  };
}

interface PaymentInformationProps {
  formData: paymentInformationData;
  setFormData: (data: any) => void;
}

function PaymentInformation({ formData, setFormData }: PaymentInformationProps) {
  const [lastChanged, setLastChanged] = useState<'total' | 'paid' | 'remaining' | null>(null);

  // Auto update related fields when values change
  useEffect(() => {
    const total = Number(formData.totalPrice) || 0;
    const paid = Number(formData.paidAmount) || 0;
    const remaining = Number(formData.remainingAmount) || 0;

    if (lastChanged === 'total') {
      const newRemaining = total - paid;
      setFormData((prev: any) => ({ ...prev, remainingAmount: newRemaining }));
    } else if (lastChanged === 'paid') {
      const newRemaining = total - paid;
      setFormData((prev: any) => ({ ...prev, remainingAmount: newRemaining }));
    } else if (lastChanged === 'remaining') {
      const newPaid = total - remaining;
      setFormData((prev: any) => ({ ...prev, paidAmount: newPaid }));
    }
  }, [
    formData.totalPrice,
    formData.paidAmount,
    formData.remainingAmount,
    lastChanged,
    setFormData,
  ]);
  useEffect(() => {
    if (formData.paymentMethod === 'installments') {
      const currentPayments = formData.installmentPayment.payments || [];
      const targetLength = Number(formData.installmentPayment.numberOfInstallments) || 0;
      let newPayments = [...currentPayments];

      if (currentPayments.length < targetLength) {
        // Add new payments at the end
        for (let i = currentPayments.length; i < targetLength; i++) {
          newPayments.push({
            installmentNumber: 0,
            dueDate: new Date().toISOString().split('T')[0],
          });
        }
      } else if (currentPayments.length > targetLength) {
        // Remove payments from the end
        newPayments = newPayments.slice(0, targetLength);
      }

      if (newPayments.length !== currentPayments.length) {
        setFormData((prev: any) => ({
          ...prev,
          installmentPayment: {
            ...prev.installmentPayment,
            payments: newPayments,
          },
        }));
      }
    }
  }, [
    formData.paymentMethod,
    formData.installmentPayment.numberOfInstallments,
    setFormData,
    formData.installmentPayment.payments,
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
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          name="paymentMethod"
          options={[
            { value: 'cash', label: 'نقد' },
            { value: 'installments', label: 'اقساط' },
          ]}
        />

        <div className="flex flex-col sm:flex-row gap-4 flex-wrap mb-4">
          <InputField
            value={formData.totalPrice}
            className="w-full"
            name="totalPrice"
            onChange={(e) => {
              handleInputChange(e.target.value, 'totalPrice');
              setLastChanged('total');
            }}
            label="المبلغ الكلي"
            placeholder="ادخل المبلغ الكلي"
            type="number"
          />
          <InputField
            value={formData.paidAmount}
            name="paidAmount"
            onChange={(e) => {
              handleInputChange(e.target.value, 'paidAmount');
              setLastChanged('paid');
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
          {formData.paymentMethod === 'installments' && (
            <InputField
              value={formData.installmentPayment.numberOfInstallments}
              name="numberOfInstallments"
              onChange={(e) => handleInputChange(e.target.value, '', 'numberOfInstallments')}
              label="عدد الاقساط"
              placeholder="ادخل عدد الاقساط"
              type="number"
            />
          )}
        </div>
        {formData.paymentMethod === 'installments' && (
          <div>
            <div className="flex items-center gap-2 text-2xl mb-4">
              <span>فترة التقسيط كل</span>
              <InputField
                value={formData.installmentPayment.installmentPeriod}
                name="installmentPeriod"
                onChange={(e) => handleInputChange(e.target.value, '', 'installmentPeriod')}
                type="number"
              />
              <span>يوم</span>
            </div>
            <div>
              {formData.installmentPayment.payments.map((payment, index) => (
                <div key={index} className="">
                  <span className="text-xl font-bold">الدفعة {index + 1}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <CustomDatePicker
                      value={payment.dueDate}
                      label="تاريخ الدفع"
                      onChange={(date: any) => {
                        const newPayments = [...formData.installmentPayment.payments];
                        newPayments[index].dueDate = date.target.value.toISOString().split('T')[0];
                        setFormData({
                          ...formData,
                          installmentPayment: {
                            ...formData.installmentPayment,
                            payments: newPayments,
                          },
                        });
                      }}
                      name={`dueDate-${index}`}
                    />
                    <InputField
                      value={payment.installmentNumber}
                      name={`installmentNumber`}
                      label="المبلغ المطلوب"
                      leftIcon={<span className="text-primary-500 bg-transparent">د.ع </span>}
                      type="number"
                      onChange={(e) =>
                        handleInputChange(e.target.value, '', 'installmentNumber', index)
                      }
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
