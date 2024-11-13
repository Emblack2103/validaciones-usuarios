$(document).ready(function() {
    const userRole = sessionStorage.getItem("role");

    if (userRole === "user") {
        $('#dataTableLink').hide();
        $('#datatable-view').hide();
    }

    $('#myTable').DataTable();

    let cart = [];
    
    function customEvent(eventName, eventData) {
        const event = new CustomEvent(eventName, {
            detail: eventData
        });
        document.dispatchEvent(event);
    }

    $('.view-products').click(function() {
        $('#product-view').show();
        $('#datatable-view').hide();
        $('#cart-view').hide();

        customEvent('view-products-clicked', { view: 'products' });
    });

    $('.view-datatable').click(function() {
        $('#product-view').hide();
        $('#datatable-view').show();
        $('#cart-view').hide();

        customEvent('view-datatable-clicked', { view: 'datatable' });
    });

    $('.view-cart').click(function() {
        $('#product-view').hide();
        $('#datatable-view').hide();
        $('#cart-view').show();
        updateCartView();

        customEvent('view-cart-clicked', { view: 'cart' });
    });

    $('.add-to-cart').click(function() {
        const product = $(this).closest('.product');
        const name = product.data('name');
        const price = product.data('price');
        cart.push({ name: name, price: price });
        $('.cart-count').text(cart.length); 

        showAlert(`${name} ha sido añadido al carrito`);

        customEvent('add-to-cart', { product: { name: name, price: price } });
    });

    
    function showAlert(message) {
        const alertDiv = $('<div class="alert"></div>').text(message);
        $('body').append(alertDiv);
        
        setTimeout(function() {
            alertDiv.fadeOut(500, function() {
                $(this).remove();
            });
        }, 3000);
    }

    function updateCartView() {
        $('#cart-items').empty(); 
        let total = 0; 
        cart.forEach((item, index) => {
            $('#cart-items').append(`
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td><button class="remove-from-cart" data-index="${index}">Eliminar</button></td>
                </tr>
            `);
            total += item.price; 
        });
        $('#cart-items').append(`
            <tr>
                <td colspan="2"><strong>Total Productos: $${total.toFixed(2)}</strong></td>
            </tr>
        `);

        customEvent('cart-updated', { cart: cart });
    }

    $('#checkout-button').click(function() {
        const descuentoPorcentaje = parseFloat($('#input-descuento').val()) || 0; 
        const costoEnvio = parseFloat($('#input-envio').val()) || 0; 
        let totalCarrito = 0;

        cart.forEach(item => {
            totalCarrito += item.price;
        });

        if (descuentoPorcentaje > 0 && descuentoPorcentaje <= 100) {
            const descuento = (totalCarrito * descuentoPorcentaje) / 100; 
            totalCarrito -= descuento;
        }

        totalCarrito += costoEnvio;

        alert(`Total a pagar: $${totalCarrito.toFixed(2)}\n(Incluye un ${descuentoPorcentaje}% de descuento y envío de $${costoEnvio})`);

        customEvent('checkout-completed', { total: totalCarrito });
    });

    $(document).on('click', '.remove-from-cart', function() {
        const index = $(this).data('index');
        cart.splice(index, 1); 
        $('.cart-count').text(cart.length); 
        updateCartView();

        customEvent('remove-from-cart', { index: index });
    });

    $('#clear-cart-button').click(function() {
        cart = []; 
        $('.cart-count').text(cart.length); 
        updateCartView();

        customEvent('cart-cleared', { cart: cart });
    });

    $('.menu-button').click(function() {
        const menuContainer = $(this).closest('.menu-container');
        menuContainer.toggleClass('active');

        customEvent('menu-toggle', { active: menuContainer.hasClass('active') });
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('.menu-container').length) {
            $('.menu-container').removeClass('active');

            customEvent('menu-closed', { reason: 'click-outside' });
        }
    });

    $('.dropdown-menu a:contains("Saber más de nosotros")').click(function() {
        alert("¡Gracias por tu interés en nosotros!");
        customEvent('more-info-clicked', { info: 'about-us' });
    });

    $('#search-bar').on('input', function() {
        const query = $(this).val().toLowerCase();
        $('.product').each(function() {
            const productName = $(this).data('name').toLowerCase();
            $(this).toggle(productName.includes(query));
        });

        customEvent('search-input', { query: query });
    });

    $('.view-cart').hover(function() {
        const itemCount = cart.length;
        if (itemCount === 0) {
            $(this).attr('title', 'El carrito está vacío');
        } else {
            $(this).attr('title', `Tienes ${itemCount} artículo(s) en el carrito`);
        }

        customEvent('cart-hover', { itemCount: itemCount });
    });

    $('.view-cart').on('mouseenter', function() {
        const cartPreview = $('<div class="cart-preview"></div>');
        cart.forEach(item => {
            cartPreview.append(`<p>${item.name} - $${item.price}</p>`);
        });
        $('body').append(cartPreview);
        cartPreview.css({
            'position': 'absolute',
            'top': $(this).offset().top + 50,
            'left': $(this).offset().left,
            'border': '1px solid #ccc',
            'padding': '10px',
            'background-color': '#fff'
        });

        customEvent('cart-preview-shown', { cartPreview: true });
    });

    $('.view-cart').on('mouseleave', function() {
        $('.cart-preview').remove();

        customEvent('cart-preview-hidden', { cartPreview: false });
    });
});
