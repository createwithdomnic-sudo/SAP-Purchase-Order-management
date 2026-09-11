from database import get_db_connection


def get_all_vendors():

    connection = get_db_connection()

    vendors = connection.execute("""
        SELECT *
        FROM vendors
        ORDER BY id DESC
    """).fetchall()

    connection.close()

    return [dict(vendor) for vendor in vendors]


def get_vendor(vendor_id):

    connection = get_db_connection()

    vendor = connection.execute("""
        SELECT *
        FROM vendors
        WHERE id = ?
    """, (vendor_id,)).fetchone()

    connection.close()

    return dict(vendor) if vendor else None


def create_vendor(data):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO vendors
        (vendor_name, email, phone, address)
        VALUES (?, ?, ?, ?)
    """, (
        data.get("vendor_name"),
        data.get("email"),
        data.get("phone"),
        data.get("address")
    ))

    connection.commit()

    vendor_id = cursor.lastrowid

    connection.close()

    return vendor_id


def delete_vendor(vendor_id):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM vendors
        WHERE id = ?
    """, (vendor_id,))

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    return deleted