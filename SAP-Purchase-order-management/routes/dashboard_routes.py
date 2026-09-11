from flask import Blueprint, jsonify

from database import get_db_connection


dashboard_bp = Blueprint(
    "dashboard_bp",
    __name__,
    url_prefix="/api/dashboard"
)


@dashboard_bp.route("", methods=["GET"])
def dashboard():

    connection = get_db_connection()

    total_vendors = connection.execute("""
        SELECT COUNT(*)
        FROM vendors
    """).fetchone()[0]

    total_materials = connection.execute("""
        SELECT COUNT(*)
        FROM materials
    """).fetchone()[0]

    total_orders = connection.execute("""
        SELECT COUNT(*)
        FROM purchase_orders
    """).fetchone()[0]

    pending_orders = connection.execute("""
        SELECT COUNT(*)
        FROM purchase_orders
        WHERE status = 'PENDING'
    """).fetchone()[0]

    approved_orders = connection.execute("""
        SELECT COUNT(*)
        FROM purchase_orders
        WHERE status = 'APPROVED'
    """).fetchone()[0]

    delivered_orders = connection.execute("""
        SELECT COUNT(*)
        FROM purchase_orders
        WHERE status = 'DELIVERED'
    """).fetchone()[0]

    total_purchase_value = connection.execute("""
        SELECT COALESCE(SUM(total_amount), 0)
        FROM purchase_orders
    """).fetchone()[0]

    connection.close()

    return jsonify({
        "total_vendors": total_vendors,
        "total_materials": total_materials,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "approved_orders": approved_orders,
        "delivered_orders": delivered_orders,
        "total_purchase_value": total_purchase_value
    })