import { Timeline, Spin } from 'antd';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from '../services/axios';
import { OPERATION_LABELS } from '../constants/operationLabels';

interface logData {
  id: number;
  companyId: number;
  username: string;
  operation: string;
  method: string;
  success: boolean;
  timestamp: string;
  details?: any;
}

interface Pagination {
  currentPage: number;
  lastPage: number;
  totalElements: number;
}

function groupLogsByDate(logs: logData[]) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const groups: { [key: string]: logData[] } = {
    اليوم: [],
    الأمس: [],
    'الأسبوع الماضي': [],
  };

  logs.forEach((log) => {
    const logDate = new Date(log.timestamp);
    if (isSameDay(logDate, today)) {
      groups['اليوم'].push(log);
    } else if (isSameDay(logDate, yesterday)) {
      groups['الأمس'].push(log);
    } else {
      groups['الأسبوع الماضي'].push(log);
    }
  });

  return [
    { dateGroup: 'اليوم', activities: groups['اليوم'] },
    { dateGroup: 'الأمس', activities: groups['الأمس'] },
    { dateGroup: 'الأسبوع الماضي', activities: groups['الأسبوع الماضي'] },
  ];
}

function formatLogMessage(log: logData) {
  const username = <span className="font-bold text-primary-600">{log.username}</span>;

  if (log.operation === 'ADD_CONTRACT' && log.details?.contractNumber) {
    return (
      <>
        {username} قام بإنشاء عقد جديد{' '}
        <span className="text-blue-600 underline cursor-pointer">عقد جديد</span> برقم{' '}
        {log.details.contractNumber}
      </>
    );
  }
  if (log.operation === 'GET_CONTRACT' && log.details?.buyerName && log.details?.contractNumber) {
    return (
      <>
        {username} قام <span className="text-blue-600 underline cursor-pointer">بطباعة عقد</span>{' '}
        باسم {log.details.buyerName} على الرقم {log.details.contractNumber}
      </>
    );
  }
  // Fallback to label
  return (
    <>
      {username} {OPERATION_LABELS[log.operation] || log.operation}
    </>
  );
}

export default function ActivitiesTimeline() {
  const [logs, setLogs] = useState<logData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 0,
    lastPage: 1,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchLogs = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const response = await axios.get('/Log', { params: { page, size: 20 } });
      const newLogs: logData[] = response.data?.data || [];
      const pag: Pagination = response.data?.pagination || {
        currentPage: page,
        lastPage: page,
        totalElements: 0,
      };

      setLogs((prev) => (page === 0 ? newLogs : [...prev, ...newLogs]));
      setPagination(pag);
      setHasMore(pag.currentPage < pag.lastPage);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  // Infinite scroll handler
  useEffect(() => {
  const handleScroll = () => {
    if (loading || !hasMore) return;

    // distance from bottom of page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      fetchLogs(pagination.currentPage + 1);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [fetchLogs, loading, hasMore, pagination.currentPage]);


  const logGroups = groupLogsByDate(logs);

  return (
    <div
      className="bg-white rounded-lg p-4 mx-auto w-full shadow"
      ref={containerRef}
    >
      <h2 className="text-blue-600 font-bold text-xl mb-4">نشاطاتي</h2>

      {logGroups
        .filter((group) => group.activities.length > 0)
        .map((group, idx) => (
          <div key={idx} className="timeline_container">
            <h3 className="text-xl font-medium text-neutral-600 mb-4">{group.dateGroup}</h3>
            <Timeline
              mode="left"
              items={group.activities.map((log) => ({
                children: <span className="text-sm text-gray-800">{formatLogMessage(log)}</span>,
                label: (
                  <span className="text-xs text-gray-400">
                    {new Date(log.timestamp).toLocaleString([], {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ),
              }))}
            />
          </div>
        ))}
      {loading && (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      )}
      {!hasMore && !loading && logs.length === 0 && (
        <div className="text-center text-gray-400 py-8">لا يوجد نشاطات</div>
      )}
    </div>
  );
}
