import { useState, useEffect } from "react";
import axios from "../services/axios";

type Notification = {
  id: string;
  title: string;
  body: string;
  notificationDate: Date;
  permission?: string;
};

export type Pagination = {
  currentPage: number;
  lastPage: number;
  totalElements: number;
};

export function useNotifications(page: number = 0, pageSize: number = 10) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/notifications?page=${page}&size=${pageSize}`).then(res => {
      setNotifications(res.data.data);
      setPagination(res.data.pagination);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, pageSize]);

  return { notifications, pagination, loading };
}