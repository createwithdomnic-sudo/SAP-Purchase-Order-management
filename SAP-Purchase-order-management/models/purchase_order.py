from database import get_db_connection


def get_all_purchase_orders():

    connection = get_db_connection()

    orders = connection.execute("""
        SELECT
            po.id,
            po.order_date,
            po.total_amount,
            po.status,
            po.delivery_status,
            v.vendor_name
        FROM purchase_orders po
        JOIN vendors v
            ON po.vendor_id = v.id
        ORDER BY po.id DESC
    """).fetchall()

    connection.close()

    return [dict(order) for order in orders]


def get_purchase_order(order_id):

    connection = get_db_connection()

    order = connection.execute("""
        SELECT
            po.id,
            po.order_date,
            po.total_amount,
            po.status,
            po.delivery_status,
            v.vendor_name
        FROM purchase_orders po
        JOIN vendors v
            ON po.vendor_id = v.id
        WHERE po.id = ?
    """, (order_id,)).fetchone()

    if not order:

        connection.close()

        return None

    items = connection.execute("""
        SELECT
            poi.id,
            poi.material_id,
            m.material_name,
            poi.quantity,
            poi.unit_price
        FROM purchase_order_items poi
        JOIN materials m
            ON poi.material_id = m.id
        WHERE poi.purchase_order_id = ?
    """, (order_id,)).fetchall()

    connection.close()

    result = dict(order)

    result["items"] = [
        dict(item)
        for item in items
    ]

    return result