let appointments = [];

/* =======================
   DOCTORS DATABASE
======================= */
const doctors = [
    { id: 1, name: "Dr. Ramesh", spec: "Cardiologist" },
    { id: 2, name: "Dr. Anjali", spec: "Cardiologist" },

    { id: 3, name: "Dr. Sneha", spec: "Dermatologist" },
    { id: 4, name: "Dr. Pooja", spec: "Dermatologist" },

    { id: 5, name: "Dr. Kiran", spec: "General Physician" },
    { id: 6, name: "Dr. Rahul", spec: "General Physician" },

    { id: 7, name: "Dr. Arjun", spec: "Orthopedic" },
    { id: 8, name: "Dr. Meena", spec: "Orthopedic" },

    { id: 9, name: "Dr. Priya", spec: "ENT" },
    { id: 10, name: "Dr. Suresh", spec: "ENT" }
];

/* =======================
   SCHEDULES
======================= */
const schedules = {};
doctors.forEach(d => {
    schedules[d.id] = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00"];
});

/* =======================
   DISEASE → SPECIALIZATION
======================= */
const diseaseMap = {
    heart: "Cardiologist",
    chest: "Cardiologist",
    bp: "Cardiologist",

    rash: "Dermatologist",
    rashes: "Dermatologist",
    skin: "Dermatologist",

    fever: "General Physician",
    cold: "General Physician",
    pain: "General Physician",

    bone: "Orthopedic",
    fracture: "Orthopedic",

    ear: "ENT",
    nose: "ENT",
    throat: "ENT"
};

/* =======================
   DATE FIX (NO PAST)
======================= */
const dateInput = document.getElementById("appointmentDate");
dateInput.min = new Date().toISOString().split("T")[0];

/* =======================
   TIME FORMAT
======================= */
function toAmPm(time) {
    let [h, m] = time.split(":").map(Number);
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
}

/* =======================
   DOCTOR ASSIGN
======================= */
function assignDoctor(symptoms) {
    symptoms = symptoms.toLowerCase();
    for (let key in diseaseMap) {
        if (symptoms.includes(key)) {
            let spec = diseaseMap[key];
            let availableDoctors = doctors.filter(d => d.spec === spec);
            return availableDoctors[Math.floor(Math.random() * availableDoctors.length)];
        }
    }
    return doctors.find(d => d.spec === "General Physician");
}

/* =======================
   SLOT + TOKEN
======================= */
function getSlot(docId, date) {
    for (let time of schedules[docId]) {
        if (!appointments.find(a => a.docId === docId && a.date === date && a.time === time)) {
            return time;
        }
    }
    return null;
}

/* =======================
   RENDER TABLE
======================= */
function render() {
    const tbody = document.getElementById("appointmentsTable");
    tbody.innerHTML = "";
    appointments.forEach(a => {
        tbody.innerHTML += `
        <tr>
            <td>${a.name}</td>
            <td>${a.age}</td>
            <td>${a.symptoms}</td>
            <td>${a.doctor}</td>
            <td>${a.date}</td>
            <td>${toAmPm(a.time)}</td>
            <td>${a.token}</td>
        </tr>`;
    });
}

/* =======================
   FORM SUBMIT
======================= */
document.getElementById("patientForm").addEventListener("submit", e => {
    e.preventDefault();

    const name = patientName.value.trim();
    const age = patientAge.value;
    const symptoms = patientDisease.value.trim();
    const date = appointmentDate.value;

    const doctor = assignDoctor(symptoms);
    const time = getSlot(doctor.id, date);

    if (!time) {
        alert("Doctor fully booked on selected date");
        return;
    }

    const token =
        appointments.filter(a => a.docId === doctor.id && a.date === date).length + 1;

    appointments.push({
        name,
        age,
        symptoms,
        doctor: `${doctor.name} (${doctor.spec})`,
        docId: doctor.id,
        date,
        time,
        token
    });

    render();
    patientForm.reset();

    alert(`Booked ✔
Doctor: ${doctor.name}
Date: ${date}
Time: ${toAmPm(time)}
Token: ${token}`);
});
