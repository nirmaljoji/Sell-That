//for lost and found MODAL
document.getElementById("tab1").style.display = "block";
document.getElementById("tab1").className += " active";
var modal = document.getElementById("postItemModal");
var btn = document.getElementById("postbtn");
var closeOnSubmit = document.getElementById("closeOnSubmit");

var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
}

closeOnSubmit.onclick=function() {
  modal.style.display="none";
  location.reload();
}


span.onclick = function () {
  modal.style.display = "none";
}
//to close modal if user clicks anywhere outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//tabs for "Your Items"
function openTab(evt, tab) {
  var i, tabc, tabl;

  tabc = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabc.length; i++) {
    tabc[i].style.display = "none";
  }

  tabl = document.getElementsByClassName("tablinks");
  for (i = 0; i < tabl.length; i++) {
    tabl[i].className = tabl[i].className.replace(" active", "");
  }

  document.getElementById(tab).style.display = "block";
  evt.currentTarget.className += " active";
}

//form validation for tab1 in "Your Items"

function lostFoundForm() {
  var file = document.getElementsById("upload");
  if (file.files.length == 0) {
    alert("add file");
  }
  else {
    alert('hmm');
  }
}

//timer countdown 
//for now i am hard setting the id, once we have db, we will set id from there

var countDownDate = new Date("Jan 5, 2021 15:37:25").getTime();
var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  var demos = document.getElementsByClassName("demo");
  var i;
  for (i = 0; i < demos.length; i++) {
    demos[i].innerHTML = days + "d " + hours + "h left";
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("demo").innerHTML = "EXPIRED";
    }
  }

}, 1000);

//add found details to db