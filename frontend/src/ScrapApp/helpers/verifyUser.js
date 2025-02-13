import { auth, db } from '../lib/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
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
            const snapshot = await getDocs(collection(db, 'employees'))
            const docs = []
            snapshot.forEach((doc) => {
                docs.push(doc.data().email)
            })
            setEmployees(docs)
        }

        getEmployees();
    }, []);

    console.log(employees)
    return (employees.includes(email))
}

export { verifyUser }