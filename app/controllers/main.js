var sanPhamServices = new SanPhamServices();
var productList = [];
var cartSP = [];

function layDanhSachSP() {
  sanPhamServices
    .danhSachSP()
    .then(function (result) {
      hienThiSanPham(result.data);
      productList = result.data;
    })
    .catch(function (error) {});
}

function setLocalStorage(){
    localStorage.setItem("cartSP", JSON.stringify(cartSP));
}
function getLocalStorage(){
    if(localStorage.getItem("cartSP")!=null){
        cartSP = JSON.parse(localStorage.getItem("cartSP"));
    }
}
getLocalStorage();
layDanhSachSP();

function luuGioHang(){
    setLocalStorage();
    document.querySelector("#closeGioHang").click();
}

function hienThiGioHang(){
    var hienThi = `
        <thead>
            <tr>
            <th scope="col">STT</th>
            <th scope="col">Tên sản phẩm</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Giá</th>
            <th scope="col"></th>
            </tr>
        </thead>`;
    var index = 1;
    if(cartSP.length == 0){
        hienThi = "Giỏ hàng trống"
    }else{
        cartSP.map(function(SP){
            hienThi += `         
            <tbody>
                <tr>
                <th scope="row">${index}</th>
                <td>${SP.sanPham.name}</td>
                <td>
                   
                    <input type="button" value="-" class="button-minus border rounded-circle  icon-shape icon-sm mx-1" data-field="quantity" onclick=giamSoLuong("${SP.sanPham.id}")>
                    <input type="number" step="1" min="1" value="${SP.soLuong}" name="quantity" class="quantity-field border-0 text-center w-25">
                    <input type="button" value="+" class="button-plus border rounded-circle icon-shape icon-sm" data-field="quantity" onclick=tangSoLuong("${SP.sanPham.id}")>
                  
                </td>
                <td>${Number(SP.sanPham.price).toLocaleString()}</td>
                <td><button type="button" class="btn btn-danger" onclick=xoaSP("${SP.sanPham.id}")>Xoá</button></td>
                </tr>
            </tbody>
        `;
        index++;
        });
        

    }
    document.querySelector(".modal-body .table-striped").innerHTML = hienThi;    
   
}

function thanhToan(){
    cartSP = [];
    setLocalStorage();
    document.querySelector("#closeGioHang").click();
}

function tinhTienGioHang(){
    var tongTien = 0;
    cartSP.map(function(SP){
        tongTien += SP.sanPham.price * SP.soLuong;
    });
    document.getElementById("tongTien").innerHTML = tongTien.toLocaleString();
}

function xoaSP(id){
    cartSP.splice(searchViTriSPGioHang(id),1);
    hienThiGioHang();
    tinhTienGioHang();
}

function tangSoLuong(id){
    cartSP[searchViTriSPGioHang(id)].soLuong++;
    hienThiGioHang();
    tinhTienGioHang();
}
function giamSoLuong(id){
    if(cartSP[searchViTriSPGioHang(id)].soLuong > 1){
        cartSP[searchViTriSPGioHang(id)].soLuong--;
        hienThiGioHang();
        tinhTienGioHang();
    }
}

document.getElementById("gioHang").onclick = function(){
    getLocalStorage();
    hienThiGioHang();
    tinhTienGioHang();
};

function themGioHang(id){
    var viTri = searchViTriSPGioHang(id);
    if(viTri > -1){
        cartSP[viTri].soLuong++;
    }
    else{

        sp = new SanPhamCart(productList[searchViTriProductList(id)], 1);
        cartSP.push(sp);
       
    }
    setLocalStorage();
    // getLocalStorage();
    alert("Thêm vào giỏ hàng thành công");
}


function searchViTriProductList(id){
    return productList.findIndex(function(sanPham){
        return sanPham.id == id;
    });
}

function searchViTriSPGioHang(id){
    return cartSP.findIndex(function(sanPhamCart){
        return sanPhamCart.sanPham.id == id;
    })

    
}

function hienThiSanPham(danhSachSanPham) {
  var hienThi = "";
  var index = 0;
  danhSachSanPham.map(function (sanPham) {
    hienThi += `
        <div class="productList_Card">
            <div class="topBar">
                <i class="fa-brands fa-apple"></i>
            </div>
            <div class="imgContainer">  
                <img src="${sanPham.img}" alt="">     
            </div>
            <div class="botBar">
                <div class="cardProductName">${sanPham.name}</div>
                <div class="botBar_Left">
                    <a tabindex="0" class="chiTietSanPham" role="button" data-toggle="modal" data-target="#exampleModalLabelChiTiet${index}" title="Mô tả sản phẩm" data-content="And here's some amazing content. It's very engaging. Right?">Chi tiết</a>
                    <div class="themGioHang" onclick=themGioHang("${sanPham.id}")><i class="fa-solid fa-cart-plus"></i></div>
                </div>
            </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModalLabelChiTiet${index}" tabindex="-1" aria-labelledby="exampleModalLabelChiTiet" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${sanPham.name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body-detail">
                
                <div class="productImg">
                    <img src="${sanPham.img}" alt="">
                </div>
                
                <div class="description">
                    <div>Màn hình: ${sanPham.screen}</div>
                    <div>Camera trước: ${sanPham.backCamera}</div>
                    <div>Camera sau: ${sanPham.frontCamera}</div>
                    <div>Mô tả: ${sanPham.desc}</div>
             
                </div>
                <div class="price">
                    <p>Giá: $${Number(sanPham.price).toLocaleString()}</p>
                </div>


                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick=themGioHang("${sanPham.id}")>Thêm vào giỏ hàng</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                
                </div>
            </div>
            </div>
        </div>
    </div>
        `;
        index++;
  });
  document.querySelector(".productList").innerHTML = hienThi;
}


function filterNhanHang(){
   
    var type = document.querySelector(".custom-select").value;
    if(document.querySelector(".custom-select").selectedIndex >= 2){
        var mang = productList.filter(function(item){
            return type.toLowerCase() === item.type.toLowerCase();
        });
        hienThiSanPham(mang);
    }
    else{
        hienThiSanPham(productList);
    }
}

document.querySelector(".custom-select").onchange = filterNhanHang;