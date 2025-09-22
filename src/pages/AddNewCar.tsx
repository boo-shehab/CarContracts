import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdKeyboardArrowRight } from 'react-icons/md';

import AddCarInformation from '../components/informationCard/AddCarInformation';
import DocumentsInformation from '../components/informationCard/DocumentsInformation';
import { CarInformation } from '../components/informationCard/type';
import { createNewCar } from '../services/UserService';
import {
  deleteCarAttachment,
  getCarById,
  updateCar,
  uploadCarAttachments,
} from '../services/CarService';
import { getChangedFields } from '../utilities/getChangedFields';
import { mapCarFields } from '../utilities/mapCarFields';

const initialValues: CarInformation = {
  name: '',
  type: '',
  color: '',
  model: '',
  chassisNumber: '',
  plateNumber: '',
  engineType: '',
  passengerCount: 1,
  cylinderCount: 2,
  kilometers: 0,
  origin: '',
};

function AddNewCar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isEdit = location.pathname.endsWith('/edit');
  const isView = location.pathname.endsWith('/view');

  const [isLoading, setIsLoading] = useState(false);
  const [carInformation, setCarInformation] = useState<CarInformation>(initialValues);
  const [originalCarInformation, setOriginalCarInformation] = useState<CarInformation | null>(null);

  // Images: track both old and new
  const [images, setImages] = useState<
    (File | { id: string | number; fileKey: string; mimeType: string })[]
  >([]);
  const [originalImages, setOriginalImages] = useState<
    { id: string | number; fileKey: string; mimeType: string }[]
  >([]);

  const [isCarInfoValid, setIsCarInfoValid] = useState(false);
  const [imagesChanged, setImagesChanged] = useState(false);

  // Load data if editing
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getCarById(id)
        .then((res) => {
          const data = res.data.data;
          const info: CarInformation = { ...mapCarFields(data) };
          setCarInformation(info);
          setOriginalCarInformation(info);

          const attachments = data.attachments || [];
          setImages(attachments);
          setOriginalImages(attachments);
        })
        .catch(() => toast.error('تعذر تحميل بيانات السيارة'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  // Track image changes to enable submit button
  useEffect(() => {
    const changed =
      images.length !== originalImages.length ||
      images.some((img) => {
        // New File objects are considered changed
        if (img instanceof File) return true;

        // Existing attachments: check if it still exists in original
        return !originalImages.some((orig) => orig.id === img.id);
      });
    setImagesChanged(changed);
  }, [images, originalImages]);

  // Utility to get deleted images
  function getDeletedCarImages(original: any[], updated: any[]) {
    return original.filter((orig) => !updated.some((upd) => upd.id === orig.id));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCarInfoValid && !imagesChanged) return;

    setIsLoading(true);
    try {
      if (isEdit && id) {
        // Update car info if changed
        const changedFields = getChangedFields(originalCarInformation || {}, carInformation);
        if (Object.keys(changedFields).length > 0) {
          await updateCar(id, changedFields);
        }

        // Handle deleted images
        const deletedImages = getDeletedCarImages(originalImages, images);
        for (const img of deletedImages) {
          // You need a deleteCarAttachment service
          await deleteCarAttachment(id, img.id);
        }

        // Handle new images (File objects)
        const newFiles = images.filter((img: any) => typeof img.fileKey !== 'string') as File[];
        if (newFiles.length > 0) {
          // You need an uploadCarAttachments service that accepts FormData
          const formData = new FormData();
          newFiles.forEach((file: any) => formData.append('files', file.fileKey));
          await uploadCarAttachments(id, formData as any);
        }
        // reset original states
        const updatedCar = await getCarById(id);
        const data = updatedCar.data.data;
        const info: CarInformation = { ...mapCarFields(data) };
        setCarInformation(info);
        setOriginalCarInformation(info);

        const attachments = data.attachments || [];
        setImages(attachments);
        setOriginalImages(attachments);

        toast.success('تم تعديل السيارة بنجاح');
      } else {
        // For new car, send all images as files
        const newFiles = images.filter((img) => img instanceof File) as File[];
        await createNewCar(carInformation, newFiles);
        toast.success('تم اضافة السيارة بنجاح');
      }
      // navigate(-1);
    } catch {
      toast.error('فشل في حفظ السيارة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">بطاقة السيارة</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <AddCarInformation
          title={isEdit ? 'تعديل سيارة' : isView ? 'عرض سيارة' : 'إضافة سيارة جديدة'}
          formData={carInformation}
          setFormData={(field: string, value: any) =>
            setCarInformation((prev) => ({ ...prev, [field]: value }))
          }
          onValidate={setIsCarInfoValid}
          isLoading={isLoading}
          disabled={isView}
        />

        <DocumentsInformation
          title="اضافة الملفات"
          imagesPath="fileKey"
          formData={{ othreFiles: images }}
          setFormData={(data: any) => {
            data.othreFiles.map((d: any) => {
              console.log(d);
            });
            setImages(data.othreFiles);
          }}
          isPerson={false}
        />

        {!isView && (
          <button
            type="submit"
            disabled={isLoading || (!isCarInfoValid && !imagesChanged)}
            className={`w-full rounded-lg px-4 py-2.5 text-white text-2xl ${
              isLoading || (!isCarInfoValid && !imagesChanged)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 aria-pressed:bg-primary-700'
            }`}
          >
            {isEdit
              ? isLoading
                ? 'جارٍ التعديل...'
                : 'تعديل'
              : isLoading
              ? 'جارٍ الإضافة...'
              : 'إضافة'}
          </button>
        )}
      </form>
    </div>
  );
}

export default AddNewCar;
