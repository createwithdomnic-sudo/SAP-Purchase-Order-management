from flask import Blueprint, request, jsonify

from models.vendor import (
    get_all_vendors,
    get_vendor,
    create_vendor,
    delete_vendor
)


vendor_bp = Blueprint(
    "vendor_bp",
    __name__,
    url_prefix="/api/vendors"
)


@vendor_bp.route("", methods=["GET"])
def get_vendors():

    vendors = get_all_vendors()

    return jsonify(vendors)


@vendor_bp.route("/<int:vendor_id>", methods=["GET"])
def get_single_vendor(vendor_id):

    vendor = get_vendor(vendor_id)

    if not vendor:

        return jsonify({
            "error": "Vendor not found"
        }), 404

    return jsonify(vendor)


@vendor_bp.route("", methods=["POST"])
def add_vendor():

    data = request.get_json() or {}

    if not data.get("vendor_name"):

        return jsonify({
            "error": "Vendor name is required"
        }), 400

    vendor_id = create_vendor(data)

    return jsonify({
        "message": "Vendor created successfully",
        "id": vendor_id
    }), 201


@vendor_bp.route("/<int:vendor_id>", methods=["DELETE"])
def remove_vendor(vendor_id):

    deleted = delete_vendor(vendor_id)

    if not deleted:

        return jsonify({
            "error": "Vendor not found"
        }), 404

    return jsonify({
        "message": "Vendor deleted successfully"
    })