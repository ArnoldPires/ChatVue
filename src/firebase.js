// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { ref, onUnmounted, computed } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyA6nyYQ9EQGZOEByNxj_s8CG9Uwx1vtmXY",
  authDomain: "chatvue-a3be2.firebaseapp.com",
  projectId: "chatvue-a3be2",
  storageBucket: "chatvue-a3be2.appspot.com",
  messagingSenderId: "603759873894",
  appId: "1:603759873894:web:fae84de1efb479db7202a7",
  measurementId: "G-2XZZHWEJ5C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export function useAuth() {
  const user = ref(null);
  const username = ref("");

  // Get the userName of user
  const fetchUsername = (uid) => {
    const docRef = doc(firestore, "users", uid);
    onSnapshot(docRef, (doc) => {
      username.value = doc.data()?.username;
    });
  };

  // If the user is logged in, fetch their username
  onAuthStateChanged(auth, (_user) => {
    if (_user) {
      user.value = _user;
      fetchUsername(_user.uid);
    } else {
      user.value = null;
      username.value = "";
    }
  });

  //Sign in with Google
  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  //Sign in with email and password
  const signInWithEmailAndPasswordMethod = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = () => {
    username.value = "";
    signOut(auth);
  };

  return {
    user,
    username,
    isLogin: computed(() => user.value !== null),
    signIn: signInWithEmailAndPasswordMethod,
    signInWithGoogle,
    signOut: signOutUser,
  };
}

// Handling the messages...storing them
export function useChat() {
  const messages = ref([]);
  const messagesCollection = collection(firestore, "messages");
  const messagesQuery = query(
    messagesCollection,
    orderBy("createdAt", "desc"),
    limit(100)
  );

  onSnapshot(messagesQuery, (snapshot) => {
    messages.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reverse();
  });
  const sendMessage = async (text) => {
    if (!user.value) return;
    const { photoURL, uid, displayName } = user.value;
    await addDoc(messagesCollection, {
      userName: displayName || username.value,
      userId: uid,
      userPhotoURL: photoURL,
      text: text,
      createdAt: serverTimestamp(),
    });
  };
  return { messages, sendMessage };
}

export { auth, firestore };
