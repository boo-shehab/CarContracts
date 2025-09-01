import { MdKeyboardArrowRight } from "react-icons/md"
import { useNavigate } from "react-router-dom"
// import SelectField from "../components/Form/SelectField";
// import InputField from "../components/Form/InputField";
// import StartEndDate from "../components/Form/DateFiled/StartEndDatePicker";
import { useEffect, useState, useRef, useCallback } from "react";
import { BsExclamationCircleFill, BsInfoCircle } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import axios from "../services/axios";
import { hasPermission } from "../utilities/permissions";
import { ALL_PERMISSIONS } from "../utilities/allPermissions";
import { toast } from "react-toastify";


type Notification = {
  id: string;
  title: string;
  body: string;
  notificationDate: Date;
  permission?: string;
};

type Pagination = {
  currentPage: number;
  lastPage: number;
  totalElements: number;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 0, lastPage: 1, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNotifRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/notifications?page=${page}`);
      const { data, pagination: pag } = response.data;
      setNotifications(prev => page === 0 ? data : [...prev, ...data]);
      setPagination(pag);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications(0);
  }, [fetchNotifications]);

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.currentPage < pagination.lastPage) {
        fetchNotifications(pagination.currentPage + 1);
      }
    });

    if (lastNotifRef.current) {
      observer.current.observe(lastNotifRef.current);
    }
  }, [loading, pagination, fetchNotifications]);

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

    useEffect(() => {
      if(!hasPermission(ALL_PERMISSIONS.GET_NOTIFICATTIONS)) {
        toast.error("ليس لديك إذن لعرض الإشعارات");
        navigate(-1);
      }
    }, [])
  
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
        {/* <div
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
        </div> */}

        {/* Notifications */}
        <div className="flex-1 bg-white shadow-xl rounded-lg overflow-y-auto py-6 px-4">
          <div className="flex justify-between align-center mb-2">
            <div className="mb-4">
              <h1 className="font-bold text-gray-900 mb-1 text-2xl">الإشعارات</h1>
              {/* <p className="text-blue-600 font-medium text-xl">
                لديك {notifications.filter((n) => !n.seen).length} إشعارات جديدة
              </p> */}
            </div>
          </div>

          {notifications.map((notif, i) => {
            const isLast = i === notifications.length - 1;
            return (
              <div
                key={notif.id}
                className={`border-t ${i === 0 ? 'border-none' : 'border-gray-200'}`}
                ref={isLast ? lastNotifRef : null}
              >
                {i === 5 && (
                  <div className="my-4 pt-2 text-gray-800 font-semibold text-xl">هذا الاسبوع</div>
                )}

                <div className="flex items-start justify-between gap-2 py-3">
                  <div className="flex-shrink-0 pt-1">{renderIcon('')}</div>

                  <div className="flex-1 text-sm leading-6 text-right">
                    <div
                      dangerouslySetInnerHTML={{ __html: notif.body }}
                    />
                    <div className="text-gray-400 text-xs mt-1">
                      {formatDistanceToNow(notif.notificationDate, {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="text-center py-4 text-blue-600 font-bold">جاري التحميل...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications