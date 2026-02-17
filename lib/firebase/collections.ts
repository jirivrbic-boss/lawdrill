import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
  writeBatch
} from "firebase/firestore";
import { db } from "./config";
import type { StudySet, Question, Attempt, AIHint, User } from "./types";

// Helper pro konverzi Date <-> Timestamp
export const toFirestoreDate = (date: Date) => Timestamp.fromDate(date);
export const fromFirestoreDate = (timestamp: Timestamp) => timestamp.toDate();

// Helper pro získání db instance (pouze na klientovi)
function getDb() {
  if (!db) {
    throw new Error("Firestore není inicializován. Tato funkce může být volána pouze na klientovi.");
  }
  return db;
}

// Users kolekce
export const usersCollection = () => collection(getDb(), "users");

export async function getUser(uid: string): Promise<User | null> {
  const docRef = doc(getDb(), "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: fromFirestoreDate(data.createdAt),
    lastPracticeDate: data.lastPracticeDate ? fromFirestoreDate(data.lastPracticeDate) : undefined,
  } as User;
}

export async function createUser(uid: string, email: string, displayName?: string): Promise<void> {
  await updateDoc(doc(getDb(), "users", uid), {
    email,
    displayName,
    createdAt: toFirestoreDate(new Date()),
    streak: 0,
  });
}

export async function updateUserStreak(uid: string, streak: number, lastPracticeDate: Date): Promise<void> {
  await updateDoc(doc(getDb(), "users", uid), {
    streak,
    lastPracticeDate: toFirestoreDate(lastPracticeDate),
  });
}

// Sets kolekce
export const setsCollection = () => collection(getDb(), "sets");

export async function getSet(setId: string): Promise<StudySet | null> {
  const docRef = doc(getDb(), "sets", setId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    sourceBlocks: data.sourceBlocks.map((block: any) => ({
      ...block,
      importedAt: fromFirestoreDate(block.importedAt),
    })),
    createdAt: fromFirestoreDate(data.createdAt),
    updatedAt: fromFirestoreDate(data.updatedAt),
  } as StudySet;
}

export async function getUserSets(ownerId: string): Promise<StudySet[]> {
  const q = query(
    setsCollection(),
    where("ownerId", "==", ownerId),
    orderBy("updatedAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      sourceBlocks: data.sourceBlocks.map((block: any) => ({
        ...block,
        importedAt: fromFirestoreDate(block.importedAt),
      })),
      createdAt: fromFirestoreDate(data.createdAt),
      updatedAt: fromFirestoreDate(data.updatedAt),
    } as StudySet;
  });
}

export async function createSet(setData: Omit<StudySet, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(setsCollection(), {
    ...setData,
    sourceBlocks: setData.sourceBlocks.map((block) => ({
      ...block,
      importedAt: toFirestoreDate(block.importedAt),
    })),
    createdAt: toFirestoreDate(new Date()),
    updatedAt: toFirestoreDate(new Date()),
  });
  return docRef.id;
}

export async function updateSet(setId: string, updates: Partial<Omit<StudySet, "id" | "sourceBlocks" | "sourceVersion">>): Promise<void> {
  await updateDoc(doc(getDb(), "sets", setId), {
    ...updates,
    updatedAt: toFirestoreDate(new Date()),
  });
}

export async function deleteSet(setId: string): Promise<void> {
  await deleteDoc(doc(getDb(), "sets", setId));
}

// Questions kolekce
export const questionsCollection = () => collection(getDb(), "questions");

export async function getSetQuestions(setId: string): Promise<Question[]> {
  const q = query(
    questionsCollection(),
    where("setId", "==", setId),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: fromFirestoreDate(data.createdAt),
    } as Question;
  });
}

export async function createQuestion(questionData: Omit<Question, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(questionsCollection(), {
    ...questionData,
    createdAt: toFirestoreDate(new Date()),
  });
  return docRef.id;
}

export async function createQuestions(questions: Array<Omit<Question, "id" | "createdAt">>): Promise<void> {
  // Firestore batch write (max 500 operací)
  const batchWrite = writeBatch(getDb());
  const now = toFirestoreDate(new Date());
  
  questions.forEach((q) => {
    const docRef = doc(questionsCollection());
    batchWrite.set(docRef, {
      ...q,
      createdAt: now,
    });
  });
  
  await batchWrite.commit();
}

export async function deleteQuestion(questionId: string): Promise<void> {
  await deleteDoc(doc(getDb(), "questions", questionId));
}

// Attempts kolekce
export const attemptsCollection = () => collection(getDb(), "attempts");

export async function createAttempt(attemptData: Omit<Attempt, "id">): Promise<string> {
  const docRef = await addDoc(attemptsCollection(), {
    ...attemptData,
    startedAt: toFirestoreDate(attemptData.startedAt),
    finishedAt: attemptData.finishedAt ? toFirestoreDate(attemptData.finishedAt) : null,
    answers: attemptData.answers.map((a) => ({
      ...a,
      answeredAt: toFirestoreDate(a.answeredAt),
    })),
  });
  return docRef.id;
}

export async function getUserAttempts(ownerId: string, setId?: string): Promise<Attempt[]> {
  const constraints: QueryConstraint[] = [where("ownerId", "==", ownerId)];
  if (setId) {
    constraints.push(where("setId", "==", setId));
  }
  constraints.push(orderBy("startedAt", "desc"));
  const q = query(attemptsCollection(), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      startedAt: fromFirestoreDate(data.startedAt),
      finishedAt: data.finishedAt ? fromFirestoreDate(data.finishedAt) : undefined,
      answers: data.answers.map((a: any) => ({
        ...a,
        answeredAt: fromFirestoreDate(a.answeredAt),
      })),
    } as Attempt;
  });
}

// AI Hints kolekce
export const aiHintsCollection = () => collection(getDb(), "aiHints");

export async function getQuestionHint(questionId: string, ownerId: string): Promise<AIHint | null> {
  const q = query(
    aiHintsCollection(),
    where("questionId", "==", questionId),
    where("ownerId", "==", ownerId)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: fromFirestoreDate(data.createdAt),
  } as AIHint;
}

export async function createHint(hintData: Omit<AIHint, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(aiHintsCollection(), {
    ...hintData,
    createdAt: toFirestoreDate(new Date()),
  });
  return docRef.id;
}
