// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2539t0L3Zms_jd7Z_qzJrzSV2dU_viS4",
    authDomain: "persson-database.firebaseapp.com",
    projectId: "persson-database",
    storageBucket: "persson-database.firebasestorage.app",
    messagingSenderId: "1002896345987",
    appId: "1:1002896345987:web:4bb12ac4c5d13fba0c44b6",
    measurementId: "G-5PC29H4823"
};

// Initialize Firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Initialize global variables
let cargos = [];
let containerVolume = 68;
let truckCount = 5;
let currentInvoiceId = null;
let customers = [];

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cargo-form').addEventListener('submit', addCargo);
    document.getElementById('edit-cargo-form').addEventListener('submit', updateCargo);
    document.getElementById('create-invoice-btn').addEventListener('click', createInvoice);
    document.getElementById('load-invoices-btn').addEventListener('click', loadInvoices);
    document.getElementById('add-brand-form').addEventListener('submit', addNewBrand);
    
    // Set today's date as default
    document.getElementById('invoice-date').valueAsDate = new Date();
    
    // Load customers for brand select
    loadCustomers();
    
    // Load invoices automatically when page loads
    loadInvoices();
});

// Load customers to brand combobox
function loadCustomers() {
    console.log("Fetching customers from Firestore...");
    
    db.collection('persons')
        .get()
        .then((querySnapshot) => {
            console.log("Retrieved customers:", querySnapshot.size);
            customers = [];
            const brandDatalist = document.getElementById('brandOptions');
            const editBrandDatalist = document.getElementById('editBrandOptions');
            
            // Clear options
            brandDatalist.innerHTML = '';
            editBrandDatalist.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const customer = doc.data();
                console.log("Customer data:", customer);
                
                customers.push({
                    id: doc.id,
                    logo: customer.Logo,
                    name: customer.Naw,
                    name_en: customer.Name_en
                });
                
                // Add to main form datalist
                const option = document.createElement('option');
                option.value = customer.Logo;
                option.textContent = customer.Logo; // Show LOGO in dropdown
                option.dataset.customerId = doc.id;
                option.dataset.customerName = customer.Naw || customer.Name_en; // Store the customer name
                brandDatalist.appendChild(option);
                
                // Add to edit form datalist
                const editOption = document.createElement('option');
                editOption.value = customer.Logo;
                editOption.textContent = customer.Logo; // Show LOGO in dropdown
                editOption.dataset.customerId = doc.id;
                editOption.dataset.customerName = customer.Naw || customer.Name_en; // Store the customer name
                editBrandDatalist.appendChild(editOption);
            });
        })
        .catch((error) => {
            console.error("Error loading customers: ", error);
            alert('هەڵەیەک ڕوویدا لە کاتی بارکردنی لیستی مشتەریەکان: ' + error.message);
        });
}

// Customer selected event handler
function customerSelected() {
    const brandInput = document.getElementById('brand');
    const selectedValue = brandInput.value;
    
    if (selectedValue) {
        // Find customer by LOGO
        const customer = customers.find(c => c.logo === selectedValue);
        if (customer) {
            document.getElementById('full-name').value = customer.name || customer.name_en || '';
        }
    }
}

// Customer selected in edit form
function editCustomerSelected() {
    const brandInput = document.getElementById('edit-brand');
    const selectedValue = brandInput.value;
    
    if (selectedValue) {
        // Find customer by LOGO
        const customer = customers.find(c => c.logo === selectedValue);
        if (customer) {
            document.getElementById('edit-full-name').value = customer.name || customer.name_en || '';
        }
    }
}

// Show add brand modal
function showAddBrandModal() {
    document.getElementById('add-brand-modal').style.display = 'flex';
    document.getElementById('add-brand-form').reset();
}

// Close add brand modal
function closeAddBrandModal() {
    document.getElementById('add-brand-modal').style.display = 'none';
}

// Add new brand/customer
function addNewBrand(e) {
    e.preventDefault();
    
    const logo = document.getElementById('new-brand-logo').value.trim();
    const name = document.getElementById('new-brand-name').value.trim();
    const nameEn = document.getElementById('new-brand-name-en').value.trim();
    const mobile = document.getElementById('new-brand-mobile').value.trim();
    
    if (!logo || !name || !nameEn || !mobile) {
        alert('تکایە هەموو خانەکان پڕبکەوە');
        return;
    }
    
    // Check if the logo already exists
    db.collection('persons')
        .where('Logo', '==', logo)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert('کۆدی لۆگۆی داخڵکراو پێشتر هەیە!');
                return Promise.reject('Duplicate logo');
            }
            
            // Create a new person document
            const newPerson = {
                Logo: logo,
                Naw: name,
                Name_en: nameEn,
                Mobil: mobile,
                Person_ID: Date.now(),  // Use timestamp as ID
                ZMC_code: logo,  // Use logo as ZMC_code by default
                Country: "IRAQ",  // Default value
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            return db.collection('persons').add(newPerson);
        })
        .then((docRef) => {
            if (docRef) {
                console.log("New customer added with ID:", docRef.id);
                
                // Add to local customers array
                customers.push({
                    id: docRef.id,
                    logo: logo,
                    name: name,
                    name_en: nameEn
                });
                
                // Add to both brand datalists
                const brandDatalist = document.getElementById('brandOptions');
                const editBrandDatalist = document.getElementById('editBrandOptions');
                
                const option = document.createElement('option');
                option.value = logo;
                option.textContent = logo; // Show logo code in dropdown
                option.dataset.customerName = name;
                
                const editOption = option.cloneNode(true);
                
                brandDatalist.appendChild(option);
                editBrandDatalist.appendChild(editOption);
                
                // Set the new brand as the selected one in the current form
                document.getElementById('brand').value = logo;
                
                // Auto fill the full name with customer name
                document.getElementById('full-name').value = name;
                
                // Trigger the customer selected event
                customerSelected();
                
                // Close the modal
                closeAddBrandModal();
                
                alert('کڕیاری نوێ بە سەرکەوتوویی زیاد کرا!');
            }
        })
        .catch((error) => {
            if (error === 'Duplicate logo') return;
            console.error("Error adding new customer:", error);
            alert('هەڵەیەک ڕوویدا لە کاتی زیادکردنی کڕیاری نوێ: ' + error.message);
        });
}
// Show delete invoice confirmation modal
function confirmDeleteInvoice(invoiceId, invoiceNumber) {
    document.getElementById('delete-invoice-id').value = invoiceId;
    document.getElementById('delete-invoice-number').textContent = `ژمارەی فاکس: ${invoiceNumber}`;
    document.getElementById('delete-code').value = '';
    document.getElementById('delete-invoice-modal').style.display = 'flex';
}

// Close delete invoice modal
function closeDeleteInvoiceModal() {
    document.getElementById('delete-invoice-modal').style.display = 'none';
}

// Delete invoice if code is correct
function deleteInvoice() {
    const deleteCode = document.getElementById('delete-code').value;
    const invoiceId = document.getElementById('delete-invoice-id').value;
    
    // Check deletion code
    if (deleteCode !== '0770') {
        alert('کۆدی سڕینەوە هەڵەیە!');
        return;
    }
    
    // Check if invoice has any cargos
    db.collection('cargos')
        .where('invoiceId', '==', invoiceId)
        .get()
        .then((querySnapshot) => {
            const cargoPromises = [];
            
            // Delete all related cargos first
            querySnapshot.forEach((doc) => {
                cargoPromises.push(db.collection('cargos').doc(doc.id).delete());
            });
            
            return Promise.all(cargoPromises);
        })
        .then(() => {
            // Now delete the invoice
            return db.collection('invoices').doc(invoiceId).delete();
        })
        .then(() => {
            // If we're deleting the current invoice, clear the current view
            if (invoiceId === currentInvoiceId) {
                currentInvoiceId = null;
                cargos = [];
                updateCargoTable();
                updateDashboard();
                document.getElementById('current-invoice-dashboard').style.display = 'none';
                document.getElementById('cargo-section-container').style.display = 'none';
            }
            
            closeDeleteInvoiceModal();
            alert('فاکس بە سەرکەوتوویی سڕایەوە');
            
            // Reload invoices list
            loadInvoices();
        })
        .catch((error) => {
            console.error("Error deleting invoice: ", error);
            alert('هەڵەیەک ڕوویدا لە کاتی سڕینەوەی فاکس: ' + error.message);
        });
}

// Load all invoices
function loadInvoices() {
    db.collection('invoices')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            const tableBody = document.getElementById('invoice-table-body');
            tableBody.innerHTML = '';
            
            if (querySnapshot.empty) {
                tableBody.innerHTML = '<tr><td colspan="8" class="empty-message">هیچ فاکسێک نییە</td></tr>';
                return;
            }
            
            querySnapshot.forEach((doc) => {
                const invoice = doc.data();
                const row = document.createElement('tr');
                row.className = currentInvoiceId === doc.id ? 'active-invoice' : '';
                
                row.innerHTML = `
                    <td>${invoice.invoiceNumber}</td>
                    <td>${invoice.date}</td>
                    <td>${invoice.truckCount}</td>
                    <td>${invoice.totalVolume ? invoice.totalVolume.toFixed(2) : '0.00'}</td>
                    <td>${invoice.totalWeight ? invoice.totalWeight.toFixed(2) : '0.00'}</td>
                    <td><span class="invoice-status status-${invoice.status}">${invoice.status === 'active' ? 'چالاک' : 'تەواوبوو'}</span></td>
                    <td>${invoice.notes || ''}</td>
                    <td>
                        <button class="btn action-btn" onclick="loadInvoiceCargos('${doc.id}', '${invoice.invoiceNumber}')">پیشاندان</button>
                        <button class="btn btn-warning action-btn" onclick="confirmDeleteInvoice('${doc.id}', '${invoice.invoiceNumber}')">سڕینەوە</button>
                        <button class="btn ${invoice.status === 'active' ? 'btn-danger' : 'btn-success'} action-btn" onclick="toggleInvoiceStatus('${doc.id}', '${invoice.status}')">
                            ${invoice.status === 'active' ? 'تەواوکردن' : 'چالاککردنەوە'}
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Always show invoice list
            document.querySelector('.invoice-list').style.display = 'block';
        })
        .catch((error) => {
            console.error("Error loading invoices: ", error);
            alert('هەڵەیەک ڕوویدا لە کاتی بارکردنی فاکسەکان');
        });
}

// Create a new invoice
function createInvoice() {
    const invoiceNumber = document.getElementById('invoice-number').value;
    const invoiceDate = document.getElementById('invoice-date').value;
    const invoiceNotes = document.getElementById('invoice-notes').value;
    
    if (!invoiceNumber || !invoiceDate) {
        alert('تکایە ژمارەی فاکس و بەروار پڕ بکەوە');
        return;
    }
    
    // Check if invoice with this number already exists
    db.collection('invoices').where('invoiceNumber', '==', invoiceNumber)
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert('فاکسێک بە هەمان ژمارە هەیە!');
                return Promise.reject('Duplicate invoice number');
            }
            
            // Create new invoice
            return db.collection('invoices').add({
                invoiceNumber: invoiceNumber,
                date: invoiceDate,
                notes: invoiceNotes,
                truckCount: truckCount,
                totalVolume: 0,
                totalWeight: 0,
                status: 'active',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then((docRef) => {
            if (docRef) {
                currentInvoiceId = docRef.id;
                // Reset cargo list for new invoice
                cargos = [];
                updateCargoTable();
                updateDashboard();
                document.getElementById('current-invoice').textContent = invoiceNumber;
                document.getElementById('current-invoice-dashboard').style.display = 'grid';
                
                // Show cargo section
                document.getElementById('cargo-section-container').style.display = 'block';
                
                alert('فاکسی نوێ دروست کرا بە سەرکەوتوویی!');
                
                // Reload invoices list
                loadInvoices();
            }
        })
        .catch((error) => {
            if (error === 'Duplicate invoice number') return;
            console.error("Error creating invoice: ", error);
            alert('هەڵەیەک ڕوویدا لە کاتی دروستکردنی فاکس');
        });
}

// Toggle invoice status (active/completed)
function toggleInvoiceStatus(invoiceId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'completed' : 'active';
    
    db.collection('invoices').doc(invoiceId).update({
        status: newStatus
    })
    .then(() => {
        loadInvoices();
        
        if (invoiceId === currentInvoiceId && newStatus === 'completed') {
            // If we're completing the current invoice, clear the current view
            currentInvoiceId = null;
            cargos = [];
            updateCargoTable();
            updateDashboard();
            document.getElementById('current-invoice-dashboard').style.display = 'none';
            
            // Hide cargo section
            document.getElementById('cargo-section-container').style.display = 'none';
        }
    })
    .catch((error) => {
        console.error("Error updating invoice status: ", error);
        alert('هەڵەیەک ڕوویدا لە کاتی گۆڕینی باری فاکس');
    });
}

// Load cargos for a specific invoice
function loadInvoiceCargos(invoiceId, invoiceNumber) {
    currentInvoiceId = invoiceId;
    
    db.collection('cargos')
        .where('invoiceId', '==', invoiceId)
        .get()
        .then((querySnapshot) => {
            cargos = [];
            querySnapshot.forEach((doc) => {
                const cargoData = doc.data();
                cargos.push({
                    id: doc.id,
                    name: cargoData.name,
                    brand: cargoData.brand,
                    brandName: cargoData.brandName,
                    cartonNumber: cargoData.cartonNumber,
                    type: cargoData.type,
                    weight: cargoData.weight,
                    volume: cargoData.volume
                });
            });
            
            updateCargoTable();
            updateDashboard();
            document.getElementById('current-invoice').textContent = invoiceNumber;
            document.getElementById('current-invoice-dashboard').style.display = 'grid';
            
            // Show cargo section
            document.getElementById('cargo-section-container').style.display = 'block';
        })
        .catch((error) => {
            console.error("Error loading cargos: ", error);
            alert('هەڵەیەک ڕوویدا لە کاتی بارکردنی بارەکان');
        });
}

// Add new cargo
function addCargo(e) {
    e.preventDefault();
    
    if (!currentInvoiceId) {
        alert('تکایە سەرەتا فاکسێک دروست بکە یان هەڵبژێرە');
        return;
    }
    
    // Check invoice status
    db.collection('invoices').doc(currentInvoiceId).get()
        .then((doc) => {
            if (doc.exists && doc.data().status === 'completed') {
                alert('ناتوانیت بار زیاد بکەیت بۆ فاکسێکی تەواوبوو');
                return Promise.reject('Completed invoice');
            }
            
            const brandInput = document.getElementById('brand');
            const selectedValue = brandInput.value;
            
            if (!selectedValue) {
                alert('تکایە مارکەیەک هەڵبژێرە');
                return Promise.reject('No brand selected');
            }
            
            // Find customer by LOGO
            const customer = customers.find(c => c.logo === selectedValue);
            let customerName = '';
            
            if (customer) {
                customerName = customer.name || customer.name_en || '';
            }
            
            const cargo = {
                invoiceId: currentInvoiceId,
                name: document.getElementById('full-name').value,
                brand: selectedValue, // This is the customer logo
                brandName: customerName, // This is the customer name
                cartonNumber: parseInt(document.getElementById('carton-number').value),
                type: document.getElementById('cargo-type').value,
                weight: parseFloat(document.getElementById('weight').value),
                volume: parseFloat(document.getElementById('volume').value),
                date: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Add cargo to Firestore
            return db.collection('cargos').add(cargo);
        })
        .then((docRef) => {
            if (docRef) {
                // Add to local array
                const brandInput = document.getElementById('brand');
                const selectedValue = brandInput.value;
                
                // Find customer by LOGO
                const customer = customers.find(c => c.logo === selectedValue);
                let customerName = '';
                
                if (customer) {
                    customerName = customer.name || customer.name_en || '';
                }
                
                cargos.push({
                    id: docRef.id,
                    name: document.getElementById('full-name').value,
                    brand: selectedValue,
                    brandName: customerName,
                    cartonNumber: parseInt(document.getElementById('carton-number').value),
                    type: document.getElementById('cargo-type').value,
                    weight: parseFloat(document.getElementById('weight').value),
                    volume: parseFloat(document.getElementById('volume').value)
                });
                
                // Update invoice totals
                updateInvoiceTotals();
                
                updateCargoTable();
                updateDashboard();
                document.getElementById('cargo-form').reset();
            }
        })
        .catch((error) => {
            if (error !== 'Completed invoice' && error !== 'No brand selected') {
                console.error("Error adding cargo: ", error);
                alert('هەڵەیەک ڕوویدا لە کاتی زیادکردنی بار: ' + error.message);
            }
        });
}

// Remove cargo
function removeCargo(id) {
    if (!currentInvoiceId) {
        alert('هیچ فاکسێک هەڵنەبژێردراوە');
        return;
    }
    
    // Check invoice status
    db.collection('invoices').doc(currentInvoiceId).get()
        .then((doc) => {
            if (doc.exists && doc.data().status === 'completed') {
                alert('ناتوانیت بار بسڕیتەوە لە فاکسێکی تەواوبوو');
                return Promise.reject('Completed invoice');
            }
            
            // Remove from Firestore
            return db.collection('cargos').doc(id).delete();
        })
        .then(() => {
            // Remove from local array
            cargos = cargos.filter(cargo => cargo.id !== id);
            
            // Update invoice totals
            updateInvoiceTotals();
            
            updateCargoTable();
            updateDashboard();
        })
        .catch((error) => {
            if (error !== 'Completed invoice') {
                console.error("Error removing cargo: ", error);
                alert('هەڵەیەک ڕوویدا لە کاتی سڕینەوەی بار');
            }
        });
}

// Edit cargo
function editCargo(id) {
    const cargo = cargos.find(cargo => cargo.id === id);
    if (!cargo) return;
    
    document.getElementById('edit-cargo-id').value = cargo.id;
    document.getElementById('edit-full-name').value = cargo.name;
    
    // Set brand select value
    const brandInput = document.getElementById('edit-brand');
    brandInput.value = cargo.brand;
    
    document.getElementById('edit-carton-number').value = cargo.cartonNumber;
    document.getElementById('edit-cargo-type').value = cargo.type;
    document.getElementById('edit-weight').value = cargo.weight;
    document.getElementById('edit-volume').value = cargo.volume;
    
    document.getElementById('edit-cargo-modal').style.display = 'flex';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-cargo-modal').style.display = 'none';
}

// Update cargo after edit
function updateCargo(e) {
    e.preventDefault();
    
    if (!currentInvoiceId) {
        alert('هیچ فاکسێک هەڵنەبژێردراوە');
        return;
    }
    
    const id = document.getElementById('edit-cargo-id').value;
    
    // Check invoice status
    db.collection('invoices').doc(currentInvoiceId).get()
        .then((doc) => {
            if (doc.exists && doc.data().status === 'completed') {
                alert('ناتوانیت بار دەستکاری بکەیت لە فاکسێکی تەواوبوو');
                return Promise.reject('Completed invoice');
            }
            
            const brandInput = document.getElementById('edit-brand');
            const selectedValue = brandInput.value;
            
            if (!selectedValue) {
                alert('تکایە مارکەیەک هەڵبژێرە');
                return Promise.reject('No brand selected');
            }
            
            // Find customer by LOGO
            const customer = customers.find(c => c.logo === selectedValue);
            let customerName = '';
            
            if (customer) {
                customerName = customer.name || customer.name_en || '';
            }
            
            const updatedCargo = {
                name: document.getElementById('edit-full-name').value,
                brand: selectedValue,
                brandName: customerName,
                cartonNumber: parseInt(document.getElementById('edit-carton-number').value),
                type: document.getElementById('edit-cargo-type').value,
                weight: parseFloat(document.getElementById('edit-weight').value),
                volume: parseFloat(document.getElementById('edit-volume').value)
            };
            
            // Update in Firestore
            return db.collection('cargos').doc(id).update(updatedCargo);
        })
        .then(() => {
            // Update in local array
            const cargoIndex = cargos.findIndex(cargo => cargo.id === id);
            if (cargoIndex !== -1) {
                const brandInput = document.getElementById('edit-brand');
                const selectedValue = brandInput.value;
                
                // Find customer by LOGO
                const customer = customers.find(c => c.logo === selectedValue);
                let customerName = '';
                
                if (customer) {
                    customerName = customer.name || customer.name_en || '';
                }
                
                cargos[cargoIndex] = {
                    id: id,
                    name: document.getElementById('edit-full-name').value,
                    brand: selectedValue,
                    brandName: customerName,
                    cartonNumber: parseInt(document.getElementById('edit-carton-number').value),
                    type: document.getElementById('edit-cargo-type').value,
                    weight: parseFloat(document.getElementById('edit-weight').value),
                    volume: parseFloat(document.getElementById('edit-volume').value)
                };
            }
            
            // Update invoice totals
            updateInvoiceTotals();
            
            closeEditModal();
            updateCargoTable();
            updateDashboard();
        })
        .catch((error) => {
            if (error !== 'Completed invoice' && error !== 'No brand selected') {
                console.error("Error updating cargo: ", error);
                alert('هەڵەیەک ڕوویدا لە کاتی نوێکردنەوەی بار');
            }
        });
}

// Update invoice totals
function updateInvoiceTotals() {
    if (!currentInvoiceId) return;
    
    const totalVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
    const totalWeight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
    
    db.collection('invoices').doc(currentInvoiceId).update({
        truckCount: truckCount,
        totalVolume: totalVolume,
        totalWeight: totalWeight
    })
    .catch((error) => {
        console.error("Error updating invoice totals: ", error);
    });
}

// Update container settings
function updateContainerSettings() {
    containerVolume = parseFloat(document.getElementById('container-volume').value);
    truckCount = parseInt(document.getElementById('truck-count').value);
    
    updateDashboard();
    // Clear truck distribution when settings change
    document.getElementById('truck-distribution').innerHTML = '';
    
    // Update invoice truck count if an invoice is active
    if (currentInvoiceId) {
        db.collection('invoices').doc(currentInvoiceId).update({
            truckCount: truckCount
        })
        .catch((error) => {
            console.error("Error updating truck count: ", error);
        });
    }
}

// Update cargo table
function updateCargoTable() {
    const tableBody = document.getElementById('cargo-table-body');
    tableBody.innerHTML = '';
    
    if (cargos.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="empty-message">هیچ بارێک نییە</td></tr>';
        return;
    }
    
    cargos.forEach((cargo, index) => {
        const row = document.createElement('tr');
        
        // Find customer name from brand code if available
        let displayBrand = cargo.brand;
        if (cargo.brandName) {
            displayBrand = cargo.brandName;
        } else {
            // Try to find brand name from customers array
            const customer = customers.find(c => c.logo === cargo.brand);
            if (customer) {
                displayBrand = customer.name;
            }
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${cargo.name}</td>
            <td>${displayBrand}</td>
            <td>${cargo.cartonNumber}</td>
            <td>${cargo.type}</td>
            <td>${cargo.weight.toFixed(2)}</td>
            <td>${cargo.volume.toFixed(2)}</td>
            <td>
                <button class="btn action-btn" onclick="editCargo('${cargo.id}')">دەستکاری</button>
                <button class="btn btn-danger action-btn" onclick="removeCargo('${cargo.id}')">سڕینەوە</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update dashboard
function updateDashboard() {
    const totalCargo = cargos.length;
    const totalVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
    const totalWeight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
    const remainingVolume = containerVolume - totalVolume;
    
    document.getElementById('total-cargo').textContent = totalCargo;
    document.getElementById('total-volume').textContent = totalVolume.toFixed(2);
    document.getElementById('total-weight').textContent = totalWeight.toFixed(2);
    document.getElementById('remaining-volume').textContent = remainingVolume.toFixed(2);
    
    // Update distribution section
    document.getElementById('container-volume-display').textContent = containerVolume;
    document.getElementById('occupied-volume').textContent = totalVolume.toFixed(2);
    document.getElementById('distribute-volume').textContent = remainingVolume.toFixed(2);
}

// Distribute remaining volume among trucks
function distributeRemainingVolume() {
    const totalVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
    const remainingVolume = containerVolume - totalVolume;
    const truckDistributionContainer = document.getElementById('truck-distribution');
    
    if (remainingVolume <= 0) {
        alert('هیچ حەجمێک نەماوە بۆ دابەشکردن!');
        return;
    }
    
    const volumePerTruck = remainingVolume / truckCount;
    truckDistributionContainer.innerHTML = '';
    
    for (let i = 1; i <= truckCount; i++) {
        const truckItem = document.createElement('div');
        truckItem.className = 'truck-item';
        truckItem.innerHTML = `
            <span>تراک #${i}</span>
            <span>${volumePerTruck.toFixed(2)} م³</span>
        `;
        truckDistributionContainer.appendChild(truckItem);
    }
    
    // دوگمەی زیادکردنی حەجمی ماوە بۆ بارەکان
    const applyDistributionButton = document.createElement('button');
    applyDistributionButton.className = 'btn btn-primary mt-3';
    applyDistributionButton.textContent = 'زیادکردنی حەجمی ماوە بۆ بارەکان';
    applyDistributionButton.onclick = applyDistributionToTotalVolume;
    
    truckDistributionContainer.appendChild(applyDistributionButton);
}

// Apply distributed volume to total volume
function applyDistributionToTotalVolume() {
    if (!currentInvoiceId) {
        alert('هیچ فاکسێک هەڵنەبژێردراوە');
        return;
    }
    
    // Check invoice status
    db.collection('invoices').doc(currentInvoiceId).get()
        .then((doc) => {
            if (doc.exists && doc.data().status === 'completed') {
                alert('ناتوانیت حەجمی ماوە زیاد بکەیت بۆ فاکسێکی تەواوبوو');
                return Promise.reject('Completed invoice');
            }
            
            const totalVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
            const remainingVolume = containerVolume - totalVolume;
            
            if (remainingVolume <= 0) {
                alert('هیچ حەجمێک نەماوە بۆ زیادکردن!');
                return Promise.reject('No volume to add');
            }
            
            // حەجمی ماوە بۆ هەر بارێک بە ڕێژەی قەبارەی بار
            if (cargos.length === 0) {
                alert('هیچ بارێک نییە بۆ زیادکردنی حەجمی زیادە!');
                return Promise.reject('No cargos to update');
            }
            
            const volumePerTruck = remainingVolume / truckCount;
            const totalTruckVolume = volumePerTruck * truckCount;
            
            // حەجمی ماوە بە ڕێژەیی بەسەر بارەکان دابەش بکە
            const totalExistingVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
            const updates = [];
            
            // حەجمی تازە بۆ هەر بارێک هەژمار بکە
            const updatedCargos = cargos.map(cargo => {
                // ڕێژەی بار لە کۆی بارەکان
                const ratio = cargo.volume / totalExistingVolume;
                // حەجمی ماوەی بۆ زیاد بکە
                const volumeToAdd = remainingVolume * ratio;
                const newVolume = cargo.volume + volumeToAdd;
                
                // ئەپدەیتی فایەربەیس زیاد بکە
                updates.push(
                    db.collection('cargos').doc(cargo.id).update({
                        volume: newVolume
                    })
                );
                
                // ئەپدەیتی ئۆبجێکتی ناوخۆیی
                return {
                    ...cargo,
                    volume: newVolume
                };
            });
            
            // ئەپدەیتی هەموو تۆمارەکان لە فایەربەیس
            return Promise.all([
                db.collection('invoices').doc(currentInvoiceId).update({
                    totalVolume: containerVolume
                }),
                ...updates
            ]).then(() => {
                // ئەپدەیتکردنی ئۆبجێکتە ناوخۆییەکان
                cargos = updatedCargos;
                
                // ئەپدەیتکردنی داشبۆرد و خشتە
                updateCargoTable();
                updateDashboard();
                
                // پاککردنەوەی دابەشکردنەکان
                document.getElementById('truck-distribution').innerHTML = '';
                
                alert('حەجمی ماوە بە سەرکەوتوویی زیاد کرا بۆ بارەکان!');
            });
        })
        .catch((error) => {
            if (error === 'Completed invoice' || error === 'No volume to add' || error === 'No cargos to update') return;
            console.error("Error updating cargo volumes:", error);
            alert('هەڵەیەک ڕوویدا لە کاتی زیادکردنی حەجمی ماوە: ' + error.message);
        });
}


// Export to Excel with better styling and mobile numbers
function exportToExcel() {
    if (cargos.length === 0) {
        alert('هیچ بارێک نییە بۆ ئێکسپۆرتکردن!');
        return;
    }
    
    // First, collect all unique brand codes to fetch mobile numbers
    const uniqueBrands = [...new Set(cargos.map(cargo => cargo.brand))];
    const brandMobiles = {};
    
    // Create promises to fetch mobile numbers for all brands
    const fetchPromises = uniqueBrands.map(brandCode => {
        // Find customer for this brand
        const customer = customers.find(c => c.logo === brandCode);
        if (customer && customer.id) {
            return db.collection('persons')
                .doc(customer.id)
                .get()
                .then(doc => {
                    if (doc.exists && doc.data().Mobil) {
                        brandMobiles[brandCode] = doc.data().Mobil;
                    } else {
                        brandMobiles[brandCode] = "";
                    }
                })
                .catch(error => {
                    console.error("Error getting mobile for brand:", brandCode, error);
                    brandMobiles[brandCode] = "";
                });
        } else {
            brandMobiles[brandCode] = "";
            return Promise.resolve();
        }
    });
    
    // Wait for all mobile numbers to be fetched before creating the Excel file
    Promise.all(fetchPromises)
        .then(() => {
            // Now prepare data for Excel with mobile numbers
            const data = cargos.map((cargo, index) => ({
                '#': index + 1,
                'ناوی سیانی': cargo.name,
                'مارکە': cargo.brand, // Logo code
                'مۆبایل': brandMobiles[cargo.brand] || "", // Mobile number
                'ژمارەی کارتۆن': cargo.cartonNumber,
                'جۆری کاڵا': cargo.type,
                'وەزن (کگم)': cargo.weight,
                'حەجم (م³)': cargo.volume
            }));
            
            // Create a workbook
            const wb = XLSX.utils.book_new();
            
            // Create a worksheet for the header
            const wsHeader = XLSX.utils.aoa_to_sheet([
                ['جبل الطور للتجارة العامة ش.ذ.م-م'],
                ['Jabal Al Toor general trading L.L.C'],
                [''],
                ['لیستی بارەکان']
            ]);
            
            // Create a worksheet for the data
            const wsData = XLSX.utils.json_to_sheet(data);
            
            // Create a new worksheet that combines header and data
            const ws = {};
            
            // Copy header to the worksheet
            Object.keys(wsHeader).forEach(key => {
                if (key !== '!ref' && key !== '!margins') {
                    ws[key] = wsHeader[key];
                }
            });
            
            // Copy data to the worksheet (shifted down by header rows)
            Object.keys(wsData).forEach(key => {
                if (key !== '!ref' && key !== '!margins') {
                    // Parse the cell address
                    const match = key.match(/([A-Z]+)([0-9]+)/);
                    if (match) {
                        const col = match[1];
                        const row = parseInt(match[2]);
                        // Shift row by 4 (header has 4 rows)
                        const newRow = row + 4;
                        const newKey = col + newRow;
                        ws[newKey] = wsData[key];
                    }
                }
            });
            
            // Set the reference range for the complete worksheet
            const range = { s: { c: 0, r: 0 }, e: { c: 7, r: data.length + 4 } };
            ws['!ref'] = XLSX.utils.encode_range(range);
            
            // Set column widths
            ws['!cols'] = [
                { wch: 6 },   // #
                { wch: 25 },  // Name
                { wch: 12 },  // Logo
                { wch: 15 },  // Mobile
                { wch: 12 },  // Carton
                { wch: 20 },  // Type
                { wch: 12 },  // Weight
                { wch: 12 }   // Volume
            ];
            
            // Add styles to header cells
            for (let r = 0; r < 4; r++) {
                const cellRef = XLSX.utils.encode_cell({ r: r, c: 0 });
                if (!ws[cellRef]) ws[cellRef] = { v: '' };
                ws[cellRef].s = {
                    font: { bold: true, sz: 14, color: { rgb: "000000" } },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
            
            // Add styles to data header row (row 5)
            const headerRow = 5;
            const headerCols = ['#', 'ناوی سیانی', 'مارکە', 'مۆبایل', 'ژمارەی کارتۆن', 'جۆری کاڵا', 'وەزن (کگم)', 'حەجم (م³)'];
            
            for (let c = 0; c < headerCols.length; c++) {
                const cellRef = XLSX.utils.encode_cell({ r: headerRow - 1, c: c });
                ws[cellRef] = { 
                    v: headerCols[c],
                    s: {
                        font: { bold: true, color: { rgb: "FFFFFF" } },
                        fill: { patternType: "solid", fgColor: { rgb: "3498DB" } },
                        alignment: { horizontal: "center", vertical: "center" }
                    }
                };
            }
            
            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'لیستی بارەکان');
            
            // Set RTL for the workbook
            wb.Workbook = wb.Workbook || {};
            wb.Workbook.Views = wb.Workbook.Views || [];
            wb.Workbook.Views[0] = wb.Workbook.Views[0] || {};
            wb.Workbook.Views[0].RTL = true;
            
            // Write the Excel file
            XLSX.writeFile(wb, 'لیستی_بارەکان.xlsx');
        })
        .catch(error => {
            console.error("Error preparing Excel export:", error);
            alert('هەڵەیەک ڕوویدا لە کاتی ئێکسپۆرتکردن بۆ ئێکسڵ: ' + error.message);
        });
}

// Export to PDF using html2pdf
function exportToPDF() {
    if (cargos.length === 0) {
        alert('هیچ بارێک نییە بۆ ئێکسپۆرتکردن!');
        return;
    }
    
    // ئامادەکردنی PDF Content
    let invoiceTitle = "لیستی بارەکان - کۆمپانیای گواستنەوە";
    let invoiceNumber = "";
    let invoiceDate = "";
    
    // Check for current invoice info
    if (currentInvoiceId) {
        db.collection('invoices').doc(currentInvoiceId).get()
            .then(doc => {
                if (doc.exists) {
                    const invoice = doc.data();
                    invoiceNumber = invoice.invoiceNumber || "";
                    invoiceDate = invoice.date || "";
                    
                    // Now proceed with PDF generation
                    createAndDownloadPDF(invoiceNumber, invoiceDate);
                } else {
                    // Invoice not found, generate PDF without invoice data
                    createAndDownloadPDF("", "");
                }
            })
            .catch(error => {
                console.error("Error getting invoice information:", error);
                // Generate PDF anyway without invoice data
                createAndDownloadPDF("", "");
            });
    } else {
        // No invoice selected, generate PDF without invoice data
        createAndDownloadPDF("", "");
    }
    
    function createAndDownloadPDF(invoiceNumber, invoiceDate) {
        // دروستکردنی پەیجێکی نوێ و جیاواز بۆ PDF ئێکسپۆرت
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('تکایە ڕێگەپێدان بدە بە پۆپ-ئەپ ویندۆ');
            return;
        }
        
        // بارکردنی زانیاریی مۆبایل بۆ هەموو مشتەریەکان
        const customerMobiles = {};
        
        // بۆ هەر بارێک، پێویستە زانیاریی مۆبایل بۆ مشتەریەکە ببینینەوە
        const promises = cargos.map(cargo => {
            const customer = customers.find(c => c.logo === cargo.brand);
            if (customer && !customerMobiles[customer.logo]) {
                return db.collection('persons')
                    .doc(customer.id)
                    .get()
                    .then(doc => {
                        if (doc.exists && doc.data().Mobil) {
                            customerMobiles[customer.logo] = doc.data().Mobil;
                        } else {
                            customerMobiles[customer.logo] = "";
                        }
                    })
                    .catch(error => {
                        console.error("Error getting customer mobile:", error);
                        customerMobiles[customer.logo] = "";
                    });
            }
            return Promise.resolve();
        });
        
        Promise.all(promises).then(() => {
            // کۆکردنەوەی زانیارییەکان
            const totalCount = cargos.length;
            const totalVolume = cargos.reduce((sum, cargo) => sum + cargo.volume, 0);
            const totalWeight = cargos.reduce((sum, cargo) => sum + cargo.weight, 0);
            const remainingVolume = containerVolume - totalVolume;
            
            // نووسینی HTML بۆ پەیجی نوێ
            printWindow.document.write(`
                <!DOCTYPE html>
                <html dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>${invoiceNumber ? `فاکس ${invoiceNumber}` : 'لیستی بارەکان'}</title>
                    <style>
                        body {
                            font-family: Arial, Tahoma, sans-serif;
                            direction: rtl;
                            padding: 20px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .company-name-ar {
                            font-size: 24px;
                            margin-bottom: 5px;
                        }
                        .company-name-en {
                            font-size: 18px;
                            margin-bottom: 15px;
                        }
                        .title {
                            font-size: 20px;
                            margin-bottom: 10px;
                        }
                        .invoice-info {
                            margin-bottom: 20px;
                            padding: 0 20px;
                            text-align: right;
                        }
                        .summary {
                            margin-bottom: 20px;
                            padding: 10px 20px;
                            background-color: #f9f9f9;
                            border-radius: 5px;
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 10px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                        }
                        th, td {
                            padding: 10px;
                            border: 1px solid #ddd;
                            text-align: right;
                        }
                        th {
                            background-color: #3498db;
                            color: white;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            color: #777;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 class="company-name-ar">جبل الطور للتجارة العامة ش.ذ.م-م</h1>
                        <h2 class="company-name-en">Jabal Al Toor general trading L.L.C</h2>
                        <h3 class="title">لیستی بارەکان - کۆمپانیای گواستنەوە</h3>
                        <p>بەرواری ئێکسپۆرت: ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    ${invoiceNumber ? `
                    <div class="invoice-info">
                        <p>ژمارەی فاکس: ${invoiceNumber}</p>
                        ${invoiceDate ? `<p>بەرواری فاکس: ${invoiceDate}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    <div class="summary">
                        <p>کۆی بارەکان: ${totalCount}</p>
                        <p>ژمارەی تراکەکان: ${truckCount}</p>
                        <p>کۆی حەجم: ${totalVolume.toFixed(2)} م³</p>
                        <p>حەجمی ماوە: ${remainingVolume.toFixed(2)} م³</p>
                        <p>کۆی وەزن: ${totalWeight.toFixed(2)} کگم</p>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>ناوی سیانی</th>
                                <th>مارکە</th>
                                <th>مۆبایل</th>
                                <th>ژ. کارتۆن</th>
                                <th>جۆری کاڵا</th>
                                <th>وەزن (کگم)</th>
                                <th>حەجم (م³)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cargos.map((cargo, index) => {
                                // Get mobile number for this cargo's brand
                                const mobileNumber = customerMobiles[cargo.brand] || "";
                                
                                return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${cargo.name}</td>
                                    <td>${cargo.brand}</td>
                                    <td>${mobileNumber}</td>
                                    <td>${cargo.cartonNumber}</td>
                                    <td>${cargo.type}</td>
                                    <td>${cargo.weight.toFixed(2)}</td>
                                    <td>${cargo.volume.toFixed(2)}</td>
                                </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>جبل الطور للتجارة العامة ش.ذ.م-م</p>
                        <p>Jabal Al Toor general trading L.L.C</p>
                    </div>
                    
                    <script>
                        // پاش چرکەیەک، چاپکردن دەستپێبکە
                        setTimeout(function() {
                            window.print();
                            // دوای چاپکردن، پەیجەکە داخە
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        }, 1000);
                    </script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
        });
    }
}