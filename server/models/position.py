from . import db

class Position(db.Model):
    __tablename__ = "positions"

    id = db.Column(db.Integer, primary_key=True)

    item_id = db.Column(db.Integer, nullable=False)
    item_name = db.Column(db.String, nullable=False)

    quantity = db.Column(db.Integer, nullable=False)
    buy_price = db.Column(db.Integer, nullable=False)

    notes = db.Column(db.Text)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
    
    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="positions"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "item_name": self.item_name,
            "quantity": self.quantity,
            "buy_price": self.buy_price,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "user_id": self.user_id
        }