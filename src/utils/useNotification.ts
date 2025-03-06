// import { useState, useEffect } from 'react';
// import axios from 'axios'; 

// const useNotifications = (userId: string) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const fetchNotifications = async (status?: string) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/v1/notifications`, {
//         params: { userId, status, limit: 10 } 
//       });
//       setNotifications(response.data.data.notifications);
//       setUnreadCount(response.data.total - response.data.data.notifications.filter(n => n.isReadByUser).length);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (notificationId: string) => {
//     try {
//       await axios.post(`/api/v1/notifications/${notificationId}/mark-read`, { userId });
//       fetchNotifications(); 
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, [userId]);

//   return { notifications, unreadCount, loading, fetchNotifications, markAsRead };
// };

// export default useNotifications;