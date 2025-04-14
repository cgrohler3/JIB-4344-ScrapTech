import { Timestamp } from "firebase/firestore"

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function barLabels(time) {
    const date = new Date()
    const result = {
        labels: [],
        ts: ""
    }

    if (time == "Week") {
        date.setDate(date.getDate() - 7)
        date.setHours(0, 0, 0, 0)
        result["ts"] = Timestamp.fromDate(date)
        
        for (let i = 7; i != 0; i--) {
            result["labels"].push(days[date.getDay()])
            date.setDate(date.getDate() + 1)
        }
    } else if (time == "Month") {
        const monthAgo = new Date(new Date().setMonth(date.getMonth() - 1))
        monthAgo.setHours(0, 0, 0, 0)
        result["ts"] = Timestamp.fromDate(monthAgo)

        while (monthAgo <= date) {
            result["labels"].push(monthAgo.getDate().toString())
            monthAgo.setDate(monthAgo.getDate() + 1)
        }
        result["labels"].pop()
    } else if (time == "Year") {
        const yearAgo = new Date(new Date().setFullYear(date.getFullYear() - 1))
        yearAgo.setHours(0, 0, 0, 0)
        result["ts"] = Timestamp.fromDate(yearAgo)
        
        while (yearAgo <= date) {
            result["labels"].push(yearAgo.toLocaleString("default", { month: "short" }))
            yearAgo.setMonth(yearAgo.getMonth() + 1)
        }
        result["labels"].shift()
    }

    return result
}

export { barLabels }
