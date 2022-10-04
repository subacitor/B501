$(document).ready(function () {
    loadData();
    loadDataQLTT();
    loadDataList();
    
    loadDataQLTT_ketthuc();
    
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    document.getElementById("ngayBatdau").value = day + "/" + month + "/" + year;
});

var arrEle;
function loadData() {
    $("#tblAct tbody").empty();
    var strResult = "";
    $.ajax(
        {
            url: "https://62874cbde9494df61b35fb64.mockapi.io/dataUserTest",
            type: "GET",
            dataType: "json",
            success: function (data) {
                arrEle = data;
                for (var i = 0; i < data.length; i++) {
                    strResult = strResult + "<tr>" +
                        "<td class='something' >" + data[i].id + "</td>" +
                        "<td>" + data[i].username + "</td>" +
                        "<td>" + data[i].password + "</td>" +
                        "<td>" + data[i].role + "</td>" +
                        "<td>" + '<img id=""  src="'+data[i].img+'" width="40px"  >' + "</td>" +
                        "<td>" +
                        '<img id="editIMG" class="actionIcon" src="img/download.png" onclick="editE(' + data[i].id + ')" alt="Edit" srcset=" ">' + 
                        '<img class="actionIcon" src="img/2496733.png" onclick="deleteE(' + data[i].id + ')" alt="Delete" srcset=" ">' +
                        "</td>" +
                        "</tr>";
                }
                console.log(strResult);
                $("#tblAct tbody").append(strResult);
            }
        }
    );
}

// =====================================================================================================================
// list
var arrEleList;
function loadDataList() {
    $("#tblActList tbody").empty();
    var strResultList = "";
    $.ajax(
        {
            url: "https://62874cbde9494df61b35fb64.mockapi.io/dataUserTest",
            type: "GET",
            dataType: "json",
            success: function (data) {
                arrEleList = data;
                for (var i = 0; i < data.length; i++) {
                    strResultList = strResultList + "<tr>" +
                    "<td class='something' >" + data[i].id + "</td>" +
                    "<td>" + data[i].username + "</td>" +
                    "<td>" + "********" + "</td>" +
                    "<td>" + data[i].role + "</td>" +
                    "<td>" + '<img id=""  src="'+data[i].img+'" width="40px"  >' + "</td>" +
                    "</tr>";
                }
                console.log(strResultList);
                $("#tblActList tbody").append(strResultList);
            }
        }
    );
}

// ==============================================================================================================

$("#btnModalAdd").click(function () {
    var data = {};
    data.username = $("#username").val();
    data.password = $("#password").val();
    data.role = $("#role").val();
    data.img = $("#img").val();

    $.ajax({
        url: "https://62874cbde9494df61b35fb64.mockapi.io/dataUserTest",
        type: "POST",
        data: data,
        success: function (result) {
            $("#form-to-add").css("display", "none");
            $("#tbody").empty();
            loadData();
            loadDataList();
        }
    })
    console.log(data);
});

$("#btnModalUpdate").click(function(){
    var dataUpdate = {};
    dataUpdate.username = $("#usernameUpdate").val();
    dataUpdate.password = $("#passwordUpdate").val();
    dataUpdate.role = $("#roleUpdate").val();
    dataUpdate.img = $("#imgUpdate").val();
    var id = $("#txtId").val();
    console.log(dataUpdate);

    $.ajax({
        url: "https://62874cbde9494df61b35fb64.mockapi.io/dataUserTest/" + id,
        type: "PUT",
        data: dataUpdate,
        success: function () {
            //dong form
            $("#ModalEdit").css("display", "none");
            loadData();
            loadDataList();
        }
    })
});

// ============================================================
//Delete Function
function deleteE(id) {
    $.ajax({
        url: "https://62874cbde9494df61b35fb64.mockapi.io/dataUserTest/" + id,
        type: "DELETE",
        success: function (data) {
            console.log(data);
            loadData();
            loadDataList();
        }
    })
}

// ============================================================

//Edit Function
function editE(id){
    $("#ModalEdit").css("display", "block");
    for (var i = 0; i < arrEle.length; i++) {

        if (arrEle[i].id == id) {
            $("#txtId").val(arrEle[i].id);
            $("#usernameUpdate").val(arrEle[i].username);
            $("#passwordUpdate").val(arrEle[i].password);
            $("#roleUpdate").val(arrEle[i].role);
            $("#imgUpdate").val(arrEle[i].img);
            break;
        }
    }
    loadData();
    loadDataList();
}
$("#editIMG").click(function(){
    $("#ModalEdit").css("display","block");
})
$("#btnModalCancelEdit").click(function(){
    $("#ModalEdit").css("display","none");
})

$("#btnModalCancel").click(function () {
    $("#form-to-add").css("display", "none");
})
