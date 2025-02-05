import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB5G048Zthg8wM3FrTMCebFc7cVI-sX3Gg",
    authDomain: "ebus-system.firebaseapp.com",
    projectId: "ebus-system",
    databaseURl:"https://ebus-system-default-rtdb.firebaseio.com",
    storageBucket: "ebus-system.firebasestorage.app",
    messagingSenderId: "363373892282",
    appId: "1:363373892282:web:217c273039ca7b79892883"
  };
        const app = initializeApp(firebaseConfig);
        const auth = getAuth();
        const db = getFirestore();

// ------------------------ ADMIN: Create Driver Account ------------------------
document.getElementById('create-driver-btn').addEventListener('click', async () => {
    const email = document.getElementById('driver-email').value;
    const password = document.getElementById('driver-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Driver account created successfully!");

        document.getElementById('driver-email').value = "";
        document.getElementById('driver-password').value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ------------------------ DRIVER: Login ------------------------
document.getElementById('driver-login-btn').addEventListener('click', async () => {
    const email = document.getElementById('driver-login-email').value;
    const password = document.getElementById('driver-login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Driver logged in successfully!");
        document.getElementById('driver-login-email').value = "";
        document.getElementById('driver-login-password').value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ------------------------ DRIVER: Post Bus Information ------------------------
document.getElementById('post-bus-btn').addEventListener('click', async () => {
    const busName = document.getElementById('bus-name').value;
    const busNumber = document.getElementById('bus-number').value;
    const busRoute = document.getElementById('bus-route').value;
    const busCapacity = document.getElementById('bus-capacity').value;

    try {
        await addDoc(collection(db, "buses"), {
            busName,
            busNumber,
            busRoute,
            busCapacity
        });
        alert("Bus information posted successfully!");
        document.getElementById('bus-name').value = "";
        document.getElementById('bus-number').value = "";
        document.getElementById('bus-route').value = "";
        document.getElementById('bus-capacity').value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ------------------------ DRIVER: Post Bus Type ------------------------
document.getElementById('post-bus-type-btn').addEventListener('click', async () => {
    const busType = document.getElementById('bus-type').value;

    try {
        await addDoc(collection(db, "busTypes"), { busType });
        alert("Bus type posted successfully!");
        document.getElementById('bus-type').value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ------------------------ DRIVER: Post Contact Details ------------------------
document.getElementById('post-contact-btn').addEventListener('click', async () => {
    const contactName = document.getElementById('contact-name').value;
    const contactPhone = document.getElementById('contact-phone').value;
    const contactEmail = document.getElementById('contact-email').value;

    try {
        await addDoc(collection(db, "contacts"), {
            contactName,
            contactPhone,
            contactEmail
        });
        alert("Contact details posted successfully!");
        document.getElementById('contact-name').value = "";
        document.getElementById('contact-phone').value = "";
        document.getElementById('contact-email').value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ------------------------ USER: Register ------------------------
document.getElementById('register-user-btn').addEventListener('click', async () => {
    const firstName = document.getElementById('user-first-name').value;
    const lastName = document.getElementById('user-last-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("User registered successfully!");
        document.getElementById('user-first-name').value = "";
        document.getElementById('user-last-name').value = "";
        document.getElementById('user-email').value = "";
        document.getElementById('user-password').value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ------------------------ USER: Login ------------------------
document.getElementById('login-user-btn').addEventListener('click', async () => {
    const email = document.getElementById('login-user-email').value;
    const password = document.getElementById('login-user-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("User logged in successfully!");
        document.getElementById('login-user-email').value = "";
        document.getElementById('login-user-password').value = "";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ------------------------ USER: Retrieve and View Bus Details ------------------------
document.getElementById('view-buses-btn').addEventListener('click', async () => {
    const busesContainer = document.getElementById('buses-container');
   

    try {
        // Retrieve bus details
        const busesSnapshot = await getDocs(collection(db, "buses"));
        const busTypeSnapshot = await getDocs(collection(db, "busTypes"));
        const contactsSnapshot = await getDocs(collection(db, "contacts"));

        let busTypeData = {};
        let contactData = {};

        // Store bus types
        busTypeSnapshot.forEach((doc) => {
            busTypeData[doc.id] = doc.data().busType;
        });

        // Store contact details
        contactsSnapshot.forEach((doc) => {
            contactData[doc.id] = doc.data();
        });

        // Display bus details
        let busesHTML = "<h3>Available Buses</h3><ul>";

        busesSnapshot.forEach((doc) => {
            const bus = doc.data();
            const busType = busTypeData[doc.id] || "Not specified";
            const contact = contactData[doc.id] || { contactName: "N/A", contactPhone: "N/A" };

            busesHTML += `
                <li>
                    <strong>Bus Name:</strong> ${bus.busName} <br>
                    <strong>Bus Number:</strong> ${bus.busNumber} <br>
                    <strong>Route:</strong> ${bus.busRoute} <br>
                    <strong>Capacity:</strong> ${bus.busCapacity} <br>
                    <strong>Bus Type:</strong> ${busType} <br>
                    <strong>Contact Name:</strong> ${contact.contactName} <br>
                    <strong>Contact Phone:</strong> ${contact.contactPhone} <br>
                    <hr>
                </li>
            `;
        });
        busesHTML += "</ul>";
        busesContainer.innerHTML = busesHTML;
       

    } catch (error) {
        busesContainer.innerHTML = "<p>Error fetching bus details. Please try again.</p>";
        console.error("Error retrieving bus details:", error);
    }
});


       
       