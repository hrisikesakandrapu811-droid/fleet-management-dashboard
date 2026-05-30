const vehicleForm = document.getElementById("vehicleForm");
const fleetCards = document.getElementById("fleetCards");
const fleetTable = document.getElementById("fleetTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const themeToggle = document.getElementById("themeToggle");

const totalVehicles = document.getElementById("totalVehicles");
const availableVehicles = document.getElementById("availableVehicles");
const bookedVehicles = document.getElementById("bookedVehicles");
const maintenanceVehicles = document.getElementById("maintenanceVehicles");

let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
let editId = null;

vehicleForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const vehicleData = {
        id: editId || generateId(),
        vehicleName: document.getElementById("vehicleName").value.trim(),
        vehicleType: document.getElementById("vehicleType").value,
        vehicleNumber: document.getElementById("vehicleNumber").value.trim(),
        driverName: document.getElementById("driverName").value.trim(),
        vehicleStatus: document.getElementById("vehicleStatus").value,
        revenue: Number(document.getElementById("revenue").value),
        serviceDate: document.getElementById("serviceDate").value
    };

    if (editId) {
        vehicles = vehicles.map(vehicle =>
            vehicle.id === editId ? vehicleData : vehicle
        );
        editId = null;
    } else {
        vehicles.push(vehicleData);
    }

    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    vehicleForm.reset();
    renderVehicles();
});

function generateId() {
    return `FLT-${String(vehicles.length + 1).padStart(3, "0")}`;
}

function renderVehicles(data = vehicles) {
    fleetCards.innerHTML = "";
    fleetTable.innerHTML = "";

    data.forEach(vehicle => {
        const statusClass = vehicle.vehicleStatus.toLowerCase();

        fleetCards.innerHTML += `
            <div class="fleet-card">
                <h3>${vehicle.vehicleName}</h3>
                <p><strong>Type:</strong> ${vehicle.vehicleType}</p>
                <p><strong>Number:</strong> ${vehicle.vehicleNumber}</p>
                <p><strong>Driver:</strong> ${vehicle.driverName}</p>
                <p><strong>Revenue:</strong> ₹${vehicle.revenue}</p>
                <p><strong>Service:</strong> ${vehicle.serviceDate}</p>

                <span class="status ${statusClass}">
                    ${vehicle.vehicleStatus}
                </span>

                <div class="card-buttons">
                    <button class="edit-btn" onclick="editVehicle('${vehicle.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteVehicle('${vehicle.id}')">Delete</button>
                </div>
            </div>
        `;

        fleetTable.innerHTML += `
            <tr>
                <td>${vehicle.id}</td>
                <td>${vehicle.vehicleName}</td>
                <td>${vehicle.vehicleType}</td>
                <td>${vehicle.vehicleNumber}</td>
                <td>${vehicle.driverName}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${vehicle.vehicleStatus}
                    </span>
                </td>
                <td>₹${vehicle.revenue}</td>
                <td>${vehicle.serviceDate}</td>
                <td>
                    <div class="action-btns">
                        <button class="edit-table" onclick="editVehicle('${vehicle.id}')">Edit</button>
                        <button class="delete-table" onclick="deleteVehicle('${vehicle.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    updateDashboard();
}

function updateDashboard() {
    totalVehicles.textContent = vehicles.length;

    availableVehicles.textContent = vehicles.filter(vehicle =>
        vehicle.vehicleStatus === "Available"
    ).length;

    bookedVehicles.textContent = vehicles.filter(vehicle =>
        vehicle.vehicleStatus === "Booked"
    ).length;

    maintenanceVehicles.textContent = vehicles.filter(vehicle =>
        vehicle.vehicleStatus === "Maintenance"
    ).length;
}

function deleteVehicle(id) {
    vehicles = vehicles.filter(vehicle => vehicle.id !== id);
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    renderVehicles();
}

function editVehicle(id) {
    const vehicle = vehicles.find(vehicle => vehicle.id === id);

    document.getElementById("vehicleName").value = vehicle.vehicleName;
    document.getElementById("vehicleType").value = vehicle.vehicleType;
    document.getElementById("vehicleNumber").value = vehicle.vehicleNumber;
    document.getElementById("driverName").value = vehicle.driverName;
    document.getElementById("vehicleStatus").value = vehicle.vehicleStatus;
    document.getElementById("revenue").value = vehicle.revenue;
    document.getElementById("serviceDate").value = vehicle.serviceDate;

    editId = id;
}

function filterVehicles() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const filtered = vehicles.filter(vehicle => {
        const matchesSearch =
            vehicle.vehicleName.toLowerCase().includes(searchText) ||
            vehicle.driverName.toLowerCase().includes(searchText) ||
            vehicle.vehicleNumber.toLowerCase().includes(searchText) ||
            vehicle.vehicleType.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "all" ||
            vehicle.vehicleStatus === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    renderVehicles(filtered);
}

searchInput.addEventListener("input", filterVehicles);
statusFilter.addEventListener("change", filterVehicles);

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("fleetTheme", "dark");
    } else {
        localStorage.setItem("fleetTheme", "light");
    }
});

if (localStorage.getItem("fleetTheme") === "dark") {
    document.body.classList.add("dark");
}

renderVehicles();