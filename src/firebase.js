// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  getFirestore,
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

export function useAuth() {
  const user = ref(null);
  const unsubscribe = onAuthStateChanged(auth, (_user) => (user.value = _user));
  onUnmounted(unsubscribe);
  const isLogin = computed(() => user.value !== null);

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

  const signOutUser = () => signOut(auth);
  return {user, isLogin, signIn: signInWithEmailAndPasswordMethod, signInWithGoogle, signOut: signOutUser};
}

// Storing message logs
const firestore = getFirestore(app);
const messagesCollection = collection(firestore, "messages");
const messagesQuery = query(
  messagesCollection,
  orderBy("createdAt", "desc"),
  limit(100)
);

export function useChat() {
  const messages = ref([]);
  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    messages.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reverse();
  });
  onUnmounted(unsubscribe);

  //Grabing Google image icon and name based off of email login
  const { user, isLogin } = useAuth();
  const sendMessage = async (text) => {
    if (!isLogin.value) return;
    const { photoURL, uid, displayName } = user.value;
    await addDoc(messagesCollection, {
      userName: displayName,
      userId: uid,
      userPhotoURL: photoURL,
      text: text,
      createdAt: serverTimestamp(),
    });
  };

  return { messages, sendMessage };
}
