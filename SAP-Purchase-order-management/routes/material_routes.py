from flask import Blueprint, request, jsonify

from models.material import (
    get_all_materials,
    get_material,
    create_material
)


material_bp = Blueprint(
    "material_bp",
    __name__,
    url_prefix="/api/materials"
)


@material_bp.route("", methods=["GET"])
def get_materials():

    materials = get_all_materials()

    return jsonify(materials)


@material_bp.route("/<int:material_id>", methods=["GET"])
def get_single_material(material_id):

    material = get_material(material_id)

    if not material:

        return jsonify({
            "error": "Material not found"
        }), 404

    return jsonify(material)


@material_bp.route("", methods=["POST"])
def add_material():

    data = request.get_json() or {}

    required_fields = [
        "material_name",
        "price"
    ]

    for field in required_fields:

        if data.get(field) is None:

            return jsonify({
                "error": f"{field} is required"
            }), 400

    try:

        price = float(data["price"])

        stock = int(data.get("stock", 0))

        if price < 0 or stock < 0:

            raise ValueError

    except ValueError:

        return jsonify({
            "error": "Price and stock must be valid numbers"
        }), 400

    data["price"] = price

    data["stock"] = stock

    material_id = create_material(data)

    return jsonify({
        "message": "Material created successfully",
        "id": material_id
    }), 201