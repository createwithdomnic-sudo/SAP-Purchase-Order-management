const API = "http://127.0.0.1:5000/api";

let vendorsData = [];


// ======================================================
// NAVIGATION
// ======================================================

function showSection(sectionId, button) {

    document.querySelectorAll(".section")
        .forEach(section => {

            section.classList.add("hidden");

        });


    document.getElementById(sectionId)
        .classList.remove("hidden");


    document.querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    const names = {

        dashboard: "Dashboard",

        vendors: "Vendors",

        materials: "Materials",

        orders: "Purchase Orders"

    };


    document.getElementById("pageName")
        .textContent = names[sectionId];


    if (sectionId === "dashboard") {

        loadDashboard();

    }


    if (sectionId === "vendors") {

        loadVendors();

    }


    if (sectionId === "materials") {

        loadMaterials();

    }


    if (sectionId === "orders") {

        loadVendors();

        loadMaterials();

        loadOrders();

    }

}


// ======================================================
// MODALS
// ======================================================

function openModal(id) {

    document.getElementById(id)
        .classList.add("show");

}


function closeModal(id) {

    document.getElementById(id)
        .classList.remove("show");

}


window.addEventListener("click", function(event) {

    document.querySelectorAll(".modal")
        .forEach(modal => {

            if (event.target === modal) {

                modal.classList.remove("show");

            }

        });

});


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API}/dashboard`);

        const data =
            await response.json();


        document.getElementById("totalVendors")
            .textContent = data.total_vendors;


        document.getElementById("totalMaterials")
            .textContent = data.total_materials;


        document.getElementById("totalOrders")
            .textContent = data.total_orders;


        document.getElementById("deliveredOrders")
            .textContent = data.delivered_orders;


        document.getElementById("pendingOrders")
            .textContent = data.pending_orders;


        document.getElementById("approvedOrders")
            .textContent = data.approved_orders;


        document.getElementById("deliveredOrders2")
            .textContent = data.delivered_orders;


        document.getElementById("purchaseValue")
            .textContent =
            "₹" +
            Number(data.total_purchase_value)
                .toLocaleString("en-IN");


        document.getElementById("orderCount")
            .textContent = data.total_orders;


        document.getElementById("orderPending")
            .textContent = data.pending_orders;


        document.getElementById("orderApproved")
            .textContent = data.approved_orders;


        document.getElementById("orderDelivered")
            .textContent = data.delivered_orders;


        updateBars(data);

    }

    catch (error) {

        console.error(error);

    }

}


function updateBars(data) {

    const total =
        data.total_orders || 1;


    document.getElementById("pendingBar")
        .style.width =
        `${(data.pending_orders / total) * 100}%`;


    document.getElementById("approvedBar")
        .style.width =
        `${(data.approved_orders / total) * 100}%`;


    document.getElementById("deliveredBar")
        .style.width =
        `${(data.delivered_orders / total) * 100}%`;

}


// ======================================================
// VENDORS
// ======================================================

async function loadVendors() {

    try {

        const response =
            await fetch(`${API}/vendors`);

        vendorsData =
            await response.json();


        renderVendors(vendorsData);


        const select =
            document.getElementById("orderVendor");


        select.innerHTML =
            `<option value="">
                Select vendor
             </option>`;


        vendorsData.forEach(vendor => {

            select.innerHTML += `

                <option value="${vendor.id}">

                    ${vendor.vendor_name}

                </option>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}


function renderVendors(vendors) {

    const table =
        document.getElementById("vendorTable");


    table.innerHTML = "";


    if (vendors.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center">

                    No vendors found

                </td>

            </tr>

        `;

        return;

    }


    vendors.forEach(vendor => {

        table.innerHTML += `

            <tr>

                <td>
                    <strong>
                        V-${String(vendor.id)
                            .padStart(3, "0")}
                    </strong>
                </td>

                <td>

                    <strong>
                        ${vendor.vendor_name}
                    </strong>

                </td>

                <td>
                    ${vendor.email || "-"}
                </td>

                <td>
                    ${vendor.phone || "-"}
                </td>

                <td>
                    ${vendor.address || "-"}
                </td>

                <td>

                    <button
                        class="action-btn delete"
                        onclick="deleteVendor(${vendor.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}


function filterVendors() {

    const search =
        document.getElementById("vendorSearch")
            .value
            .toLowerCase();


    const filtered =
        vendorsData.filter(vendor =>

            vendor.vendor_name
                .toLowerCase()
                .includes(search)

        );


    renderVendors(filtered);

}


// ======================================================
// ADD VENDOR
// ======================================================

document.getElementById("vendorForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const data = {

                vendor_name:
                    document.getElementById(
                        "vendorName"
                    ).value,

                email:
                    document.getElementById(
                        "vendorEmail"
                    ).value,

                phone:
                    document.getElementById(
                        "vendorPhone"
                    ).value,

                address:
                    document.getElementById(
                        "vendorAddress"
                    ).value

            };


            try {

                const response =
                    await fetch(
                        `${API}/vendors`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                alert(
                    result.message ||
                    result.error
                );


                if (response.ok) {

                    this.reset();

                    closeModal("vendorModal");

                    loadVendors();

                    loadDashboard();

                }

            }

            catch (error) {

                alert(
                    "Unable to connect to API"
                );

            }

        }
    );


// ======================================================
// DELETE VENDOR
// ======================================================

async function deleteVendor(id) {

    if (!confirm(
        "Are you sure you want to delete this vendor?"
    )) {

        return;

    }


    const response =
        await fetch(
            `${API}/vendors/${id}`,
            {

                method: "DELETE"

            }
        );


    const result =
        await response.json();


    alert(
        result.message ||
        result.error
    );


    loadVendors();

    loadDashboard();

}


// ======================================================
// MATERIALS
// ======================================================

async function loadMaterials() {

    try {

        const response =
            await fetch(`${API}/materials`);

        const materials =
            await response.json();


        const table =
            document.getElementById(
                "materialTable"
            );


        const cards =
            document.getElementById(
                "materialCards"
            );


        const select =
            document.getElementById(
                "orderMaterial"
            );


        table.innerHTML = "";

        cards.innerHTML = "";

        select.innerHTML =
            `<option value="">
                Select material
             </option>`;


        materials.forEach(material => {


            // TABLE

            table.innerHTML += `

                <tr>

                    <td>
                        <strong>
                            M-${String(material.id)
                                .padStart(3, "0")}
                        </strong>
                    </td>

                    <td>

                        <strong>
                            ${material.material_name}
                        </strong>

                    </td>

                    <td>
                        ${material.category || "-"}
                    </td>

                    <td>

                        ₹${Number(material.price)
                            .toLocaleString("en-IN")}

                    </td>

                    <td>

                        <span class="status delivered">

                            ${material.stock} units

                        </span>

                    </td>

                </tr>

            `;


            // CARDS

            cards.innerHTML += `

                <div class="material-card">

                    <div class="material-card-top">

                        <div class="material-icon">
                            ▦
                        </div>

                        <span class="status approved">

                            ACTIVE

                        </span>

                    </div>


                    <h3>
                        ${material.material_name}
                    </h3>


                    <p>
                        ${material.category || "General"}
                    </p>


                    <div class="stock">

                        <span>
                            Stock
                        </span>

                        <strong>
                            ${material.stock} units
                        </strong>

                    </div>

                </div>

            `;


            // SELECT

            select.innerHTML += `

                <option value="${material.id}">

                    ${material.material_name}
                    — ₹${Number(material.price)
                        .toLocaleString("en-IN")}

                </option>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}


// ======================================================
// ADD MATERIAL
// ======================================================

document.getElementById("materialForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const data = {

                material_name:
                    document.getElementById(
                        "materialName"
                    ).value,

                category:
                    document.getElementById(
                        "materialCategory"
                    ).value,

                price:
                    Number(
                        document.getElementById(
                            "materialPrice"
                        ).value
                    ),

                stock:
                    Number(
                        document.getElementById(
                            "materialStock"
                        ).value
                    )

            };


            const response =
                await fetch(
                    `${API}/materials`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            alert(
                result.message ||
                result.error
            );


            if (response.ok) {

                this.reset();

                closeModal("materialModal");

                loadMaterials();

                loadDashboard();

            }

        }
    );


// ======================================================
// PURCHASE ORDERS
// ======================================================

async function loadOrders() {

    try {

        const response =
            await fetch(
                `${API}/purchase-orders`
            );


        const orders =
            await response.json();


        const table =
            document.getElementById(
                "orderTable"
            );


        table.innerHTML = "";


        orders.forEach(order => {

            let actions = "";


            if (order.status === "PENDING") {

                actions += `

                    <button
                        class="action-btn approve"
                        onclick="approveOrder(${order.id})">

                        Approve

                    </button>

                `;

            }


            if (
                order.status === "APPROVED" &&
                order.delivery_status !== "DELIVERED"
            ) {

                actions += `

                    <button
                        class="action-btn deliver"
                        onclick="deliverOrder(${order.id})">

                        Deliver

                    </button>

                `;

            }


            let statusClass =
                order.status.toLowerCase();


            let deliveryClass =
                order.delivery_status
                    .toLowerCase()
                    .replace("_", "");


            table.innerHTML += `

                <tr>

                    <td>

                        <strong>
                            PO-${String(order.id)
                                .padStart(4, "0")}
                        </strong>

                    </td>


                    <td>
                        ${order.vendor_name}
                    </td>


                    <td>
                        ${order.order_date}
                    </td>


                    <td>

                        <strong>
                            ₹${Number(
                                order.total_amount
                            ).toLocaleString("en-IN")}
                        </strong>

                    </td>


                    <td>

                        <span class="status ${statusClass}">

                            ${order.status}

                        </span>

                    </td>


                    <td>

                        <span class="status delivered">

                            ${order.delivery_status}

                        </span>

                    </td>


                    <td>

                        ${actions}

                    </td>

                </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}


// ======================================================
// CREATE PO
// ======================================================

document.getElementById("orderForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const vendorId =
                Number(
                    document.getElementById(
                        "orderVendor"
                    ).value
                );


            const materialId =
                Number(
                    document.getElementById(
                        "orderMaterial"
                    ).value
                );


            const quantity =
                Number(
                    document.getElementById(
                        "orderQuantity"
                    ).value
                );


            const data = {

                vendor_id: vendorId,

                items: [

                    {

                        material_id: materialId,

                        quantity: quantity

                    }

                ]

            };


            const response =
                await fetch(
                    `${API}/purchase-orders`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            alert(
                result.message ||
                result.error
            );


            if (response.ok) {

                this.reset();

                closeModal("orderModal");

                loadOrders();

                loadDashboard();

            }

        }
    );


// ======================================================
// APPROVE PO
// ======================================================

async function approveOrder(id) {

    const response =
        await fetch(
            `${API}/purchase-orders/${id}/approve`,
            {

                method: "PUT"

            }
        );


    const result =
        await response.json();


    alert(
        result.message ||
        result.error
    );


    loadOrders();

    loadDashboard();

}


// ======================================================
// DELIVER PO
// ======================================================

async function deliverOrder(id) {

    const response =
        await fetch(
            `${API}/purchase-orders/${id}/deliver`,
            {

                method: "PUT"

            }
        );


    const result =
        await response.json();


    alert(
        result.message ||
        result.error
    );


    loadOrders();

    loadMaterials();

    loadDashboard();

}


// ======================================================
// INITIALIZE
// ======================================================

loadDashboard();