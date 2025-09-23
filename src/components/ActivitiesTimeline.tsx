import { Timeline } from 'antd';
import { useEffect, useState } from 'react';
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
  details?: any; // Add details field here
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
  const [logGroups, setLogGroups] = useState<{ dateGroup: string; activities: logData[] }[]>([]);

  useEffect(() => {
    const getLog = async () => {
      try {
        const response = await axios.get('/Log');
        const logs: logData[] = response.data?.data || [];
        setLogGroups(groupLogsByDate(logs));
      } catch (e) {
        console.log(e);
      }
    };
    getLog();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 mx-auto w-full shadow">
      <h2 className="text-blue-600 font-bold text-xl mb-4">نشاطاتي</h2>

      {logGroups
        .filter((group) => group.activities.length > 0)
        .map((group, idx) => (
          <div key={idx} className="timeline_container">
            <h3 className="text-xl font-medium text-neutral-600 mb-2">{group.dateGroup}</h3>
            <Timeline
              mode="left"
              items={group.activities.map((log) => ({
                children: <span className="text-sm text-gray-800">{formatLogMessage(log)}</span>,
                label: (
                  <span className="text-xs text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                ),
              }))}
            />
          </div>
        ))}
    </div>
  );
}
