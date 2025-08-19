import { useEffect, useRef, useState } from 'react';
import { GoBellFill } from 'react-icons/go';
import { BsInfoCircle, BsExclamationCircleFill } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import FilterIcon from '../assets/icons/FilterIcon';
import { useNavigate } from 'react-router-dom';

type Notification = {
  id: string;
  message: string;
  createdAt: Date;
  seen: boolean;
  type?: 'info' | 'error' | 'document' | 'login';
};

const NotificationsPopup = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const popupRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

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
    <div className="relative font-sans" ref={popupRef}>
      <button onClick={() => setOpen(!open)} className="relative">
        <GoBellFill size={24} className="text-primary-200" />
        {notifications.some((n) => !n.seen) && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
            {notifications.filter((n) => !n.seen).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 w-[610px] max-h-[860px] bg-white shadow-xl rounded-lg overflow-y-auto py-6 px-4 z-50">
          <div className="flex justify-between align-center mb-2">
            <div className="mb-4">
              <h1 className="font-bold text-gray-900 mb-1 text-2xl">الإشعارات</h1>
              <p className="text-blue-600 font-medium text-xl">
                لديك {notifications.filter((n) => !n.seen).length} إشعارات جديدة
              </p>
            </div>
            <FilterIcon
              className="text-neutral-400 hover:text-blue-500 cursor-pointer"
              onClick={() => navigate('/notifications')}
            />
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
      )}
    </div>
  );
};

export default NotificationsPopup;
