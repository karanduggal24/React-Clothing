from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from models.Orders import orders
from config.db import conn
from Schemas.Orders import OrderCreate, OrderUpdate

router = APIRouter()

@router.get("/")
def get_orders(
    status: Optional[str] = Query(None, description="Filter by status"),
    customer_email: Optional[str] = Query(None, description="Filter by customer email")
):
    """Get all orders with optional filters"""
    try:
        query = orders.select()
        
        if status:
            query = query.where(orders.c.status == status)
        if customer_email:
            query = query.where(orders.c.customer_email == customer_email)
        
        result = conn.execute(query.order_by(orders.c.order_date.desc())).fetchall()
        
        orders_list = []
        for row in result:
            orders_list.append({
                "id": row.id,
                "order_id": row.order_id,
                "customer_name": row.customer_name,
                "customer_email": row.customer_email,
                "customer_phone": row.customer_phone,
                "address": row.address,
                "city": row.city,
                "state": row.state,
                "pincode": row.pincode,
                "country": row.country,
                "order_items": row.order_items,
                "total_items": row.total_items,
                "total_price": row.total_price,
                "status": row.status,
                "shipping_id": row.shipping_id,
                "shipping_company": row.shipping_company,
                "order_date": row.order_date.isoformat() if row.order_date else None,
                "updated_at": row.updated_at.isoformat() if row.updated_at else None
            })
        
        return orders_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


@router.get("/{order_id}")
def get_order(order_id: str):
    """Get a single order by order_id"""
    try:
        query = orders.select().where(orders.c.order_id == order_id)
        result = conn.execute(query).fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
        
        return {
            "id": result.id,
            "order_id": result.order_id,
            "customer_name": result.customer_name,
            "customer_email": result.customer_email,
            "customer_phone": result.customer_phone,
            "address": result.address,
            "city": result.city,
            "state": result.state,
            "pincode": result.pincode,
            "country": result.country,
            "order_items": result.order_items,
            "total_items": result.total_items,
            "total_price": result.total_price,
            "status": result.status,
            "shipping_id": result.shipping_id,
            "shipping_company": result.shipping_company,
            "order_date": result.order_date.isoformat() if result.order_date else None,
            "updated_at": result.updated_at.isoformat() if result.updated_at else None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching order: {str(e)}")


@router.post("/")
async def create_order(data: OrderCreate):
    """Create a new order"""
    try:
        # Check if order_id already exists
        check_query = orders.select().where(orders.c.order_id == data.order_id)
        existing = conn.execute(check_query).fetchone()
        
        if existing:
            raise HTTPException(status_code=400, detail=f"Order {data.order_id} already exists")
        
        # Insert order
        result = conn.execute(orders.insert().values(
            order_id=data.order_id,
            customer_name=data.customer_name,
            customer_email=data.customer_email,
            customer_phone=data.customer_phone,
            address=data.address,
            city=data.city,
            state=data.state,
            pincode=data.pincode,
            country=data.country,
            order_items=data.order_items,  # SQLAlchemy JSON type handles serialization
            total_items=data.total_items,
            total_price=data.total_price,
            status=data.status
        ))

        
        return {
            "message": "Order created successfully",
            "order_id": data.order_id,
            "id": result.lastrowid
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error creating order: {str(e)}")


@router.patch("/{order_id}")
async def update_order(order_id: str, data: OrderUpdate):
    """Update order status, shipping ID, or shipping company"""
    try:
        # Check if order exists
        check_query = orders.select().where(orders.c.order_id == order_id)
        existing = conn.execute(check_query).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
        
        # Build update dict
        update_data = {}
        if data.status is not None:
            update_data['status'] = data.status
        if data.shipping_id is not None:
            update_data['shipping_id'] = data.shipping_id
        if data.shipping_company is not None:
            update_data['shipping_company'] = data.shipping_company
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Update order
        update_query = orders.update().where(orders.c.order_id == order_id).values(**update_data)
        conn.execute(update_query)

        
        return {
            "message": "Order updated successfully",
            "order_id": order_id,
            "updated_fields": list(update_data.keys())
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error updating order: {str(e)}")


@router.delete("/{order_id}")
async def delete_order(order_id: str):
    """Delete an order"""
    try:
        # Check if order exists
        check_query = orders.select().where(orders.c.order_id == order_id)
        existing = conn.execute(check_query).fetchone()
        
        if not existing:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
        
        # Delete order
        delete_query = orders.delete().where(orders.c.order_id == order_id)
        conn.execute(delete_query)

        
        return {
            "message": "Order deleted successfully",
            "order_id": order_id
        }
    except HTTPException:
        raise
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Error deleting order: {str(e)}")
