
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyD_dXT0Pcf_Ron9cyueiPVaPe6nz3hEHNo",
  authDomain: "carcontact-aeaed.firebaseapp.com",
  projectId: "carcontact-aeaed",
  messagingSenderId: "254427937407",
  appId: "1:254427937407:web:fab811b7528a62c6c85d4a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon
  });
});