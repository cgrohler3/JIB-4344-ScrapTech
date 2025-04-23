import { auth, db } from '../lib/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { onAuthStateChanged } from 'firebase/auth'

function verifyUser() {
    const [email, setEmail] = useState('')
    const [employees, setEmployees] = useState([])

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setEmail(user.email)
        }
    })

    useEffect(() => {
        const getEmployees = async () => {
            const qryRef = query(collection(db, "users"), where("type", "==", "employee"))
            const qrySnap = await getDocs(qryRef)

            const docs = []
            qrySnap.forEach((doc) => {
                docs.push(doc.data().email)
            })
            setEmployees(docs)
        }

        getEmployees();
    }, []);

    return (employees.includes(email))
}

export { verifyUser }
