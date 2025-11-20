function CartItem({ item, loading, onIncrement, onDecrement, onRemove, onProductClick }) {
  return (
    <div className='border border-black bg-white transition-all duration-200 ease-in-out hover:shadow-md'>
      {/* Mobile Layout */}
      <div className='md:hidden'>
        <div className='flex items-center gap-3' style={{ padding: '12px' }}>
          <div className='bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-gray-400 transition-colors' style={{ width: '45px', height: '80px' }}>
            {item.img ? (
              <img onClick={() => onProductClick(item.id)} src={item.img} alt={item.name} className='w-full h-full object-cover' />
            ) : (
              <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs'>No Image</div>
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='font-medium text-sm text-black truncate'>{item.name}</div>
            <div className='text-gray-600 text-xs' style={{ marginBottom: '4px' }}>{item.category}</div>
            <div className='text-black font-medium text-sm'>Rs {item.price}</div>
          </div>
          <div className='text-right'>
            <div className='text-sm font-medium text-black'>Rs {item.price * item.quantity}</div>
          </div>
        </div>
        <div className='flex items-center justify-between border-t border-gray-100' style={{ padding: '8px 12px 12px 12px' }}>
          <div className='flex items-center gap-1 bg-gray-50 rounded-md' style={{ padding: '4px' }}>
            <button onClick={() => onDecrement(item)} disabled={loading} className='w-7 h-7 border border-gray-300 bg-white text-black flex items-center justify-center text-sm rounded transition-all hover:bg-black hover:text-white hover:border-black disabled:opacity-50'>-</button>
            <span className='text-sm font-medium text-black min-w-8 text-center' style={{ padding: '0 8px' }}>{item.quantity}</span>
            <button onClick={() => onIncrement(item)} disabled={loading} className='w-7 h-7 border border-gray-300 bg-white text-black flex items-center justify-center text-sm rounded transition-all hover:bg-black hover:text-white hover:border-black disabled:opacity-50'>+</button>
          </div>
          <button onClick={() => onRemove(item)} disabled={loading} className='text-xs border border-red-300 text-red-600 bg-red-50 rounded transition-all hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50' style={{ padding: '4px 12px' }}>Remove</button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='hidden md:flex md:items-center gap-5' style={{ padding: '20px' }}>
        <div className='bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:border-gray-400 transition-colors' style={{ width: '72px', height: '128px' }} onClick={() => onProductClick(item.id)}>
          {item.img ? (
            <img src={item.img} alt={item.name} className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm'>No Image</div>
          )}
        </div>
        <div className='flex-1 text-gray-800'>
          <div className='font-medium text-lg text-black' style={{ marginBottom: '4px' }}>{item.name}</div>
          <div className='text-gray-600 text-sm' style={{ marginBottom: '4px' }}>{item.category}</div>
          <div className='text-black font-medium text-base'>Rs {item.price}</div>
          <div className='text-xs text-gray-500' style={{ marginTop: '4px' }}>Stock: {item.stockQuantity > 0 ? item.stockQuantity : 'Out of stock'}</div>
        </div>
        <div className='flex items-center gap-3'>
          <button onClick={() => onDecrement(item)} disabled={loading} className='w-8 h-8 border border-black bg-white text-black flex items-center justify-center font-light text-base transition-all hover:bg-black hover:text-white disabled:opacity-50'>-</button>
          <span className='min-w-6 text-center font-medium text-black'>{item.quantity}</span>
          <button onClick={() => onIncrement(item)} disabled={loading} className='w-8 h-8 border border-black bg-white text-black flex items-center justify-center font-light text-base transition-all hover:bg-black hover:text-white disabled:opacity-50'>+</button>
        </div>
        <div className='flex flex-row items-center justify-end gap-5'>
          <div className='text-right font-medium text-black text-base'>Rs {item.price * item.quantity}</div>
          <button onClick={() => onRemove(item)} disabled={loading} className='border border-black bg-white text-black text-sm font-normal cursor-pointer transition-all hover:bg-black hover:text-white disabled:opacity-50' style={{ padding: '8px 16px' }}>Remove</button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
