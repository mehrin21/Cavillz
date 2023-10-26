
$(document).ready(function () {
  $('.AddAdressbtn').on('click', function (event) {
    event.preventDefault();
    let fullname = $("#fullname").val()
    let houseno = $("#addresshouse").val()
    let street = $("#adresstreet").val()
    let state = $("#adresstate").val()
    let phone = $("#adressphone").val()
    let pincode = $("#adresspin").val()
    let email = $('#adressemail').val()

    // VALIDATE FORMAT
    let fullnameFormat = /^[A-Z][a-zA-Z\s]+$/;
    // let houseFormat = /^(?:[A-Za-z0-9\s]{3,}|[0-9]{5,})$/;
    // let streetFormat = / ^[A-Za-z0-9\s\.,#-]+$ /;
    let phoneFormat = /^\+\d{2}\s\d{10}$/;
    let pincodeFormat = /^\d{6}$/;
    let emailFormat =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let validate = true;

    if (!fullname.match(fullnameFormat)) {
      let text = "First letter must be in capital/Avoid numbers";
      document.getElementById('text1').innerHTML = text
      $('#fullname').focus();
      validate = false
    } else if (!email.match(emailFormat)) {
      let text = "enter valid address";
      document.getElementById('text7').innerHTML = text;
      $('#adressemail').focus()
      validate = false

    }
    else if (!phone.match(phoneFormat)) {
      let text = "Invalid Phone number.only +91 country code accepted"
      document.getElementById('text6').innerHTML = text
      $('#adressphone').focus()
      validate = false

    } else if (!pincode.match(pincodeFormat)) {
      let text = "enter valide pin number"
      document.getElementById('text5').innerHTML = text
      $('#adresspin').focus()
      validate = false
    }
    else {
      console.log("plz recheck everthing")
    }
    if (validate) {
      console.log(addressname)
      console.log(pincode)
      console.log(houseno)
      const data = {

        fullname: fullname,
        houseno: houseno,
        street: street,
        state: state,
        phone: phone,
        pincode: pincode,
        email: email
      }
      console.log(data)

      $.ajax({
        url: `/dashboard/addaddress`,
        method: "post",
        data: data,
        success: function (response) {
          if (response.message == "address added") {
            location.reload()
          }
        }
      })
    }
  })


  // UPADTE USER DETAILS  
  $('.updatebtn').on('click', function () {
    let fullname = $('#addressname').val()
    let house = $('#house').val()
    let street = $('#street').val()
    let state = $('#state').val()
    let pincode = $('#pincode').val()
    let phone = $('#phone').val()
    let addressid = $('#addressid').val()

    const data = {
      fullname: fullname,
      houseno: house,
      street: street,
      state: state,
      pincode: pincode,
      phone: phone,
      addressid: addressid

    }
    console.log(data)
    $.ajax({
      url: `/dashboard/updateaddress`,
      method: 'put',
      data: data,
      success: function (response) {
        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": true,
          "progressBar": false,
          "positionClass": "toast-top-right",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "200",
          "hideDuration": "500",
          "timeOut": "1000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        }
        if (response.message == "user detials updated") {
          toastr.success("user details updated successfully", "Success")
          location.reload()

        } else if (response.message == "already exist") {
          toastr.info("this address is already exist")
        }
      }
    })

    // PRODUCT REMOVING
  });
  $(".removebtn").on('click', function () {
    console.log("delete button clicked")
    let cartid = $(this).attr('data-cartid');
    let id = $(this).attr('data-id');

    console.log(cartid)
    console.log(id);

    $.ajax({
      url: `/cartdel`,
      method: "put",
      data: {
        id: id,
        cartid: cartid
      },
      success: function (response) {
        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": true,
          "progressBar": false,
          "positionClass": "toast-top-right",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "200",
          "hideDuration": "500",
          "timeOut": "1000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        }

        if (response.message == "deleted") {
          toastr.info("Product Removed Successfully", "Success")
          location.reload();

        }
      }
    })
  })

  // PRODUCT PLUSIING
  $(document).ready(function () {
  updateTotal()
  })
  function updateTotal() {
    let sum = 0;
  
    $("#myTable > tbody > tr").each(function () {
      let qty = parseFloat($(this).find(".qty").val());
      let price = parseFloat($(this).find(".price").text().replace("₹", ""));
      let amount = qty * price;
      sum += amount;
    });
  
    $(".subtotal .total").text("₹" + sum.toFixed(2));
  }

  $('.plus').on('click', function () {
    console.log('plus button clicked')

    let $quantityInput = $(this).siblings('.qty');

    let value = parseInt($quantityInput.val(), 10);
    value = isNaN(value) ? 0 : value;
    value++;
    $quantityInput.val(value)

    let id = $quantityInput.data('id')
    console.log(id)
    // Get the product price from the same row
    let productPrice = parseFloat($(this).closest('tr').find('.price-col').text().replace('₹', ''));
    console.log("productPrice " + productPrice)

    let newTotal = value * productPrice;
    $(this).closest('tr').find('.total-col').text('₹' + newTotal.toFixed(2));
    updateTotal()
    const data = {
      incQuantity: value,
      id: id,
      // $quantityInput.text():

    }
    console.log(data)
    $.ajax({
      url: `/cartIn`,
      method: 'put',
      data: data,
      success: function (response) {
        console.log(response)
        if (response.message == "increment") {

          window.location.reload();

        }
      }
    })
  })


  // decrement 

  $('.minus').on('click', function () {
    console.log("minus button is clicked")

    let $quantityInput = $(this).siblings('.qty');
    let value = parseInt($quantityInput.val(), 10)
    value = isNaN(value) ? 0 : value;
    if (value > 1) {
      value--;
      $quantityInput.val(value);
    }
    let id = $quantityInput.data('id');
    let productPrice = parseFloat($(this).closest('tr').find('.price-col').text().replace('₹', ''));
    console.log("productPrice " + productPrice)

    let newTotal = value * productPrice;
    $(this).closest('tr').find('.total-col').text('₹' + newTotal.toFixed(2));
   
    updateTotal()

    const data = {
      value: value,
      id: id
    }
    console.log(data)

    $.ajax({
      url: `/cartd`,
      method: 'put',
      data: data,
      success: function (response) {
        console.log(response)
        if (response.message == "decrement") {
          $quantityInput.val(response.quantity)
          // console.log("yes")
          // window.location.reload()
        }
      }
    })
  })
})


// WISHLIST REMOVING
$('.wishlistRemoveBtn').on('click', function () {
  console.log("bt is clicked")
  let wishid = $(this).attr('data-wishlistid');
  let id = $(this).attr('data-id')
  console.log("product " + id)


  $.ajax({
    url: `/wishlistremove`,
    method: "put",
    data: {
      id: id,
      wishid: wishid
    },
    success: function (response) {
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "200",
        "hideDuration": "500",
        "timeOut": "1000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      if (response.message == "deleted") {
        toastr.info("Product Removed Successfully", "Success")

      } else {
        toastr.info("Something is wrong", "Info")
      }
    }
  })

})




// edit button
$(document).ready(function () {
  $('#savebtn').on('click', function (event) {
    event.preventDefault();
    console.log("btn clicked")
    let fullname = $('#editname').val()
    console.log(fullname)
    let house = $('#edithouse').val()
    let street = $('#editstreet').val()
    let state = $('#editstate').val()
    let pincode = $('#editpincode').val()
    let phone = $('#editphone').val()
    let editaddress = $('#editaddressid').val()
    console.log("editaddress " + editaddress)

    let fullname_format = /^[A-Za-z\s]+$/
    let house_format = /^[A-Za-z\s'".-]*$/
    let street_format = /^[A-Za-z\s'".-]*$/
    let pincode_format = /^\d{6}$/
    let phone_format = /^\+91 [1-9][0-9]{9}$/
    let validate = true

    if (!fullname.match(fullname_format)) {
      let text = "Error"
      document.getElementById('editname_1').innerHTML = text
      $('#editname').focus()
      validate = false
    }
    else if (!house.match(house_format)) {
      let text = "plz enter the correct data"
      document.getElementById('edithouse_2').innerHTML = text
      $('#edithouse').focus()
      validate = false
    }
    else if (!street.match(street_format)) {
      let text = "plx enter the correct data"
      document.getElementById('editstreet_3').innerHTML = text
      $('#editstreet').focus()
      validate = false
    } else if (!pincode.match(pincode_format)) {
      let text = "plz enter valid pincode"
      document.getElementById('editpincode_4').innerHTML = text
      $('#editpincode').focus()
      validate = false
    } else if (!phone.match(phone_format)) {
      let text = "plx enter the country code +91"
      document.getElementById('editphone_5').innerHTML = text
      $('#editphone').focus()
      validate = false
    } else {
      console.log("everthing is ok")
    }
    if (validate) {

      const edit_data = {
        fullname: fullname,
        house: house,
        street: street,
        state: state,
        pincode: pincode,
        phone: phone,
        editaddress: editaddress
      }
      console.log(edit_data)

      $.ajax({
        url: `/editaddress`,
        method: "POST",
        data: edit_data,
        success: function (response) {
          console.log(response)
          toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "200",
            "hideDuration": "500",
            "timeOut": "1000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
          if (response.message === 'updated successfully') {

            window.location.reload()
          } else {
            toastr.info("address already exist", "info")
          }
        }

      })
    }
  })
})

// DELETE ADDRESS BTN
$(document).ready(function () {
  $('.deleteaddress').on('click', function () {
    console.log("delete btn clicked")
    let delete_btn = $(this).attr('data-id')
    console.log(delete_btn)
    const data = {
      address: delete_btn
    }
    $.ajax({
      url: `/addresses/${delete_btn}`,
      method: "DELETE",
      data: data,
      success: function (response) {
        console.log(response)
        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": true,
          "progressBar": false,
          "positionClass": "toast-top-right",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "200",
          "hideDuration": "500",
          "timeOut": "1000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        }
        if (response.message === "deleted") {
          toastr.success("deleted successfully", "Success")
          window.location.reload()
        }
      }
    })
  })
})

    // $(document).ready(function() {
    //     // Handle the "Edit" button click
    //     $(".edit-address").click(function() {
    //         var addressIndex = $(this).data("index");
    //         var addressId = $(this).data("address-id");
    //         var address = user.address[addressIndex];

    //         // Populate the modal form fields with the details of the selected address
    //         $("#editname").val(address.fullname);
    //         $("#edithouse").val(address.houseno);
    //         $("#editstreet").val(address.street);
    //         $("#editstate").val(address.state);
    //         $("#editpincode").val(address.pincode);
    //         $("#editphone").val(address.phone);
    //         $("#editemail").val(address.email);
    //         $("#editaddressid").val(addressId);
    //     });
    // });
