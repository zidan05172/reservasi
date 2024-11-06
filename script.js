class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = [];
    }

    isAvailable(date, startTime, duration) {
        // Logika untuk mengecek ketersediaan waktu
        for (const reservation of this.reservations) {
            if (reservation.date === date && reservation.startTime === startTime) {
                return false;
            }
        }
        return true;
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    reduceCapacity() {
        if (this.capacity > 0) {
            this.capacity -= 1;
        }
    }
}

class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
    }
}

const rooms = [
    new Room(101, 20),
    new Room(102, 25),
    new Room(103, 30),
    new Room(104, 34),
    new Room(105, 0),
];

function displayRooms() {
    const tableBody = document.querySelector('#rooms-table tbody');
    tableBody.innerHTML = '';
    rooms.forEach(room => {
        const row = document.createElement('tr');

        // Tambahkan elemen status dengan warna
        const statusCell = document.createElement('td');

        if (room.capacity === 0) {
            // Jika kapasitas 0, tampilkan status "Tidak Tersedia" dengan warna abu-abu
            statusCell.textContent = 'Tidak Tersedia';
            statusCell.classList.add('bg-secondary', 'text-white');
        } else {
            // Jika kapasitas lebih dari 0, tampilkan status "Tersedia" dengan warna hijau
            statusCell.textContent = 'Tersedia';
            statusCell.classList.add('text-black');
        }

        row.innerHTML = `
            <td>${room.number}</td>
            <td>${room.capacity}</td>
        `;
        row.appendChild(statusCell);
        tableBody.appendChild(row);
    });
}


function addReservation(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const roomNumber = Number(document.getElementById('room-number').value);
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const duration = Number(document.getElementById('duration').value);

    const room = rooms.find(r => r.number === roomNumber);

    if (!room) {
        document.getElementById('error-message').textContent = 'Ruangan tidak ditemukan.';
        return;
    }

    if (room.capacity === 0) {
        document.getElementById('error-message').textContent = 'Ruangan tersebut tidak tersedia karena kapasitasnya 0.';
        return;
    }

    if (room.isAvailable(date, startTime, duration)) {
        const reservation = new Reservation(name, roomNumber, date, startTime, duration);
        room.addReservation(reservation);

        // Mengurangi kapasitas ruangan setelah reservasi berhasil
        room.reduceCapacity();

        // Tampilkan daftar reservasi dan ruangan yang diperbarui
        displayReservations();
        displayRooms();

        // Reset form dan pesan error
        document.getElementById('form').reset();
        document.getElementById('error-message').textContent = '';
    } else {
        document.getElementById('error-message').textContent = 'Ruangan sudah dipesan pada waktu tersebut.';
    }
}


document.getElementById('form').addEventListener('submit', addReservation);

function displayReservations() {
    const reservationsList = document.getElementById('reservations');
    reservationsList.innerHTML = '';
    rooms.forEach(room => {
        room.reservations.forEach(reservation => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = `${reservation.name} - Ruang ${reservation.roomNumber} - ${reservation.date} - ${reservation.startTime} (${reservation.duration} jam)`;
            const cancelButton = document.createElement('button');
            cancelButton.className = 'btn btn-danger btn-sm';
            cancelButton.textContent = 'Batal';
            cancelButton.onclick = () => cancelReservation(room, reservation);
            li.appendChild(cancelButton);
            reservationsList.appendChild(li);
        });
    });
}

function cancelReservation(room, reservation) {
    room.reservations = room.reservations.filter(r => r !== reservation);
    displayReservations();
    displayRooms();
}

// Tampilkan data awal
displayRooms();