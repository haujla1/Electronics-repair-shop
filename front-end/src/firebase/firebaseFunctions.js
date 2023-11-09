import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithEmailAndPassword,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth'


export async function doCreateUserWithEmailAndPassword(email, password, displayName) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {displayName: displayName});
}

export async function doUpdatePassword(email, oldPassword, newPassword){
    const auth = getAuth()
    let credential = EmailAuthProvider.credential(email, oldPassword)
    await reauthenticateWithCredential(auth.credential, credential)
    await updatePassword(auth.currentUser, newPassword)
}

export async function dosignInWithEmailAndPassword(email, password){
    const auth = getAuth()
    await signInWithEmailAndPassword(auth, email, password)
}

export async function doSocialSignIn(){
    const auth = getAuth()
    let socialProvider = new GoogleAuthProvider()
    await signInWithPopup(auth, socialProvider)
}

export async function doPasswordReset(email){
    const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
}

export async function doSignOut(){
    const auth = getAuth()
    await signOut(auth)
}


