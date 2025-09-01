import { useEffect, useRef, useState } from 'react';
import { GoBellFill } from 'react-icons/go';
import { BsInfoCircle, BsExclamationCircleFill } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import FilterIcon from '../assets/icons/FilterIcon';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { getMessaging, onMessage } from 'firebase/messaging';
import { app } from '../firebase';
import { hasPermission } from '../utilities/permissions';
import { ALL_PERMISSIONS } from '../utilities/allPermissions';

type Notification = {
  id: string;
  title: string;
  body: string;
  notificationDate: Date;
  permission?: string;
};

const NotificationsPopup = () => {
  const { notifications, loading } = useNotifications(0, 10); // backend notifications
  const [firebaseNotifications, setFirebaseNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  // Listen for Firebase notifications
  useEffect(() => {
    if(!hasPermission(ALL_PERMISSIONS.GET_NOTIFICATTIONS)) return
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      const notif: Notification = {
        id: `firebase-${Date.now()}`,
        title: payload.notification?.title || 'تنبيه',
        body: payload.notification?.body || '',
        notificationDate: new Date(),
        permission: 'info',
      };
      setFirebaseNotifications((prev) => [notif, ...prev]);
    });
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

  // Combine Firebase notifications (top) and backend notifications
  const allNotifications = [...firebaseNotifications, ...notifications];

  return (
    <div className="relative font-sans" ref={popupRef}>
      <button onClick={() => setOpen(!open)} className="relative">
        <GoBellFill size={24} className="text-primary-200" />
        {allNotifications.some((n) => !n.seen) && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
            {allNotifications.filter((n) => !n.seen).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 w-[610px] max-h-[860px] bg-white shadow-xl rounded-lg overflow-y-auto py-6 px-4 z-50">
          <div className="flex justify-between align-center mb-2">
            <div className="mb-4">
              <h1 className="font-bold text-gray-900 mb-1 text-2xl">الإشعارات</h1>
              <p className="text-blue-600 font-medium text-xl">
                لديك {allNotifications.filter((n) => !n.seen).length} إشعارات جديدة
              </p>
            </div>
            <FilterIcon
              className="text-neutral-400 hover:text-blue-500 cursor-pointer"
              onClick={() => {
                navigate('/notifications');
                setOpen(false);
              }}
            />
          </div>

          {loading && <div className="text-center py-4">جاري التحميل...</div>}

          {allNotifications.map((notif, i) => {
            let notifDate: Date | null = null;
            if (notif.notificationDate) {
              notifDate = new Date(notif.notificationDate);
              if (isNaN(notifDate.getTime())) notifDate = null;
            }
            return (
              <div
                key={notif.id}
                className={`border-t ${i === 0 ? 'border-none' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between gap-2 py-3">
                  <div className="flex-shrink-0 pt-1">{renderIcon(notif.permission)}</div>
                  <div className="flex-1 text-sm leading-6 text-right">
                    <div className="font-bold text-gray-800">{notif.title}</div>
                    <div
                      className="text-gray-800"
                      dangerouslySetInnerHTML={{ __html: notif.body }}
                    />
                    <div className="text-gray-400 text-xs mt-1">
                      {notifDate
                        ? formatDistanceToNow(notifDate, { addSuffix: true, locale: ar })
                        : 'تاريخ غير متوفر'}
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
