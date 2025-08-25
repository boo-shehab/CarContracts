import { MdKeyboardArrowRight } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import SelectField from "../components/Form/SelectField";
import InputField from "../components/Form/InputField";
import StartEndDate from "../components/Form/DateFiled/StartEndDatePicker";
import { useEffect, useState } from "react";
import { BsExclamationCircleFill, BsInfoCircle } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";


type Notification = {
  id: string;
  message: string;
  createdAt: Date;
  seen: boolean;
  type?: 'info' | 'error' | 'document' | 'login';
};

const Notifications = () => {  
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const navigate = useNavigate();
  
  
    useEffect(() => {
      // Fake data based on your screenshot
      const mockData: Notification[] = [
        {
          id: '1',
          message:
            'انشأ محمد علي <span class="text-blue-600 font-medium">عقدا جديداً</span> للبائع عباس محمد علي والمشتري سجاد كاظم محمد',
          createdAt: new Date(Date.now() - 1000 * 60 * 2),
          seen: false,
          type: 'document',
        },
        {
          id: '2',
          message:
            'قام علي محمد <span class="text-blue-600 font-medium">بتعديل العقد</span> المرقم 1234',
          createdAt: new Date(Date.now() - 1000 * 60 * 10),
          seen: false,
          type: 'document',
        },
        {
          id: '3',
          message:
            'أنشأ كرار عماد <span class="text-blue-600 font-medium">تخويل جديد</span> للسيارة المرقمة 6596390',
          createdAt: new Date(Date.now() - 1000 * 60 * 15),
          seen: false,
          type: 'document',
        },
        {
          id: '4',
          message:
            'أنشأ كرار عماد <span class="text-blue-600 font-medium">براءة الذمة</span> للعقد المرقم 1234',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          seen: false,
          type: 'document',
        },
        {
          id: '5',
          message:
            'تم تحديث تاريخ <span class="text-blue-600 font-medium">مستحقات الدفع</span> لهذا الأسبوع، اضغط هنا لمراجعة المدفوعات المستحقة',
          createdAt: new Date(Date.now() - 1000 * 60 * 40),
          seen: false,
          type: 'info',
        },
        {
          id: '6',
          message:
            'هناك <span class="text-red-600 font-medium">٣ مشتركين متأخرين في دفع القسط</span> ! اضغط للمتابعة',
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
          seen: false,
          type: 'error',
        },
        {
          id: '7',
          message:
            'قام محمد علي <span class="text-blue-600 font-medium">بتسجيل الدخول</span> الى حسابه',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          seen: true,
          type: 'login',
        },
        {
          id: '8',
          message:
            'قام محمد علي <span class="text-blue-600 font-medium">بتسجيل الدخول</span> الى حسابه',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          seen: true,
          type: 'login',
        },
      ];
  
      setNotifications(mockData);
    }, []);
  
    const renderIcon = (type?: string) => {
      switch (type) {
        case 'error':
          return <BsExclamationCircleFill className="text-red-500 text-xl" />;
        case 'document':
          return <HiOutlineDocumentText className="text-primary-500 text-xl" />;
        case 'info':
          return <BsInfoCircle className="text-blue-500 text-xl" />;
        case 'login':
          return <BsInfoCircle className="text-gray-400 text-xl" />;
        default:
          return <BsInfoCircle className="text-gray-400 text-xl" />;
      }
    };
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1 py-4 text-2xl">
        <MdKeyboardArrowRight onClick={() => navigate(-1)} size={40} className="cursor-pointer" />
        <h3 className="text-[28px]">
          الشعالرات
        </h3>
      </div>
      
      {/* Content Area */}
      <div className="flex flex-col md:flex-row w-full gap-4 mt-4 transition-all duration-500 ease-in-out">
        {/* Filters */}
        <div
          className={`transition-all duration-500 ease-in-out w-full md:w-[450px] h-auto opacity-100 translate-x-0`}
        >
          <div className="flex flex-col w-full border-none mb-4 gap-2 bg-white rounded-2xl p-2 shadow-[1px_2px_16px_0px_#4899EA1F]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xl font-bold">فلاتر</p>
            </div>
            <hr className="mb-2 border-t border-neutral-500" />
              <SelectField
                label="نوع النشاط"
                options={[
                  { value: "all", label: "الكل" },
                  { value: "created", label: "عقود جديدة" },
                  { value: "printed", label: "عقود مطبوعة" },
                ]}
              />
              <SelectField
                label="نوع العمليات"
                options={[
                  { value: "all", label: "الكل" },
                  { value: "created", label: "إنشاء" },
                  { value: "printed", label: "طباعة" },
                ]}
              />
              <InputField
                label="الاسم"
              />
              <StartEndDate
                label="تاريخ الشعارات"
              />
          </div>
        </div>

        {/* Notifications */}
        <div className="flex-1 bg-white shadow-xl rounded-lg overflow-y-auto py-6 px-4 z-50">
          <div className="flex justify-between align-center mb-2">
            <div className="mb-4">
              <h1 className="font-bold text-gray-900 mb-1 text-2xl">الإشعارات</h1>
              <p className="text-blue-600 font-medium text-xl">
                لديك {notifications.filter((n) => !n.seen).length} إشعارات جديدة
              </p>
            </div>
          </div>

          {notifications.map((notif, i) => {
            return (
              <div
                key={notif.id}
                className={`border-t ${i === 0 ? 'border-none' : 'border-gray-200'}`}
              >
                {i === 5 && (
                  <div className="my-4 pt-2 text-gray-800 font-semibold text-xl">هذا الاسبوع</div>
                )}

                <div className="flex items-start justify-between gap-2 py-3">
                  <div className="flex-shrink-0 pt-1">{renderIcon(notif.type)}</div>

                  <div className="flex-1 text-sm leading-6 text-right">
                    <div
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: notif.message }}
                    />
                    <div className="text-gray-400 text-xs mt-1">
                      {formatDistanceToNow(notif.createdAt, {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Notifications