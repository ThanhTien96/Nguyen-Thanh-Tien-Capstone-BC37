/**
Bài Tập capstone API

Ngày Tạo: 20/10/2022

Người Tạo: Nguyễn Thanh Tiến

Version: v1.0.0 

 */


// hàm rút gọn get id
function getMyId(id) {
    return document.getElementById(id);
};
const URI = "https://6336fca465d1e8ef2677b3aa.mockapi.io/phone";


// biến global
let phoneList = [];
let cartItem = []

// get data API
function getAllPhone() {
    // call API with method GET
    axios({
        method: "get",
        url: URI,

    }).then((res) => {
        // đổ dữ liệu ra biến GLOBAL
        phoneList = res.data
        //render ra giao diện
        renderProductAll(res.data);

    }).catch((err) => {
        console.log(err);
    });

};


// gọi hàm chạy khi vừa vô
window.onload = function () {
    // lấy giữ liệu khi vừa vô
    getAllPhone();
    //load lại dữ liệu giỏ hàng dưới local
    reloadData();
}



// luu xuong localstorage
function setLocalStorage(note, listData) {
    localStorage.setItem(note, JSON.stringify(listData));
}

// get data form localStorage
function getLocalStorage(note) {
    let result = JSON.parse(localStorage.getItem(note));
    if(!result) result = [];
    return result;
}

// hàm tạo thẻ HTML
function createHTML(image, name, price, id) {
    return html = `
    <div class="item col-lg-3 mb-3">
        <div class="item__detail">
            <div class="item__top">
                <div class="item__img">
                    <img src="${image}" alt="phone"
                        class="img-fluid">
                    <img src="./img/06-210x210.jpg" alt="phone"
                        class="img-fluid">
                </div>

                <div class="item__saleOff">
                    <span>sale</span>
                </div>
                <div class="item__shop">
                    <button onclick="addToCart('${id}')"><i class="fa fa-shopping-cart"></i></button>
                    <button><i class="fa fa-heart"></i></button>
                    <button><i class="fa fa-exchange"></i></button>
                </div>
            </div>
            <div class="item__bottom">
                <p>${name}</p>
                <div class="item__rank">
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>
                    <span><i class="fa fa-star"></i></span>

                </div>
                <div class="item__price">
                    <span><b>${price.toLocaleString()}</b><b>$</b></span>
                    <span><b>1200</b><b>$</b></span>
                </div>
            </div>
        </div>

        
    </div>
    `


}


// render sản phẩm all 
function renderProductAll(arrPhone, id) {
    if (!arrPhone) arrPhone = phoneList;

    // tạo biến hứng kết quả để in ra giao diện
    let phoneHTML = "";

    // map san phẩm ra thẻ html
    arrPhone.map((sp) => {

        phoneHTML += createHTML(sp.image, sp.name, sp.price, sp.id);
    });
    // render ra giao diện
    if (!id) id = 'allItem';
    getMyId(id).innerHTML = phoneHTML;
}



// render điện thoại hãng iphone

function renderTypePhone(type, id) {

    let iphoneHTML = '';

    let phone = phoneList.filter(sp => sp.type === type)


    phone.map((sp) => {
        iphoneHTML += createHTML(sp.image, sp.name, sp.price, sp.id);
    })

    // render ra giao dien
    if (!id) id = 'allItem';
    getMyId(id).innerHTML = iphoneHTML;

}

// render trang san pham theo type

function renderType(type) {

    renderTypePhone(type, 'renderType');
}


// hàm tìm kiếm

function searchPhone() {

    // lấy giá trị input và mảng sản phẩm dưới local ra 
    let keyWord = (getMyId('keyWord').value).toLowerCase();

    let result = [];
    for (let i in phoneList) {
        let phoneType = phoneList[i].type.toLowerCase().trim();
        let phoneName = phoneList[i].name.toLowerCase().trim();
        if (phoneName.includes(keyWord) || phoneType.includes(keyWord)) {
            result.push(phoneList[i]);
        }
    }
    renderProductAll(result, 'renderType')
}

// tạo sản phẩm mới cho giỏ hàng có thêm thuộc tính là số lượng



// add to cart
function addToCart(id) {
    
    let item = phoneList.find(sp => sp.id === id);
    let cartShop = {product: item, quantity: 1}
    
    if(!cartItem){
        cartItem.push(cartShop)
        getMyId('quantity').innerHTML = cartItem.quantity;
        return;
    }else{
        for (let i = 0; i < cartItem.length; i++){
            if(cartItem[i].product.id === item.id){
                cartItem[i].quantity += 1;
                return;
            }
        }
        
        cartItem.push(cartShop);
               
    }
    let quantity = cartItem.reduce((total,item) => {
        return total += item.quantity;
    },0)
   getMyId('quantity').innerHTML = quantity
   setLocalStorage('cartLocal', cartItem);
    
}

// hàm render giỏ hàng
function renderCart() {
        
    let renderHTML = '';
    cartItem.map((item) => {
        renderHTML += `
        <div class="item-cart">
        <div class="cart-img">
            <img src="${item.product.image}" class="img-fluid">
        </div>
        <div class="countItem">
        <i onclick="addQuantity('${item.product.id}')" class="fa fa-angle-up"></i>
        <span class="amount">X ${item.quantity}</span>
        <i onclick="reduceNum('${item.product.id}')" class="fa fa-angle-down"></i>
        </div>
        <div class="cart-name">
        <span>${item.product.name}</span>
        <span class="price">$ ${item.product.price.toLocaleString()}</span>
        </div>
        <i onclick="deletedCart('${item.product.id}')" class="fa fa-trash-alt remove-cart"></i>
        
    </div>
        `
    });
    // tính tổng tiền:
    let total = cartItem.reduce((totalAll, item, index) => {
        return totalAll += item.product.price * item.quantity;
    }, 0);
    getMyId('totalAllItem').innerHTML = `${total.toLocaleString()} $`;
    // in ra giao diện
    getMyId('cartHTML').innerHTML = renderHTML;

    getMyId('showCart').style.display = 'block'

}


// xóa sản phẩm khỏi giỏ hàng
function deletedCart(id) {
    for (let i = 0; i < cartItem.length; i++) {
        if (cartItem[i].product.id === id) {
            cartItem.splice(i, 1);
        }
    }
    
    
    // tính số lượng sản phẩm
    let tagSpan = cartItem.reduce((SL, item) => {
        return SL += item.quantity
    }, 0)
    //in số lượng ra giỏ hàng  
    getMyId('quantity').innerHTML = tagSpan;

    renderCart()

    //luu xuống local
    setLocalStorage('cartLocal', cartItem);
}

//them so luong
function addQuantity(id) {
    let quantity = cartItem.find(sp => sp.product.id === id);

    // tăng số lượng trong giỏ hàng
    if(quantity){
        let count = quantity.quantity += 1;
    }


    // tính số lượng sản phẩm
    let tagSpan = cartItem.reduce((SL, item) => {
        return SL += item.quantity
    }, 0);
    //in số lượng ra giỏ hàng  
    getMyId('quantity').innerHTML = tagSpan;
    //render cập nhật lại số lượng
    renderCart()
    
    //luu lại xuống local
    setLocalStorage('cartLocal', cartItem);
}

// giảm số lượng sản phẩm giỏ hàng
function reduceNum(id) {
    let quantity = cartItem.find(sp => sp.product.id === id);

    // giảm số lượng trong giỏ hàng
    let count = quantity.quantity -= 1;


    // tính số lượng sản phẩm
    let tagSpan = cartItem.reduce((SL, item) => {
        return SL += item.quantity
    }, 0)
    //in số lượng ra giỏ hàng  
    getMyId('quantity').innerHTML = tagSpan;

     //render cập nhật lại số lượng
     renderCart()
    // nếu giảm về 0 thì xóa khỏi giỏ hàng
    if (count <= 0) {
        // lặp qua mảng kiếm đối tượng giảm cần xóa
        for (let i = 0; i < cartItem.length; i++) {
            if (cartItem[i].product.id === id) {
                cartItem.splice(i, 1);

            }
        }
        // xóa xong render lại mảng
        renderCart()
    }
    // luu xuống local
    setLocalStorage('cartLocal', cartItem);

   
}

// xóa toàn bộ giỏ hàng
function deleteAllCart() {
    cartItem = [];
    
    // tính số lượng sản phẩm
    let tagSpan = cartItem.reduce((SL, item) => {
        return SL += item.quantity
    }, 0)
    //in số lượng ra giỏ hàng  
    getMyId('quantity').innerHTML = tagSpan;

    // luu xuống local
    setLocalStorage('cartLocal', cartItem);

    renderCart()
    closeCart('showCart')

}



// Thánh toán giỏ hàng
function payment() {
    // kiểm tra nếu mảng trống thì không làm gì cả
    if(cartItem.length <= 0){
        return
    } 
    // xứ lý mở thẻ div lên và đóng giỏ hàng lại
    getMyId('paypalAll').style.display = 'block';
    closeCart('showCart')
    
    // tính tổng tiền
    let total = cartItem.reduce((totalAll, item, index) => {
        return totalAll += item.product.price;
    }, 0);
    //render sản phẩm ra giao diện
    let tagHTML = '';
    cartItem.map((item) => {
        tagHTML += `  
        
        <tr>
                  <td>${item.product.name}</td>
                  <td>X ${item.quantity}</td>
                  <td>${item.product.price.toLocaleString()} $</td>
                </tr>
        `
    });
    getMyId('renderPayment').innerHTML = tagHTML;

    //in tổng tiền
    getMyId('totalPayment').innerHTML = total.toLocaleString() + ' $';
}

// hoan tat thanh toan

function completedPay() {

    
    // đóng giao diện
    closeCart('paypalAll');
    // xóa mảng sản phẩm giỏ hàng
    deleteAllCart()


    // thông báo cho người dùng
    alert('Thanh Toán Thành Công')

}


// close cart
function closeCart(id) {
    // nếu không truyền id thì id sẽ là 'showCart'
    if(!id) id = 'showCart';
    getMyId(id).style.display = 'none';
}

// render sản phẩm giỏ hàng
function renderQuantity() {
    
}
// load lại data dưới local

function reloadData() {
    cartItem = getLocalStorage('cartLocal');

    let quantity = cartItem.reduce((total,item) => {
        return total += item.quantity;
    },0)
   getMyId('quantity').innerHTML = quantity

   
}

/**
Phần giao diện em và trí cùng làm để cho kịp deadline phần chức năng của ai người đó code
cám ơn giảng viên và mentor đã chấm bài.
bài tập làm còn nhiều thứ chưa được tối ưu mong nhận được sự góp ý của giảng viên và mentor để em phát
triển hơn trong tương lai.
 */









