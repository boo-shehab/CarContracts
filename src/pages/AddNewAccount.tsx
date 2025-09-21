import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AddAccountInformation from '../components/informationCard/AddAccountInformation';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { AccountInformation } from '../components/informationCard/type';
import DocumentsInformation from '../components/informationCard/DocumentsInformation';
import {
  createNewAccount,
  deletePersonAttachment,
  getAccountById,
  updateAccount,
  updatePersonAttachment,
} from '../services/UserService';
import { printAccountDocs } from '../utilities/printAccountDocs';
import { toast } from 'react-toastify';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';

function getChangedFields(original: any, updated: any) {
  const changed: any = {};
  // check if the original and updated objects are the same
  if (JSON.stringify(original) === JSON.stringify(updated)) {
    return changed; // no changes
  }
  Object.keys(updated).forEach((key) => {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  });
  return changed;
}

function AddNewAccount() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Detect mode
  const isEdit = location.pathname.endsWith('/edit');
  const isView = location.pathname.endsWith('/view');

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<{
    nationalIdFrontFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    nationalIdBackFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    residenceCardFrontFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    residenceCardBackFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    othreFiles: Array<{id: string | number, docType: string, docSide: string, url: string} | null>;
  }>({
    nationalIdFrontFile: null,
    nationalIdBackFile: null,
    residenceCardFrontFile: null,
    residenceCardBackFile: null,
    othreFiles: [],
  });
  const [originalImages, setOriginalImages] = useState<{
    nationalIdFrontFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    nationalIdBackFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    residenceCardFrontFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    residenceCardBackFile: {id: string | number, docType: string, docSide: string, url: string} | null;
    othreFiles: Array<{id: string | number, docType: string, docSide: string, url: string} | null>;
  } | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [imagesValidation, setImagesValidation] = useState(false);

  const [accountInformation, setAccountInformation] = useState<AccountInformation>({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    fourthName: '',
    surname: '',
    nationalId: '',
    phoneNumber: '',
    residenceCardNo: '',
    residence: '',
    district: '',
    alley: '',
    houseNo: '',
    infoOffice: '',
    issuingAuthority: '',
  });
  const [originalAccountInformation, setOriginalAccountInformation] =
    useState<AccountInformation | null>(null);

  useEffect(() => {
    if (isView) {
      if (!hasPermission(ALL_PERMISSIONS.PERSON_READ)) {
        toast.error('ليس لديك إذن لعرض المستخدم');
        navigate('/');
      }
    } else if (isEdit) {
      if (!hasPermission(ALL_PERMISSIONS.PERSON_UPDATE)) {
        toast.error('ليس لديك إذن لتعديل المستخدم');
        navigate('/');
      }
    } else {
      if (!hasPermission(ALL_PERMISSIONS.PERSON_CREATE)) {
        toast.error('ليس لديك إذن لإنشاء مستخدم');
        navigate('/');
      }
    }
  }, [])

  // Fetch data if editing or viewing
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getAccountById(id)
        .then((res) => {
          const data = res.data.data;

          const info = {
            firstName: data.firstName || '',
            fatherName: data.fatherName || '',
            grandfatherName: data.grandfatherName || '',
            fourthName: data.fourthName || '',
            surname: data.surname || '',
            nationalId: data.nationalId || '',
            phoneNumber: data.phoneNumber || '',
            residenceCardNo: data.residenceCardNo || '',
            residence: data.residence || '',
            district: data.district || '',
            alley: data.alley || '',
            houseNo: data.houseNo || '',
            infoOffice: data.infoOffice || '',
            issuingAuthority: data.issuingAuthority || '',
          };
          setAccountInformation(info);
          setOriginalAccountInformation(info); // Save original for comparison

          // Set images if attachments exist
          const newImages: {
            nationalIdFrontFile: any | null;
            nationalIdBackFile: any | null;
            residenceCardFrontFile: any | null;
            residenceCardBackFile: any | null;
            othreFiles: any[];
          } = {
            nationalIdFrontFile: null,
            nationalIdBackFile: null,
            residenceCardFrontFile: null,
            residenceCardBackFile: null,
            othreFiles: [],
          };
          if (Array.isArray(data.attachments)) {
            data.attachments.forEach((attachment: any) => {
              const { docType, docSide, url } = attachment;
              if (docType === 'NATIONAL_ID' && docSide === 'FRONT') {
                newImages.nationalIdFrontFile = url;
              } else if (docType === 'NATIONAL_ID' && docSide === 'BACK') {
                newImages.nationalIdBackFile = url;
              } else if (docType === 'RESIDENCE_CARD' && docSide === 'FRONT') {
                newImages.residenceCardFrontFile = url;
              } else if (docType === 'RESIDENCE_CARD' && docSide === 'BACK') {
                newImages.residenceCardBackFile = url;
              } else {
                newImages.othreFiles.push(attachment);
              }
            });
          }
          setImages(newImages);
          setOriginalImages(newImages);

        })
        .catch((error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            'تعذر تحميل بيانات الحساب';
          toast.error(message);
          navigate(-1);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, navigate]);

  // Print handler
  const handlePrint = () => {
    printAccountDocs({
      nationalIdFrontFile: images.nationalIdFrontFile,
      nationalIdBackFile: images.nationalIdBackFile,
      residenceCardFrontFile: images.residenceCardFrontFile,
      residenceCardBackFile: images.residenceCardBackFile,
    });
  };

  const handleReturnedValue = (data: any) => {
    setAccountInformation({
      firstName: data.firstName,
      fatherName: data.fatherName,
      grandfatherName: data.grandfatherName,
      fourthName: data.fourthName,
      surname: data.surname,
      nationalId: data.nationalId,
      phoneNumber: data.phoneNumber,
      residenceCardNo: data.residenceCardNo,
      residence: data.residence,
      district: data.district,
      alley: data.alley,
      houseNo: data.houseNo,
      infoOffice: data.infoOffice,
      issuingAuthority: data.issuingAuthority,
    });

    const newImages: {
      nationalIdFrontFile: any | null;
      nationalIdBackFile: any | null;
      residenceCardFrontFile: any | null;
      residenceCardBackFile: any | null;
      othreFiles: any[];
    } = {
      nationalIdFrontFile: null,
      nationalIdBackFile: null,
      residenceCardFrontFile: null,
      residenceCardBackFile: null,
      othreFiles: [],
    };

    if (Array.isArray(data.attachments)) {
      data.attachments.forEach((attachment: any) => {
        const { docType, docSide, url } = attachment;
        if (docType === 'NATIONAL_ID' && docSide === 'FRONT') {
          newImages.nationalIdFrontFile = url;
        } else if (docType === 'NATIONAL_ID' && docSide === 'BACK') {
          newImages.nationalIdBackFile = url;
        } else if (docType === 'RESIDENCE_CARD' && docSide === 'FRONT') {
          newImages.residenceCardFrontFile = url;
        } else if (docType === 'RESIDENCE_CARD' && docSide === 'BACK') {
          newImages.residenceCardBackFile = url;
        } else {
          newImages.othreFiles.push(attachment);
        }
      });
    }
    setImages(newImages);
    setDisabled(true);
  };

  const isEqual = (imgSet1: any, imgSet2: any) => {
    return (
      JSON.stringify(imgSet1.nationalIdFrontFile) === JSON.stringify(imgSet2.nationalIdFrontFile) &&
      JSON.stringify(imgSet1.nationalIdBackFile) === JSON.stringify(imgSet2.nationalIdBackFile) &&
      JSON.stringify(imgSet1.residenceCardFrontFile) === JSON.stringify(imgSet2.residenceCardFrontFile) &&
      JSON.stringify(imgSet1.residenceCardBackFile) === JSON.stringify(imgSet2.residenceCardBackFile) &&
      JSON.stringify(imgSet1.othreFiles) === JSON.stringify(imgSet2.othreFiles)
    );
  };

  function getDeletedAttachments(original: any, updated: any) {
  const deleted: any[] = [];

  // Check other files
  const originalOthers = original?.othreFiles || [];
  const updatedOthers = updated?.othreFiles || [];

  originalOthers.forEach((file: any) => {
    if (!updatedOthers.find((f: any) => f?.id === file?.id)) {
      deleted.push(file);
    }
  });

  // Check single-file docs
  ["nationalIdFrontFile", "nationalIdBackFile", "residenceCardFrontFile", "residenceCardBackFile"].forEach((key) => {
    if (original?.[key]?.id && !updated?.[key]) {
      deleted.push(original[key]);
    }
  });

  return deleted;
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !imagesValidation) return;

    setIsLoading(true);
    try {
      // let response;
      if (isEdit && id) {
        // Only send changed fields for info
        const changedFields = getChangedFields(
          originalAccountInformation || {},
          accountInformation
        );
        // Check if any attachments have changed
        const attachmentChanged = !isEqual(originalImages, images);
        if (Object.keys(changedFields).length === 0 && !attachmentChanged) {
          toast.info('لا توجد تغييرات لتحديثها');
          setIsLoading(false);
          return;
        }
        // Update info if changed
        if (Object.keys(changedFields).length > 0) {
          await updateAccount(id, changedFields);
        }

        const deletedAttachments = getDeletedAttachments(originalImages, images);
        const deletePromises = deletedAttachments.map((file) =>
          deletePersonAttachment(id, file.id)
        );

        // Update attachments if changed
        const attachmentPromises = [];
        if (images?.nationalIdFrontFile instanceof File) {
          attachmentPromises.push(
            updatePersonAttachment(id, 'NATIONAL_ID', 'FRONT', images.nationalIdFrontFile)
          );
        }
        if (images?.nationalIdBackFile instanceof File) {
          attachmentPromises.push(
            updatePersonAttachment(id, 'NATIONAL_ID', 'BACK', images.nationalIdBackFile)
          );
        }
        if (images?.residenceCardFrontFile instanceof File) {
          attachmentPromises.push(
            updatePersonAttachment(id, 'RESIDENCE_CARD', 'FRONT', images.residenceCardFrontFile)
          );
        }
        if (images?.residenceCardBackFile instanceof File) {
          attachmentPromises.push(
            updatePersonAttachment(id, 'RESIDENCE_CARD', 'BACK', images.residenceCardBackFile)
          );
        }
        images.othreFiles.forEach((fileObj: any) => {
          if(typeof fileObj.url === 'string') return
          attachmentPromises.push(updatePersonAttachment(id, 'OTHER_FILE', 'OTHER', fileObj.url));
        })
        await Promise.all([ ...attachmentPromises, ...deletePromises ]);

        // You may want to show a toast here: "تم تعديل الحساب بنجاح"
      } else {
        await createNewAccount(accountInformation, images);
        // You may want to show a toast here: "تم اضافة الحساب بنجاح"
        toast.success('تم اضافة الحساب بنجاح');
      }
      navigate(-1);
    } catch (error: any) {
      console.error('Error saving account:', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'فشل في حفظ الحساب';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">
          {isView ? 'عرض بطاقة الحساب' : isEdit ? 'تعديل بطاقة الحساب' : 'بطاقة الحساب'}
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <AddAccountInformation
          formData={accountInformation}
          setFormData={setAccountInformation}
          onValidationChange={setIsFormValid}
          title={
            isView ? 'عرض معلومات الحساب' : isEdit ? 'تعديل معلومات الحساب' : 'اضف معلومات الحساب'
          }
          isLoading={isLoading}
          {...(!isEdit && !isView && { returnedValue: handleReturnedValue })}
          disabled={isView || disabled}
        />

        <DocumentsInformation
          formData={images}
          setFormData={setImages}
          imagesPath="url"
          isPerson={true}
          disabled={isView || disabled}
          onValidationChange={setImagesValidation}
          title="اضافة الملفات"
        />

        {isView ? (
          <button
            type="button"
            className="w-full rounded-lg px-4 py-2.5 text-white text-2xl bg-primary-500 hover:bg-primary-600"
            onClick={handlePrint}
          >
            طباعة المستندات
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isFormValid || !imagesValidation || isLoading}
            className="w-full rounded-lg px-4 py-2.5 text-white text-2xl bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed aria-pressed:bg-primary-700 "
          >
            {isLoading
              ? isEdit
                ? 'جاري التعديل...'
                : 'جاري الاضافة...'
              : isEdit
              ? 'تعديل'
              : 'اضافة'}
          </button>
        )}
      </form>
    </div>
  );
}

export default AddNewAccount;
