    // Firebase SDKs
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
    import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

    // ✅ Your Firebase Config
    const firebaseConfig = {
      apiKey: "AIzaSyCNCvaTbsB1B9xuRtvMiPGfOT4t9pa_o44",
      authDomain: "funlearn-828e1.firebaseapp.com",
      projectId: "funlearn-828e1",
      storageBucket: "funlearn-828e1.firebasestorage.app",
      messagingSenderId: "420097150565",
      appId: "1:420097150565:web:8a1b017bee62a74e18008c",
      measurementId: "G-LP8LD5RDP2"
    };

    // ✅ Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // ✅ Save Player Data Function
    async function savePlayerData() {
      const name = document.getElementById("playerName").value;
      const score = parseInt(document.getElementById("score").value);
      const level = parseInt(document.getElementById("level").value);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const dataRef = doc(db, "players", uid);
          await setDoc(dataRef, {
            name: name,
            score: score,
            level: level,
            updatedAt: new Date()
          });
          alert("✅ Game progress saved!");
        } else {
          alert("❌ You must be logged in to save!");
        }
      });
    }