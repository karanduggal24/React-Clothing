import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProduct } from '../../Slices/AddProductSlice';
import { addToCart, selectCartItems } from '../../Slices/CartSlice';

function ProductsList() {
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  return (
    <div className="w-full mb-20 px-4" style={{marginBottom:"80px"}} >
      {/* <h2 className="text-3xl font-light text-center bg-white py-2 rounded-md">Products List</h2> */}

      <div style={{marginTop:"8px"}} className=" flex justify-around flex-wrap gap-6 mt-8">
        {products.map((product) => (
          <div
          style={{marginTop:"12px"}}
            key={product.id}
            className=" justify-between flex-col mt-12 bg-white w-60 rounded-lg shadow-md border border-black overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className="w-full h-60 bg-contain bg-center bg-no-repeat"
              style={product.img ? { backgroundImage: `url(${product.img})`, backgroundSize: 'cover' } : undefined}
            />

            <div className="bg-white flex flex-col items-center text-center border-t border-black p-3 gap-2">
              <div className="font-bold text-lg">
                <p style={{padding:"5px"}} className="m-0">{product.name}</p>
              </div>

              <div>
                <p style={{paddingLeft:"7px",paddingRight:"7px"}} className="m-0 text-sm text-black inline-block px-3 py-1 border border-black rounded-full">
                  {product.category}
                </p>
              </div>

              <div>
                <p style={{paddingLeft:"7px",paddingRight:"7px"}} className="m-0 font-bold text-white bg-black inline-block px-3 py-1 rounded-md">{product.price} Rs</p>
              </div>

              <button
              style={{padding:"7px",margin:"5px",marginBottom:"20px" }}
                onClick={() => dispatch(addToCart(product))}
                className="mt-3 rounded px-3 py-2 bg-white text-black border border-black uppercase text-xs font-medium hover:bg-black hover:text-white transition"
              >
                Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
