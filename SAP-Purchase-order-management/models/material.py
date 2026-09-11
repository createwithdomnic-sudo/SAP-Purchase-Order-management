from database import get_db_connection


def get_all_materials():

    connection = get_db_connection()

    materials = connection.execute("""
        SELECT *
        FROM materials
        ORDER BY id DESC
    """).fetchall()

    connection.close()

    return [dict(material) for material in materials]


def get_material(material_id):

    connection = get_db_connection()

    material = connection.execute("""
        SELECT *
        FROM materials
        WHERE id = ?
    """, (material_id,)).fetchone()

    connection.close()

    return dict(material) if material else None


def create_material(data):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO materials
        (material_name, category, price, stock)
        VALUES (?, ?, ?, ?)
    """, (
        data.get("material_name"),
        data.get("category"),
        data.get("price"),
        data.get("stock", 0)
    ))

    connection.commit()

    material_id = cursor.lastrowid

    connection.close()

    return material_id