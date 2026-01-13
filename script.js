import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

/* 🔥 COLE A CONFIGURAÇÃO DO FIREBASE AQUI 🔥 */
const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  appId: "COLE_AQUI"
};
/* 🔥 FIM 🔥 */

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

/* LOGIN */
window.login = async () => {
  const email = email.value;
  const password = password.value;

  await signInWithEmailAndPassword(auth, email, password);

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  loadCalendar();
};

/* CALENDÁRIO */
function loadCalendar() {
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";

  for (let d = 1; d <= 31; d++) {
    const div = document.createElement("div");
    div.innerText = d;
    div.onclick = () => openDay(d);
    cal.appendChild(div);
  }
}

/* ABRIR DIA */
async function openDay(day) {
  const dateId = `2025-04-${String(day).padStart(2, "0")}`;

  dayTitle.innerText = dateId;
  dayView.style.display = "block";

  const snap = await getDoc(doc(db, "memories", dateId));
  text.value = snap.exists() ? snap.data().text || "" : "";
  showPhotos(snap.exists() ? snap.data().photos || [] : []);
}

/* UPLOAD */
async function uploadPhotos(dateId) {
  const files = photo.files;
  let urls = [];

  for (const file of files) {
    const r = ref(storage, `memories/${dateId}/${Date.now()}_${file.name}`);
    await uploadBytes(r, file);
    urls.push(await getDownloadURL(r));
  }
  return urls;
}

/* SALVAR */
window.saveDay = async () => {
  const dateId = dayTitle.innerText;
  const photoUrls = await uploadPhotos(dateId);

  await setDoc(doc(db, "memories", dateId), {
    text: text.value,
    photos: photoUrls
  });

  showPhotos(photoUrls);
  alert("Salvo ❤️");
};

/* MOSTRAR FOTOS */
function showPhotos(urls) {
  photos.innerHTML = "";
  urls.forEach(u => {
    const img = document.createElement("img");
    img.src = u;
    photos.appendChild(img);
  });
}
