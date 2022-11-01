/**
Trang quản lý sản phẩm và người dùng 

Người tạo : NGUYỄN THANH TIẾN

*/



// rút gọn cú pháp DOM
function getMyId(id) {
    return document.getElementById(id);
}

// URL API PHONE
const URI = "https://6336fca465d1e8ef2677b3aa.mockapi.io/phone";


// MẢNG SẢN PHẨM
let phoneList = [];

// GỌI HÀM GET API CHẠY ĐỂ HIỆN GIAO DIỆN
window.onload = () => {
    getDataPhone();
};

// call API xuống database lấy dữ liệu in ra giao diện
function getDataPhone() {

    axios({
        method: "get",
        url: URI,
        
    }).then((res) => {
        //render ra giao diện
        renderPhone(res.data);
        //luu xuong localstorage
        setPhoneListLocal(res.data);
    }).catch((err) => {
        console.log(err);
    });
    
};

// luu xuống local storage để tìm kiếm
function setPhoneListLocal(listSP) {
    localStorage.setItem('PhoneList', JSON.stringify(listSP));
} 
function getPhoneListLocal() {
    let result = JSON.parse(localStorage.getItem('PhoneList'));
    return result;
}

// ADD BTN ADD PRODUCT
getMyId("btnThemSP").addEventListener("click",function(){
    var footerEle = document.querySelector(".modal-footer");
    footerEle.innerHTML = `
        <button onclick="createPhone()" type="submit" class="btn btn-success">Add Product</button>
    `;
});



// CREAT A NEW PRODUCT FUNCTION
createPhone = () => {

    // kiểm tra định dạng
    let isValidForm = validForm();

    if(!isValidForm) return;

    let name = getMyId('TenSP').value;
    let type = getMyId('type').value;
    let price = Number(getMyId('GiaSP').value);
    let image = getMyId('HinhSP').value;
    let content = getMyId('MoTa').value; 

    let newPhone = new Phone(name, type, price, image, content);

    
    
    // Call API POST lưu sản phẩm mới xuống dB
        axios({
            url: URI,
            method: 'post',
            data: newPhone,
        }).then((res) => {
            // gọi hàm get chạy lại để cập nhật lại giao diện
            getDataPhone();
            // TĂT FORM KHI TẠO THÀNH CÔNG
            document.querySelector("#myModal .close").click();
            getMyId('resetForm').reset();
        }).catch((err) => {
            console.log(err);
        });    
}


// RENDER SẢN PHẨM RA GIAO DIỆN
function renderPhone(arrPhone) {
    
    let phoneHTML = "";
    
     
    arrPhone.map((sp,i) => {
        phoneHTML += `<tr>
        <td>${i + 1}</td>
        <td>${sp.name}</td>
        <td>$ ${sp.price.toLocaleString()}</td>
        <td><img src="${sp.image}" alt="" class="img-fluid" style="width: 100px"></td>
        <td>${sp.content}</td>
        <td>
        <button onclick="showPhone('${sp.id}')" class="btn btn-success"><i class="fa fa-cog"></i></button>
        <button onclick="deleteItem('${sp.id}')" class="btn btn-danger"><i class="fa fa-times"></i></button>
        </td>        
      </tr> `
    });

    getMyId('tblDanhSachSP').innerHTML = phoneHTML;
}

// Delete Product

deleteItem = (idItem) => {

    axios({
        url: URI + '/' + idItem ,
        method: "DELETE",
    }).then((res) => {
        getDataPhone();
    }).catch((err) => {
        console.log(err);
    })
}

// update đổ thông tin lên form

function showPhone(idItem) {
    let isValid = validForm();

    if(!isValid) {
        getMyId('spanName').innerHTML = '';
        getMyId('spanType').innerHTML = '';
        getMyId('spanPrice').innerHTML = '';
        getMyId('spanImage').innerHTML = '';
        getMyId('spanDescrepttion').innerHTML = '';

    }

    axios({
        url: URI + "/" + idItem ,
        method: "get"
    }).then((res) => {
        getMyId('btnThemSP').click();
        
        //LÀM GỌN KẾT QUẢ TRẢ VỀ
        const { name, type, price, image, content} = res.data;
        // ĐỔ THÔNG TIN LÊN LẠI INPUT\
        
        getMyId('TenSP').value = name;
        getMyId('type').value = type;
        getMyId('GiaSP').value = price;
        getMyId('HinhSP').value = image;
        getMyId('MoTa').value = content; 

        console.log(URI + '/' + res.data.id)
        
        document.querySelector('.modal-footer').innerHTML = 
        `<button onclick="updatePhone('${res.data.id}')" class="btn btn-success">Submit</button>`
       
    }).catch((err) => {
        console.log(err);
    });
   

}

// uapdated

function updatePhone (phoneId) {
    
       
    
    let name = getMyId('TenSP').value;
    let type = getMyId('type').value;
    let price = Number(getMyId('GiaSP').value);
    let image = getMyId('HinhSP').value;
    let content = getMyId('MoTa').value; 

    const updatePhone = new Phone(name, type, price, image, content); 

    axios ({
        url: "https://6336fca465d1e8ef2677b3aa.mockapi.io/phone/" + phoneId,
        method: 'put',
        data: updatePhone,
    }).then( (res) => {

        //get lại dữ liệu
        getDataPhone();
        // close modal and reset from
        document.querySelector("#myModal .close").click();
        getMyId('resetForm').reset();
        
    }).catch( (err) => {
         console.log(err);
    });
}





// SEARCH PHONE : id; type; name
function searchPhone() {
    let keyWord = getMyId('inputTK').value.toLowerCase().trim();
    let localPhone = getPhoneListLocal()
    
    let result = [];
   
    for (let i = 0; i < localPhone.length; i++) {
        let phoneId = localPhone[i].id;
        let phoneName = localPhone[i].name.toLowerCase().trim();
        let phoneType = localPhone[i].type;
        

        if (phoneId === keyWord || phoneName.includes(keyWord) || phoneType.includes(keyWord)) {
            result.push(localPhone[i]);
        }
    }
    renderPhone(result);
}

// requied
function required(value, tagSpan, text) {
    if(value.length === 0){
        getMyId(tagSpan).innerHTML = text;
        return false;
    }
    getMyId(tagSpan).innerHTML= '';
    return true;
}

// valid form

function validForm() {
    let name = getMyId('TenSP').value;
    let type = getMyId('type').value;
    let price = getMyId('GiaSP').value;
    let image = getMyId('HinhSP').value;
    let content = getMyId('MoTa').value;

    isValid = true;

    isValid &= required(name, 'spanName', '*Tên sản phẩm không được để trống');
    isValid &= required(type, 'spanType', '*Loại sản phẩm không được để trống');
    isValid &= required(price, 'spanPrice', '*Giá sản phẩm không được để trống');
    isValid &= required(image, 'spanImage', '*Hình sản phẩm không được để trống')
    isValid &= required(content, 'spanDescrepttion', '*Mô tả sản phẩm không được để trống');

    return isValid;
}



