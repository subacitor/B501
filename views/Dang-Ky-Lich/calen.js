$( document ).ready(function() {
    loadData();
    
});


var arrEle;
function loadData() {
    var strResult = "";
    $("#tblAct tbody").empty();
    $.ajax(
        {
            url: "https://62b47b4c530b26da4cbf9d4f.mockapi.io/calendarB304",
            type: "GET",
            dataType: "json",
            success: function (data) {
                arrEle = data;
                for (var i = 0; i < data.length; i++) {
                    strResult = strResult + "<tr>" +
                        "<td>" + data[i].NgayMuon + "</td>" +
                        "<td style='width: 20%'>" + data[i].username + "</td>" +
                        "<td style='width: 19%'>" + data[i].Time + "</td>" +
                        "<td>" + data[i].SoLuong + "</td>" +
                        "<td style='width: 20%'>" + data[i].LyDo + "</td>" +
                        "<td>" + data[i].TrangThai + "</td>" +
                        '<td class="btn-show-menu-select" onclick="show__menu('+ arrEle[i].id +')">' + "<i class='fa-solid fa-ellipsis-vertical'></i>" +  '</td>' +
                        "<td class = 'menu-select menu' id='suba["+arrEle[i].id+"]' >" + 
                        '<img class="actionIcon" src="img/download.png" onclick="iconclick(' + arrEle[i].id + ')" alt="Delete" srcset=" ">' +
                        '<img class="actionIcon" src="img/2496733.png" onclick="deleteE(' + data[i].id + ')" alt="Delete" srcset=" ">' +
                        "</td>"+
                        "</tr>"; 
                }
                // console.log(strResult);
                $("#tblAct tbody").append(strResult);
            }
        }
    );
}



function show__menu(id){
   console.log(id);
    $("#suba\\["+id+"\\]").fadeIn(200);
}
// ====================================

// window.onclick = function(event) {
//     if (event.target == menu) {
//         menu.style.display = "none";
//       }
//   }

$(".btn-xac-nhan").click(function () {
    var data = {};
    data.username = $("#username").val();
    data.Time = $("#Time").val();
    data.SoLuong = $("#SoLuong").val();
    data.LyDo = $("#LyDo").val();
    data.NgayMuon = $("#NgayMuon").val();
    data.TrangThai = "Đang chờ duyệt";

 

    $.ajax({
        url: "https://62b47b4c530b26da4cbf9d4f.mockapi.io/calendarB304",
        type: "POST",
        data: data,
        success: function (result) {
            $(".order-lich").hide();
            $("#tbody").empty();
            window.location.href='lich-su.html';
            loadData();
        }
    })
    console.log(data);
});

function deleteE(id) {
    $.ajax({
        url: "https://62b47b4c530b26da4cbf9d4f.mockapi.io/calendarB304/" + id,
        type: "DELETE",
        success: function (data) {
            console.log(data);
            loadData(); 
        }
    })
}



$('#close-modal').click(function () {
    $('.modal').fadeOut(150);
    $(".order-lich").fadeOut(150);
});
$('.edit-icon').click(function () {
    $('.modal_edit_in4').fadeIn(150);
});

$('.btn-xac-in4-user').click(function () {
    $('.modal_edit_in4').fadeOut(150);
});
$('.btn-huy-in4-user').click(function () {
    $('.modal_edit_in4').fadeOut(150);
});


