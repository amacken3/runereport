from marshmallow import Schema, fields


class PositionSchema(Schema):
    id = fields.Int(dump_only=True)
    item_id = fields.Int(required=True)
    item_name = fields.Str(required=True)
    quantity = fields.Int(required=True)
    buy_price = fields.Int(required=True)
    notes = fields.Str(allow_none=True)
    user_id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)