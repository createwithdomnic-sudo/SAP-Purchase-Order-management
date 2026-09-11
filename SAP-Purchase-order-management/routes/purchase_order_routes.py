from datetime import datetime

from database import get_db_connection


def create_purchase_order(data):

    vendor_id = data.get("vendor_id")

    items = data.get("items", [])

    if not vendor_id:

        raise ValueError("Vendor is required")

    if not items:

        raise ValueError("At least one material is required")

    connection = get_db_connection()

    cursor = connection.cursor()

    vendor = cursor.execute("""
        SELECT *
        FROM vendors
        WHERE id = ?
    """, (vendor_id,)).fetchone()

    if not vendor:

        connection.close()

        raise ValueError("Vendor not found")

    total_amount = 0

    validated_items = []

    for item in items:

        material_id = item.get("material_id")

        quantity = item.get("quantity")

        if not material_id:

            connection.close()

            raise ValueError("Material is required")

        if not quantity or int(quantity) <= 0:

            connection.close()

            raise ValueError(
                "Quantity must be greater than zero"
            )

        material = cursor.execute("""
            SELECT *
            FROM materials
            WHERE id = ?
        """, (material_id,)).fetchone()

        if not material:

            connection.close()

            raise ValueError(
                f"Material {material_id} not found"
            )

        quantity = int(quantity)

        if quantity > material["stock"]:

            connection.close()

            raise ValueError(
                f"Insufficient stock for {material['material_name']}"
            )

        item_total = material["price"] * quantity

        total_amount += item_total

        validated_items.append({
            "material_id": material_id,
            "quantity": quantity,
            "unit_price": material["price"]
        })

    order_date = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    cursor.execute("""
        INSERT INTO purchase_orders
        (
            vendor_id,
            order_date,
            total_amount,
            status,
            delivery_status
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        vendor_id,
        order_date,
        total_amount,
        "PENDING",
        "NOT DELIVERED"
    ))

    order_id = cursor.lastrowid

    for item in validated_items:

        cursor.execute("""
            INSERT INTO purchase_order_items
            (
                purchase_order_id,
                material_id,
                quantity,
                unit_price
            )
            VALUES (?, ?, ?, ?)
        """, (
            order_id,
            item["material_id"],
            item["quantity"],
            item["unit_price"]
        ))

    connection.commit()

    connection.close()

    return order_id


def update_order_status(order_id, status):

    connection = get_db_connection()

    cursor = connection.cursor()

    order = cursor.execute("""
        SELECT *
        FROM purchase_orders
        WHERE id = ?
    """, (order_id,)).fetchone()

    if not order:

        connection.close()

        raise ValueError("Purchase order not found")

    cursor.execute("""
        UPDATE purchase_orders
        SET status = ?
        WHERE id = ?
    """, (
        status,
        order_id
    ))

    connection.commit()

    connection.close()


def deliver_purchase_order(order_id):

    connection = get_db_connection()

    cursor = connection.cursor()

    order = cursor.execute("""
        SELECT *
        FROM purchase_orders
        WHERE id = ?
    """, (order_id,)).fetchone()

    if not order:

        connection.close()

        raise ValueError("Purchase order not found")

    if order["status"] != "APPROVED":

        connection.close()

        raise ValueError(
            "Only approved orders can be delivered"
        )

    if order["delivery_status"] == "DELIVERED":

        connection.close()

        raise ValueError(
            "Order is already delivered"
        )

    items = cursor.execute("""
        SELECT *
        FROM purchase_order_items
        WHERE purchase_order_id = ?
    """, (order_id,)).fetchall()

    for item in items:

        material = cursor.execute("""
            SELECT *
            FROM materials
            WHERE id = ?
        """, (item["material_id"],)).fetchone()

        if material["stock"] < item["quantity"]:

            connection.close()

            raise ValueError(
                f"Insufficient stock for material ID "
                f"{item['material_id']}"
            )

    for item in items:

        cursor.execute("""
            UPDATE materials
            SET stock = stock - ?
            WHERE id = ?
        """, (
            item["quantity"],
            item["material_id"]
        ))

    cursor.execute("""
        UPDATE purchase_orders
        SET delivery_status = ?
        WHERE id = ?
    """, (
        "DELIVERED",
        order_id
    ))

    cursor.execute("""
        UPDATE purchase_orders
        SET status = ?
        WHERE id = ?
    """, (
        "DELIVERED",
        order_id
    ))

    connection.commit()

    connection.close()