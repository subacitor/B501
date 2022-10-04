$( document ).ready(function() {
    loadDataUser();
});
var temp;
function loadDataUser() {
    // $("#tblAct tbody").empty();
    var User = "";
    $.ajax(
        {
            url: "https://62b47b4c530b26da4cbf9d4f.mockapi.io/dataUser",
            type: "GET",
            dataType: "json",
            success: function (data) {
                temp = data;
                for (var i = 0; i < data.length; i++) {
                    User = User + "<tr>" +
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
                console.log(User);
                $("#tblAct tbody").append(User);
            }
        }
    );
}
// Modal update
$("#btnModalUpdate").click(function(){
    var dataUpdate = {};
    dataUpdate.username = $("#usernameUpdate").val();
    dataUpdate.password = $("#passwordUpdate").val();
    dataUpdate.role = $("#roleUpdate").val();
    dataUpdate.img = $("#imgUpdate").val();
    var id = $("#txtId").val();
    console.log(dataUpdate);

    $.ajax({
        url: "https://62b47b4c530b26da4cbf9d4f.mockapi.io/dataUser/" + id,
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

//Edit Function
function editE(id){
    $("#ModalEdit").css("display", "block");
    for (var i = 0; i < temp.length; i++) {

        if (temp[i].id == id) {
            $("#txtId").val(temp[i].id);
            $("#usernameUpdate").val(temp[i].username);
            $("#passwordUpdate").val(temp[i].password);
            $("#roleUpdate").val(temp[i].role);
            $("#imgUpdate").val(temp[i].img);
            break;
        }
    }
    loadData();
    loadDataList();
}